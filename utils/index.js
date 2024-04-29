const isImage = (msg) => {
    return Boolean(msg?.message?.imageMessage)
}

const isAudio = (msg) => {
    return Boolean(msg?.message?.audioMessage)
}

const isPdf = (msg) => {
    return msg?.message?.documentMessage?.mimetype === 'application/pdf'
}

const isPdfWithCaption = (msg) => {
    return msg?.message?.documentWithCaptionMessage?.message.documentMessage?.mimetype === 'application/pdf'
}

const isQuotedMessage = (msg, type = 'imageMessage') => {
    return Boolean(msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage[type])
}

const simulateTyping = async (ctx, provider) => {
    // View message
    await provider.vendor.readMessages([ctx?.key])
    await provider.vendor.presenceSubscribe(ctx?.key?.remoteJid)

    // Simulare writing
    await provider.vendor.sendPresenceUpdate('composing', ctx?.key?.remoteJid)
}

const simulateEndPause = async (ctx, provider) => {
    await provider.vendor.sendPresenceUpdate('paused', ctx?.key?.remoteJid)
}

const formatText = (text) => {
    // Replace ** to *
    text = text.replace(/\*\*/g, '*')
    text = text.replace(/\[\^[0-9]+\^\]/g, '')
    text = text.replace(/-[a-z]/g, '')

    return text
}

const formatTextWithLinks = (text) => {
    return text
        .replace('¡1]', '[1]')
        .replace(/^(!|\[)¡?\d+\]:\s+.*\n?/gm, '')
        .replace(/^\n+/gm, '')
}

const extractLinks = (text) => {
    const links = text.match(/\[([0-9]+)\]:\s+(https?:\/\/[^\s]+)\s+""/gm)

    return (
        links?.map((link) => {
            const [index, url] = link.match(/\[([0-9]+)\]:\s+(https?:\/\/[^\s]+)\s+""/).slice(1)
            return { index, url }
        }) || []
    )
}

const parseLinksWithText = (text) => {
    const links = extractLinks(text)
    const formattedText = formatTextWithLinks(text)
    if (links.length === 0) {
        return formattedText
    }

    const linksText = links.map(({ index, url }) => {
        return `[${index}]: ${url}\n`
    })

    return `${formattedText}\n\n${linksText.join('')}`
}

const timeout = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('Tiempo de espera excedido'))
        }, ms)
    })
}

const divideTextInTokens = (text, maxTokens = 10000) => {
    const tokens = text.split(' ')
    const segments = []
    let currentSegment = []

    tokens.forEach((token) => {
        if (currentSegment.length + 1 <= maxTokens) {
            currentSegment.push(token)
        } else {
            segments.push(currentSegment.join(' '))
            currentSegment = [token]
        }
    })

    if (currentSegment.length > 0) {
        segments.push(currentSegment.join(' '))
    }

    return segments
}

const removeEmojis = (text) => {
    return text.replace(/[\uD800-\uDFFF]./g, '')
}

const removeSymbols = (text, symbols = ['*']) => {
    symbols.forEach((symbol) => {
        text = text.replace(new RegExp(`\\${symbol}`, 'g'), '')
    })

    return text
}

export {
    isAudio,
    isImage,
    isPdf,
    isPdfWithCaption,
    simulateEndPause,
    simulateTyping,
    formatText,
    formatTextWithLinks,
    parseLinksWithText,
    timeout,
    isQuotedMessage,
    divideTextInTokens,
    removeEmojis,
    removeSymbols,
}
