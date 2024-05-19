import WebSocket from 'ws'
import https from 'https';
import { Readable } from 'stream';

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
                if (messageText.includes('process_completed')) {
                    resolve(messageText)
                }
            })
        })

        const response = await wsAudioReceive
        ws.close()

        return JSON.parse(response)
    } catch {
        ws.close()
        return { msg: 'Error al procesar la respuesta del WebSocket', success: false }
    }
}


const processAudioToText = async (audioBuffer) => {
    const sessionHash = Math.random().toString(36).substring(2);
    await joinQueue(audioBuffer, sessionHash);
    const response = await getQueueStatus(sessionHash);
    return response;
}

const uploadAudio = async (fileBuffer, sessionHash) => {

    const url = new URL(`https://hf-audio-whisper-large-v3.hf.space/upload?upload_id=${sessionHash}`);
    const boundary = '----WebKitFormBoundaryUUeAA10e53UKwSzc';

    const fileStream = new Readable();
    fileStream.push(fileBuffer);
    fileStream.push(null);

    const filename = `${Date.now()}-${Math.floor(Math.random() * 1000)}.ogg`;

    const size = fileBuffer.length;

    const audioInformation = {
        filename: filename,
        contentType: 'audio/ogg',
        size: size
    };

    const formDataStart = `--${boundary}\r\nContent-Disposition: form-data; name="files"; filename="${filename}"\r\nContent-Type: audio/ogg\r\n\r\n`;
    const formDataEnd = `\r\n--${boundary}--\r\n`;

    const options = {
        method: 'POST',
        hostname: url.hostname,
        path: url.pathname + url.search,
        headers: {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9,es;q=0.8",
            "content-type": `multipart/form-data; boundary=${boundary}`,
            "priority": "u=1, i",
            "sec-ch-ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "Referer": "https://hf-audio-whisper-large-v3.hf.space/?",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Content-Length": Buffer.byteLength(formDataStart) + size + Buffer.byteLength(formDataEnd)
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve({
                    data: data,
                    audioInformation: audioInformation
                });
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(formDataStart);
        fileStream.pipe(req, { end: false });

        fileStream.on('end', () => {
            req.end(formDataEnd);
        });
    });
}


const joinQueue = async (fileBuffer, sessionHash) => {
    const url = 'https://hf-audio-whisper-large-v3.hf.space/queue/join?';
    const headers = {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9,es;q=0.8",
        "content-type": "application/json",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "Referer": "https://hf-audio-whisper-large-v3.hf.space/?",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    };

    let responseData = await uploadAudio(fileBuffer, sessionHash);

    const reponsePathAudio = responseData.data.replace('["', '').replace('"]', '');
    const audioInformation = responseData.audioInformation;

    if (!responseData.data.includes('/tmp/gradio/')) {
        throw new Error('Error to send audio');
    }

    const body = {
        "data": [{
            "path": reponsePathAudio,
            "url": `https://hf-audio-whisper-large-v3.hf.space/file=${reponsePathAudio}`,
            "orig_name": audioInformation.filename,
            "size": audioInformation.size,
            "mime_type": audioInformation.contentType,
            "meta": {
                "_type": "gradio.FileData"
            }
        }, "transcribe"],
        "event_data": null,
        "fn_index": 3,
        "trigger_id": 29,
        "session_hash": sessionHash
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    });

    return response.json();
}

const getQueueStatus = async (sessionHash) => {
    const url = `https://hf-audio-whisper-large-v3.hf.space/queue/data?session_hash=${sessionHash}`;
    const headers = {
        "accept": "text/event-stream",
        "accept-language": "en-US,en;q=0.9,es;q=0.8",
        "cache-control": "no-cache",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "Referer": "https://hf-audio-whisper-large-v3.hf.space/?",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    };

    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    });

    const textResponse = await response.text();

    const lines = textResponse.split('\n');
    const processData = lines.map(line => {
        try {
            return JSON.parse(line.replace('data: ', ''));
        } catch (error) {
            return null;
        }
    }).filter(data => data);

    const processCompletedData = processData.find(data => data.msg === 'process_completed') ?? {};

    return processCompletedData;
}


export { processImage, processAudio, processAudioToText }
