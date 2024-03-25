import { BingAIClient } from '@waylaidwanderer/chatgpt-api'
import cheerio from 'cheerio'

export default class BingAI {
    constructor(options) {
        this.clientOptions = options || {}

        const cacheOptions = {}

        const clientOptions = {
            cookies: this.clientOptions.cookies || null,
        }

        this.BingAIClient = new BingAIClient({
            ...clientOptions,
            cache: cacheOptions,
            features: {
                genImage: this.clientOptions.genImage || false,
            },
            debug: this.clientOptions.debug || false,
            systemMessage: process.env.BING_AI_SYSTEM_MESSAGE || 'BingAI',
        })
    }

    async sendMessage(message, options) {
        const response = await this.BingAIClient.sendMessage(message, options)
        return response
    }

    async detectImageInResponse(response) {
        const conversationResponse = response.response
        const iframeContent = response?.details?.adaptiveCards[0]?.body[0]?.text
        const html = iframeContent?.replace(conversationResponse, '') ?? ''
        const images = this.extractLinksAndImagesFromIframe(html) || []
        return images
    }

    extractLinksAndImagesFromIframe(html) {
        // Load the main HTML content
        const $ = cheerio.load(html)

        // Find the iframe and extract its srcdoc content
        const iframeSrcDoc = $('iframe').attr('srcdoc')
        if (!iframeSrcDoc) {
            return null
        }

        // Load the iframe content
        const iframe$ = cheerio.load(iframeSrcDoc)

        // Extract URLs and SRC attributes, ignoring those not starting with http or https
        const urls = iframe$('a')
            .map((i, link) => {
                return iframe$(link).attr('href')
            })
            .get()
            .filter((href) => {
                return href.startsWith('http://') || href.startsWith('https://')
            })
        const srcs = iframe$('img')
            .map((i, img) => {
                return iframe$(img).attr('src')
            })
            .get()
            .filter((src) => {
                return src.startsWith('http://') || src.startsWith('https://')
            })

        return {
            urls,
            srcs,
        }
    }
}
