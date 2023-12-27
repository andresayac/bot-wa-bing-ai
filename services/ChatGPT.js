import { ChatGPTBrowserClient } from '@waylaidwanderer/chatgpt-api';

export default class ChatGPT {
    constructor(options) {
        this.clientOptions = options || {};
        this.chatGptClient = new ChatGPTBrowserClient(this.clientOptions);
    }

    async sendMessage(message, options) {
        const response = await this.chatGptClient.sendMessage(message, options);
        return response;
    }
}