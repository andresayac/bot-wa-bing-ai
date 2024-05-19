/* eslint-disable complexity */
import pkg from '@bot-whatsapp/bot'
import BaileysProvider from '@bot-whatsapp/provider/baileys'
import JsonFileAdapter from '@bot-whatsapp/database/json'
import dotenv from 'dotenv-safe'
import { oraPromise } from 'ora'
import PQueue from 'p-queue'
import { processAudioToText } from './services/Huggingface.js'
import {
    isAudio,
    isImage,
    isPdf,
    isPdfWithCaption,
    simulateTyping,
    simulateEndPause,
    formatTextWithLinks,
    parseLinksWithText,
    timeout,
    divideTextInTokens,
    removeEmojis,
} from './utils/index.js'
import { downloadMediaMessage } from '@whiskeysockets/baileys'
import BingAI from './services/BingAI.js'
import { pdfToText } from './services/PdfToText.js'
import { textToSpeech } from './services/TextToSpeech.js'
import languages from './languages.js'

dotenv.config({
    allowEmptyValues: true,
})

const bingAI = new BingAI({
    host: process.env.BING_AI_HOST ?? 'https://www.bing.com',
    cookies: process.env.BING_AI_COOKIES,
    genImage: process.env.BING_AI_GENERATE_IMAGE === 'true',
    debug: process.env.BING_AI_DEBUG === 'true',
})

const bingAIMode = process.env.BING_AI_MODE ?? 'precise'

const languageBot = languages[process.env.BOT_LANGUAGE ?? 'es']

const { createBot, createProvider, createFlow, addKeyword, EVENTS } = pkg

const systemMessage = process.env.BING_AI_SYSTEM_MESSAGE ?? '🤖'

const maxTimeQueue = 600000
const queue = new PQueue({ concurrency: 3 })

const flowBotImage = addKeyword(EVENTS.MEDIA).addAction(async (ctx, { gotoFlow }) => {
    gotoFlow(flowBotWelcome)
})

const flowBotDoc = addKeyword(EVENTS.DOCUMENT).addAction(async (ctx, { gotoFlow }) => {
    gotoFlow(flowBotWelcome)
})

const flowBotAudio = addKeyword(EVENTS.VOICE_NOTE).addAction(async (ctx, { gotoFlow }) => {
    gotoFlow(flowBotWelcome)
})

const flowBotLocation = addKeyword(EVENTS.LOCATION).addAction(async (ctx, { flowDynamic }) => {
    flowDynamic(languageBot.notAllowLocation)
})

