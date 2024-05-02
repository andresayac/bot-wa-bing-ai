# Chatbot BingGPT-4 Free [English]

This chatbot utilizes the free version of bing using .

[Leer en español](README.es.md)

## Installation

1. Clone the repository to your local machine or server using `git clone https://github.com/andresayac/bot-wa-bing-ai.git`
2. Navigate to the cloned project directory and run `npm install` to install all the necessary dependencies.
3. Copy the `.env.example` file and rename it to `.env`. Then, fill in the necessary environment variables in the `.env` file.

## ENV Configuration
#### BING AI Configuration
This section describes the necessary environment variables to configure the Bing AI service.

#### Environment Variables
- **BING_AI_HOST**: The URL of the Bing AI server.
- **BING_AI_COOKIES**: Cookies required for authentication on the Bing AI server.
- **BING_AI_SYSTEM_MESSAGE**: System message used by the Bing AI assistant. It defines the behavior of the assistant in conversations.
- **BING_AI_GENERATE_IMAGE**: Indicates whether to generate images as part of Bing AI assistant responses.
- **BING_AI_DEBUG**: Indicates whether to enable debug mode for the Bing AI assistant.
- **BING_AI_MODE**: Bing AI mode is default to 'precise' GPT-4. It can be 'turbo', 'precise', or 'balanced'. 'Turbo' is the creative mode.

# Extract cookies from Bing
![cookies](https://raw.githubusercontent.com/andresayac/bot-wa-bing-ai/main/cookies-bing.gif)

#### Configuration Variables BOT
- **BOT_LANGUAGE**: Default language used by the bot. It can be 'en' (English), 'es' (Spanish), 'fr' (French), 'de' (German), 'it' (Italian), 'pt' (Portuguese), 'zh' (Chinese), or 'ja' (Japanese).
- **BOT_RECONGNIZE_AUDIO**: Indicates whether the bot should recognize audio messages.
- **BOT_RECONGNIZE_IMAGE**: Indicates whether the bot should recognize images.
- **BOT_RECONGNIZE_PDF**: Indicates whether the bot should recognize PDF files.
- **BOT_TEXT_TO_SPEECH**: Indicates whether the bot should convert text to speech.
- **BOT_MESSAGE_ON_PROCESS**: Edit message in real time to show to users.

**Note**: Make sure to configure these environment variables correctly before running the bot for proper functionality.

## API BING URL

Reference: [node-chatgpt-api](https://github.com/Richard-Weiss/node-chatgpt-api)

## Running the Bot
Once you have completed the `.env` file, you can start the bot by running `npm start`.

## Contribution
If you want to contribute to this project, feel free to do so. Any type of improvement, bug fix or new features are welcome.

## License
This project is licensed under the [MIT](LICENSE).
