const isImage = (msg) => {
    return msg?.message?.imageMessage ? true : false
}

const isAudio = (msg) => {
    return msg?.message?.audioMessage ? true : false
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


export {
    isAudio,
    isImage,
    simulateEndPause,
    simulateTyping,
    formatText,
    timeout,
    isQuotedMessage
}