import { BingAIClient } from '@waylaidwanderer/chatgpt-api';
import { KeyvFile } from 'keyv-file';
import cheerio from 'cheerio';

export default class BingAI {
    constructor(options) {
        this.clientOptions = options || {};

        const cacheOptions = {
            // store: new KeyvFile({ filename: this.clientOptions.cacheFile || '/cache/cache.json' }),
        };

        const clientOptions = {
            cookies: this.clientOptions.cookies || null,
        };

        this.BingAIClient = new BingAIClient({
            ...clientOptions,
            cache: cacheOptions,
            features: {
                genImage: true,
            },
            debug: false,

        });
    }

    async sendMessage(message, options) {
        const response = await this.BingAIClient.sendMessage(message, options);
        return response;
    }

    async detectImageInResponse(response) {
        //  details.adaptiveCards[0].body[0].text 
        // buscar class="mimg" de <img y extraer los src de cada uno
        // get text from response
        const conversationResponse = response.response
        const iframeContent = response?.details?.adaptiveCards[0]?.body[0]?.text
        //replace in iframeContent conversationResponse
        const html = iframeContent?.replace(conversationResponse, '') ?? ''
        const images = this.extractLinksAndImagesFromIframe(html) || []
        return images

    }

    extractLinksAndImagesFromIframe(html) {
        // Load the main HTML content
        const $ = cheerio.load(html);

        // Find the iframe and extract its srcdoc content
        const iframeSrcDoc = $('iframe').attr('srcdoc');
        if (!iframeSrcDoc) {
            return null;
        }

        // Load the iframe content
        const iframe$ = cheerio.load(iframeSrcDoc);

        // Extract URLs and SRC attributes, ignoring those not starting with http or https
        const urls = iframe$('a').map((i, link) => iframe$(link).attr('href'))
            .get()
            .filter(href => href.startsWith('http://') || href.startsWith('https://'));
        const srcs = iframe$('img').map((i, img) => iframe$(img).attr('src'))
            .get()
            .filter(src => src.startsWith('http://') || src.startsWith('https://'));

        return {
            urls,
            srcs
        };

    }
}