const flowBotWelcome = addKeyword(EVENTS.WELCOME).addAction(
    async (ctx, { fallBack, flowDynamic, endFlow, gotoFlow, provider, state }) => {
        // Simulate typing
        await simulateTyping(ctx, provider)

        if (state.getMyState()?.finishedAnswer === false) {
            flowDynamic(languageBot.oneMessageAtTime)
            await fallBack()
            return
        }

        let isAudioConversation = false
        let isPdfConversation = false
        let checkIsoLanguage = null
        let messageBot = null
        let messageBotTmp = ''

        if (isAudio(ctx)) {
            if (process.env.BOT_RECONGNIZE_AUDIO === 'true') {
                isAudioConversation = true
                // Process audio
                await flowDynamic(languageBot.listeningToAudio)
                const buffer = await downloadMediaMessage(ctx, 'buffer')
                const response = await processAudioToText(buffer, ctx.key.id + '.ogg')
                if (response.success) {
                    ctx.body = response.output.data[0] + ' ' + languageBot.instructionsGetIsoLanguaje
                } else {
                    await flowDynamic(languageBot.errorProcessingAudio)
                    await gotoFlow(flowBotWelcome)
                    return
                }
            } else {
                await flowDynamic(languageBot.notAllowReconizeAudio)
                await fallBack()
                return
            }
        }

        let imageBase64 = null
        let context = state.getMyState()?.context ?? null

        if (isImage(ctx)) {
            if (process.env.BOT_RECONGNIZE_IMAGE === 'true') {
                messageBot = await provider.vendor.sendMessage(ctx?.key?.remoteJid, { text: '🔍🖼️⏳💭' }, { quoted: ctx })
                await simulateEndPause(ctx, provider)
                await simulateTyping(ctx, provider)
                const buffer = await downloadMediaMessage(ctx, 'buffer')
                // Buffer to base64
                imageBase64 = buffer.toString('base64')
                ctx.body = ctx.message?.imageMessage?.caption ?? ''
            } else {
                await flowDynamic(languageBot.notAllowReconizeImage)
                await fallBack()
                return
            }
        }

        if (isPdf(ctx)) {
            if (process.env.BOT_RECONGNIZE_PDF === 'true') {
                isPdfConversation = true
                messageBot = await provider.vendor.sendMessage(ctx?.key?.remoteJid, { text: '🔍📄⏳💭' }, { quoted: ctx })
                await simulateEndPause(ctx, provider)
                await simulateTyping(ctx, provider)
                const buffer = await downloadMediaMessage(ctx, 'buffer')
                // Buffer to base64
                ctx.body = languageBot.instructionsPdf
                const pdfText = await pdfToText(buffer)
                context = divideTextInTokens(pdfText, 10000)
                context = context[0].substring(0, 10000)

                state.update({
                    context,
                })
            } else {
                await flowDynamic(languageBot.notAllowReconizePdf)
                await fallBack()
                return
            }
        }

        if (isPdfWithCaption(ctx)) {
            if (process.env.BOT_RECONGNIZE_PDF === 'true') {
                messageBot = await provider.vendor.sendMessage(ctx?.key?.remoteJid, { text: '🔍📄⏳💭' }, { quoted: ctx })
                await simulateEndPause(ctx, provider)
                await simulateTyping(ctx, provider)
                const buffer = await downloadMediaMessage(ctx, 'buffer')
                // Buffer to base64
                ctx.body =
                    ctx.message?.documentWithCaptionMessage?.message.documentMessage?.caption ??
                    languageBot.instructionsPdf
                const pdfText = await pdfToText(buffer)
                context = divideTextInTokens(pdfText, 10000)
                context = context[0].substring(0, 10000)
            } else {
                await flowDynamic(languageBot.notAllowReconizePdf)
                await fallBack()
                return
            }
        }

        if (messageBot === null) {
            messageBot = await provider.vendor.sendMessage(ctx?.key?.remoteJid, { text: '🔍⏳💭' }, { quoted: ctx })
        }

        // Restart conversation fr, es, en, zh, it, pr
        if (
            ctx.body.toLowerCase().trim().includes('/reiniciar') ||
            ctx.body.toLowerCase().trim().includes('/restart') ||
            ctx.body.toLowerCase().trim().includes('/重新开始') ||
            ctx.body.toLowerCase().trim().includes('/recommencer')
        ) {
            state.update({
                name: ctx.pushName ?? ctx.from,
                conversationBot: null,
                conversationNumber: 0,
                finishedAnswer: true,
            })

            await flowDynamic(languageBot.restartConversation)
            await simulateEndPause(ctx, provider)
            await endFlow()

            return
        }

        if (!state?.getMyState()?.conversationBot) {
            const prompt = ctx.body.trim()

            try {
                const response = await queue.add(async () => {
                    try {
                        return await Promise.race([
                            oraPromise(
                                bingAI.sendMessage(prompt, {
                                    jailbreakConversationId: true,
                                    toneStyle: isPdfConversation ? 'creative' : bingAIMode, // Values [creative, precise, fast] default: balanced
                                    plugins: [],
                                    persona: process.env.BING_AI_PERSONA ?? '',
                                    ...(context && { context }),
                                    ...(imageBase64 && { imageBase64 }),
                                    systemMessage,
                                    onProgress(token) {
                                        if (process.env.BOT_MESSAGE_ON_PROCESS === 'true') {
                                            if (token.includes('iframe')) {
                                                return // Skip iframes
                                            }

                                            messageBotTmp += token
                                            provider.vendor.sendMessage(ctx?.key?.remoteJid, {
                                                edit: messageBot.key,
                                                text: formatTextWithLinks(messageBotTmp),
                                            })
                                        }
                                    },
                                }),
                                {
                                    text: `[${ctx.from}] - ${languageBot.waitResponse}: ` + prompt,
                                },
                            ),
                            timeout(maxTimeQueue),
                        ])
                    } catch (error) {
                        console.error(error)
                    }
                })

                if (isAudioConversation) {
                    checkIsoLanguage = response.response.match(/\{[a-z]{2}\}/g) ?? 'es'
                    checkIsoLanguage = checkIsoLanguage[0] ?? 'es'
                    // Remove iso language in response
                    response.response = response.response.replace(checkIsoLanguage, '')
                }

                await provider.vendor.sendMessage(ctx?.key?.remoteJid, {
                    edit: messageBot.key,
                    text: parseLinksWithText(response?.response) ?? 'Error',
                })

                if (isAudioConversation && process.env.BOT_TEXT_TO_SPEECH === 'true') {
                    checkIsoLanguage = checkIsoLanguage.replace('{', '').replace('}', '')
                    state.update({
                        finishedAnswer: true,
                    })
                    const audioBuffer = await textToSpeech(removeEmojis(response.response), checkIsoLanguage)
                    await provider.vendor.sendMessage(ctx?.key?.remoteJid, { audio: audioBuffer }, { quoted: ctx })
                }

                const isImageResponse = await bingAI.detectImageInResponse(response)

                if (isImageResponse?.srcs?.length > 0) {
                    const srcs = isImageResponse.srcs.map((src) => {
                        return src.replace('w=270&h=270', 'w=1024&h=1024')
                    })
                    let urls = ''
                    srcs.forEach(async (src, index) => {
                        // If image not have w=1024&h=1024 continue
                        if (!src.includes('w=1024&h=1024')) {
                            return
                        }

                        await provider.vendor.sendMessage(ctx?.key?.remoteJid, {
                            image: {
                                url: src,
                            },
                        })
                        urls += isImageResponse.urls[index] + '\n'
                    })

                    await flowDynamic(urls)
                }

                state.update({
                    conversationBot: response,
                    conversationNumber: 1,
                    finishedAnswer: true,
                })
            } catch (error) {
                console.log(error)
                state.update({ finishedAnswer: true })
                await flowDynamic('Error')
                await endFlow()
            }

            // Stop typing
            await simulateEndPause(ctx, provider)
            return
        }

        if (state.getMyState()?.conversationBot?.conversationId) {
            const prompt = ctx.body.trim()

            state.update({
                finishedAnswer: false,
            })

            try {
                const response = await queue.add(async () => {
                    try {
                        return await Promise.race([
                            oraPromise(
                                bingAI.sendMessage(prompt, {
                                    jailbreakConversationId:
                                        state.getMyState()?.conversationBot.jailbreakConversationId,
                                    parentMessageId: state.getMyState()?.conversationBot.messageId,
                                    toneStyle: isPdfConversation ? 'creative' : bingAIMode, // VAlues or [creative, precise, fast] default: balanced
                                    plugins: [],
                                    ...(context && { context }),
                                    ...(imageBase64 && { imageBase64 }),
                                    onProgress(token) {
                                        if (process.env.BOT_MESSAGE_ON_PROCESS === 'true') {
                                            if (token.includes('iframe')) {
                                                return // Skip iframes
                                            }

                                            messageBotTmp += token
                                            provider.vendor.sendMessage(ctx?.key?.remoteJid, {
                                                edit: messageBot.key,
                                                text: formatTextWithLinks(messageBotTmp),
                                            })
                                        }
                                    },
                                }),
                                {
                                    text: `[${ctx.from}] - ${languageBot.waitResponse}: ` + prompt,
                                },
                            ),
                            timeout(maxTimeQueue),
                        ])
                    } catch (error) {
                        console.error(`${languageBot.errorInBot}:`, error)
                    }
                })

                if (isAudioConversation) {
                    checkIsoLanguage = response.response.match(/\{[a-z]{2}\}/g) ?? 'es'
                    checkIsoLanguage = checkIsoLanguage[0] ?? 'es'
                    // Remove iso language in response
                    response.response = response.response.replace(checkIsoLanguage, '')
                }

                if (isAudioConversation) {
                    checkIsoLanguage = checkIsoLanguage.replace('{', '').replace('}', '')
                    state.update({
                        finishedAnswer: true,
                    })
                    const audioBuffer = await textToSpeech(removeEmojis(response.response), checkIsoLanguage)
                    await provider.vendor.sendMessage(ctx?.key?.remoteJid, { audio: audioBuffer }, { quoted: ctx })
                }

                const isImageResponse = await bingAI.detectImageInResponse(response)

                if (isImageResponse?.srcs?.length > 0) {
                    const srcs = isImageResponse.srcs.map((src) => {
                        return src.replace('w=270&h=270', 'w=1024&h=1024')
                    })
                    let urls = ''
                    srcs.forEach(async (src, index) => {
                        if (!src.includes('w=1024&h=1024')) {
                            return
                        }

                        await provider.vendor.sendMessage(ctx?.key?.remoteJid, {
                            image: {
                                url: src,
                            },
                        })
                        urls += isImageResponse.urls[index] + '\n'
                    })

                    await flowDynamic(urls)
                }

                await provider.vendor.sendMessage(ctx?.key?.remoteJid, {
                    edit: messageBot.key,
                    text: parseLinksWithText(response?.response) ?? 'Error',
                })

                state.update({
                    name: ctx.pushName ?? ctx.from,
                    conversationBot: response,
                    // eslint-disable-next-line no-unsafe-optional-chaining
                    conversationNumber: state.getMyState()?.conversationNumber + 1,
                    finishedAnswer: true,
                })
            } catch (error) {
                console.error(error)
                state.update({ finishedAnswer: true })
                await flowDynamic('Error')
            }

            await simulateEndPause(ctx, provider)
        }
    },
)

const main = async () => {
    const adapterDB = new JsonFileAdapter()
    const adapterFlow = createFlow([flowBotWelcome, flowBotImage, flowBotDoc, flowBotAudio, flowBotLocation])
    const adapterProvider = createProvider(BaileysProvider)

    createBot(
        {
            flow: adapterFlow,
            provider: adapterProvider,
            database: adapterDB,
        },
        {
            globalState: {},
        },
    )
}

main()
