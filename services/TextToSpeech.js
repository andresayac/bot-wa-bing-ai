import { EdgeTTS } from '@andresaya/edge-tts'

const textToSpeech = async (ssmlText) => {
    const edgeTTS = new EdgeTTS()
    await edgeTTS.synthesize(ssmlText, 'en-US-AvaMultilingualNeural', {
        rate: '0%',
        volume: '0%',
        pitch: '0Hz',
    })

    const base64Audio = await edgeTTS.toBase64()
    const audioBuffer = Buffer.from(base64Audio, 'base64')
    return audioBuffer
}

export { textToSpeech }
