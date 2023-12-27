const isImage = (msg) => {
    return msg?.message?.imageMessage ? true : false
}

const isAudio = (msg) => {
    return msg?.message?.audioMessage ? true : false
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

export {
    isAudio,
    isImage,
    simulateEndPause,
    simulateTyping,
    formatText
}