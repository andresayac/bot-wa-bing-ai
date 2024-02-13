import WebSocket from 'ws'

const processImage = async (imageBuffer) => {
    const base64Image = imageBuffer.toString('base64')

    const ws = new WebSocket('wss://zerocommand-microsoft-trocr-large-printed.hf.space/queue/join', {
        origin: 'https://zerocommand-microsoft-trocr-large-printed.hf.space',
        host: 'zerocommand-microsoft-trocr-large-printed.hf.space',
        headers: {
            'Sec-Websocket-Extensions': 'permessage-deflate client_max_window_bits',
            'Sec-WebSocket-Version': '13',
        },
    })

    ws.on('open', () => {
        const sessionHash = Math.random().toString(36).substring(2)
        // eslint-disable-next-line camelcase
        ws.send(JSON.stringify({ session_hash: sessionHash, fn_index: 0 }))
        ws.send(
            // eslint-disable-next-line camelcase
            JSON.stringify({ fn_index: 0, data: ['data:image/jpegbase64,' + base64Image], session_hash: sessionHash }),
        )
    })

    try {
        const wsImageReceive = new Promise((resolve) => {
            ws.on('message', (data) => {
                const messageText = data.toString()
                if (messageText.includes('process_completed')) {
                    resolve(messageText)
                }
            })
        })

        const response = await wsImageReceive
        ws.close()

        return JSON.parse(response)
    } catch {
        ws.close()
        return { msg: 'Error al procesar la respuesta del WebSocket', success: false }
    }
}

const processAudio = async (audioBuffer, name) => {
    const base64Audio = audioBuffer.toString('base64')

    const ws = new WebSocket('wss://hf-audio-whisper-large-v3.hf.space/queue/join', {
        origin: 'https://hf-audio-whisper-large-v3.hf.space',
        host: 'hf-audio-whisper-large-v3.hf.space',
        headers: {
            'Sec-Websocket-Extensions': 'permessage-deflate client_max_window_bits',
            'Sec-WebSocket-Version': '13',
        },
    })

    ws.on('open', () => {
        const sessionHash = Math.random().toString(36).substring(2)
        // eslint-disable-next-line camelcase
        ws.send(JSON.stringify({ session_hash: sessionHash, fn_index: 0 }))
        ws.send(
            JSON.stringify({
                // eslint-disable-next-line camelcase
                fn_index: 0,
                data: [{ data: 'data:audio/oggbase64,' + base64Audio, name }, 'transcribe'],
                // eslint-disable-next-line camelcase
                session_hash: sessionHash,
            }),
        )
    })

    try {
        const wsAudioReceive = new Promise((resolve) => {
            ws.on('message', (data) => {
                const messageText = data.toString()
                console.log(messageText)
                if (messageText.includes('process_completed')) {
                    resolve(messageText)
                }
            })
        })

        const response = await wsAudioReceive
        console.log('response', response)
        ws.close()

        return JSON.parse(response)
    } catch {
        ws.close()
        return { msg: 'Error al procesar la respuesta del WebSocket', success: false }
    }
}

export { processImage, processAudio }
