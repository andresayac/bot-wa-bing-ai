const isImage = (msg) => {
    return msg?.message?.imageMessage ? true : false
}

const isAudio = (msg) => {
    return msg?.message?.audioMessage ? true : false
}

const isPdf = (msg) => {
    return msg?.message?.documentMessage?.mimetype === 'application/pdf' ? true : false
}

const isPdfWithCaption = (msg) => {
    return msg?.message?.documentWithCaptionMessage?.message.documentMessage?.mimetype === 'application/pdf' ? true : false
}


const isQuotedMessage = (msg, type = 'imageMessage') => {
    return msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage[type] ? true : false;
}

const simulateTyping = async (ctx, provider) => {
    // view message 
    await provider.vendor.readMessages([ctx?.key])
    await provider.vendor.presenceSubscribe(ctx?.key?.remoteJid)

    // simulare writing
    await provider.vendor.sendPresenceUpdate('composing', ctx?.key?.remoteJid)
}

const simulateEndPause = async (ctx, provider) => {
    await provider.vendor.sendPresenceUpdate('paused', ctx?.key?.remoteJid)
}

const formatText = (text) => {
    // replace ** to *
    text = text.replace(/\*\*/g, '*')
    text = text.replace(/\[\^[0-9]+\^\]/g, '')
    text = text.replace(/-[a-z]/g, '')

    return text

}

const timeout = (ms) => new Promise((resolve, reject) => {
    setTimeout(() => {
        reject(new Error('Tiempo de espera excedido'));
    }, ms);
});


const divideTextInTokens = (text, maxTokens = 10000) => {
    let tokens = text.split(' ');
    let segments = [];
    let currentSegment = [];

    tokens.forEach(token => {
        if (currentSegment.length + 1 <= maxTokens) {
            currentSegment.push(token);
        } else {
            segments.push(currentSegment.join(' '));
            currentSegment = [token];
        }
    });

    if (currentSegment.length > 0) {
        segments.push(currentSegment.join(' '));
    }

    return segments;
}

const removeEmojis = (text) => {
    return text.replace(/[\uD800-\uDFFF]./g, '');
}

const removeSymbols = (text, symbols = ['*']) => {    
    symbols.forEach(symbol => {
        text = text.replace(new RegExp(`\\${symbol}`, 'g'), '');
    });

    return text;

}

export {
    isAudio,
    isImage,
    isPdf,
    isPdfWithCaption,
    simulateEndPause,
    simulateTyping,
    formatText,
    timeout,
    isQuotedMessage,
    divideTextInTokens,
    removeEmojis,
    removeSymbols
}