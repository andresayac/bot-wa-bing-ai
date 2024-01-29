import WebSocket from 'ws';
import { v4 } from 'uuid';

const TRUSTED_CLIENT_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
const WSS_URL = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}`;

const hr_cr = (hr) => {
    return String((hr - 1) % 24).padStart(2, '0');
}

const fr = (input_string) => {
    return String(input_string).padStart(2, '0');
}

const getXTime = () => {
    const now = new Date();
    return `${fr(now.getFullYear())}-${fr(now.getMonth() + 1)}-${fr(now.getDate())}T${fr(hr_cr(now.getHours()))}:${fr(now.getMinutes())}:${fr(now.getSeconds())}.${String(now.getMilliseconds()).padStart(3, '0')}Z`;
}

const transferMsTTSData = (SSML_text) => {
    return new Promise((resolve, reject) => {
        const req_id = v4().toUpperCase();
        const endpoint2 = `${WSS_URL}&ConnectionId=${req_id}`;
        const ws = new WebSocket(endpoint2, {
            headers: {
                "Pragma": "no-cache",
                "Cache-Control": "no-cache",
                "Origin": "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-US,en;q=0.9",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36 Edg/91.0.864.41"
            }
        });

        ws.on('open', () => {
            const message_1 = `X-Timestamp:${getXTime()}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":false,"wordBoundaryEnabled":true},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}\r\n`;
            ws.send(message_1);

            const message_2 = `X-RequestId:${req_id}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${getXTime()}Z\r\nPath:ssml\r\n\r\n${SSML_text}`;
            ws.send(message_2);
        });

        let audio_stream = [];
        ws.on('message', (data) => {
            if (typeof data === 'string' && data.includes('Path:turn.end')) {
                ws.close();
            } else if (data instanceof Buffer) {
                const needle = Buffer.from('Path:audio\r\n');
                const start_ind = data.indexOf(needle) + needle.length;
                if (start_ind > needle.length) {
                    audio_stream.push(data.slice(start_ind));
                }
            }
        });

        ws.on('close', () => {
            const outputData = Buffer.concat(audio_stream);
            resolve(outputData);
        });

        ws.on('error', (e) => {
            reject(e);
        });
    });
}

const textToSpeech = async (SSML_text, language = 'en') => {
    try {
        const textToSpeech = getSSML(SSML_text, language);
        const audioBuffer = await transferMsTTSData(textToSpeech);
        return audioBuffer;
    } catch (error) {
        throw error;
    }
}

const getLanguageCode = (language) => {
    const languageCode = {
        'af': 'af-ZA-WillemNeural',
        'sq': 'sq-AL-IlirNeural',
        'am': 'am-ET-MekdesNeural',
        'ar': 'ar-DZ-IsmaelNeural',
        'az': 'az-AZ-BanuNeural',
        'bn': 'bn-BD-PradeepNeural',
        'bs': 'bs-BA-VesnaNeural',
        'bg': 'bg-BG-KalinaNeural',
        'my': 'my-MM-ThihaNeural',
        'ca': 'ca-ES-JoanaNeural',
        'zh': 'zh-HK-WanLungNeural',
        'hr': 'hr-HR-SreckoNeural',
        'cs': 'cs-CZ-VlastaNeural',
        'da': 'da-DK-JeppeNeural',
        'nl': 'nl-BE-DenaNeural',
        'en': 'en-US-SteffanNeural',
        'et': 'et-EE-KertNeural',
        'fil': 'fil-PH-BlessicaNeural',
        'fi': 'fi-FI-NooraNeural',
        'fr': 'fr-BE-GerardNeural',
        'gl': 'gl-ES-SabelaNeural',
        'ka': 'ka-GE-GiorgiNeural',
        'de': 'de-AT-JonasNeural',
        'el': 'el-GR-NestorasNeural',
        'gu': 'gu-IN-NiranjanNeural',
        'he': 'he-IL-HilaNeural',
        'hi': 'hi-IN-SwaraNeural',
        'hu': 'hu-HU-TamasNeural',
        'is': 'is-IS-GunnarNeural',
        'id': 'id-ID-GadisNeural',
        'ga': 'ga-IE-OrlaNeural',
        'it': 'it-IT-IsabellaNeural',
        'ja': 'ja-JP-NanamiNeural',
        'jv': 'jv-ID-SitiNeural',
        'kn': 'kn-IN-SapnaNeural',
        'kk': 'kk-KZ-DauletNeural',
        'km': 'km-KH-SreymomNeural',
        'ko': 'ko-KR-SunHiNeural',
        'lo': 'lo-LA-KeomanyNeural',
        'lv': 'lv-LV-NilsNeural',
        'lt': 'lt-LT-OnaNeural',
        'mk': 'mk-MK-MarijaNeural',
        'ms': 'ms-MY-YasminNeural',
        'ml': 'ml-IN-SobhanaNeural',
        'mt': 'mt-MT-JosephNeural',
        'mr': 'mr-IN-ManoharNeural',
        'mn': 'mn-MN-YesuiNeural',
        'ne': 'ne-NP-SagarNeural',
        'nb': 'nb-NO-PernilleNeural',
        'ps': 'ps-AF-LatifaNeural',
        'fa': 'fa-IR-FaridNeural',
        'pl': 'pl-PL-ZofiaNeural',
        'pt': 'pt-BR-FranciscaNeural',
        'ro': 'ro-RO-EmilNeural',
        'ru': 'ru-RU-SvetlanaNeural',
        'sr': 'sr-RS-SophieNeural',
        'si': 'si-LK-ThiliniNeural',
        'sk': 'sk-SK-ViktoriaNeural',
        'sl': 'sl-SI-RokNeural',
        'so': 'so-SO-UbaxNeural',
        'es': 'es-US-AlonsoNeural',
        'su': 'su-ID-TutiNeural',
        'sw': 'sw-KE-ZuriNeural',
        'sv': 'sv-SE-SofieNeural',
        'ta': 'ta-IN-ValluvarNeural',
        'te': 'te-IN-ShrutiNeural',
        'th': 'th-TH-PremwadeeNeural',
        'tr': 'tr-TR-EmelNeural',
        'uk': 'uk-UA-PolinaNeural',
        'ur': 'ur-IN-SalmanNeural',
        'uz': 'uz-UZ-SardorNeural',
        'vi': 'vi-VN-NamMinhNeural',
        'cy': 'cy-GB-NiaNeural',
        'zu': 'zu-ZA-ThembaNeural'
    };
    return languageCode[language] || 'en-US-SteffanNeural';
}

const getSSML = (text, language) => {
    const ssml = `<speak version="1.0" xml:lang="en-US">
                    <voice name="${getLanguageCode(language)}">
                        <prosody rate="0%" pitch="0%">
                            ${text}
                        </prosody>
                    </voice>
                  </speak>`;

    return ssml;

}

export { textToSpeech }