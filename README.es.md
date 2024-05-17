#  Chatbot BingGPT-4 Gratis [Español]
Este chatbot utiliza la versión gratuita de Bing usando .

[Read in English](README.md)

## Instalación
1.Clona el repositorio en tu máquina local o servidor usando git clone https://github.com/andresayac/bot-wa-bing-ai.git
2. Navega al directorio del proyecto clonado y ejecuta npm install para instalar todas las dependencias necesarias.
3. Copia el archivo .env.example y cámbiale el nombre a .env. Luego, completa las variables de entorno necesarias en el archivo .env.


## Configuración de ENV
#### Configuración de BING AI
Esta sección describe las variables de entorno necesarias para configurar el servicio de Bing AI.

#### Variables de entorno
- **BING_AI_HOST**: La URL del servidor de Bing AI por defecto dejar vacio a menos que sea necesario.
- **BING_AI_COOKIES**: Cookies necesarias para la autenticación en el servidor de Bing AI.
- **BING_AI_SYSTEM_MESSAGE**: Mensaje del sistema utilizado por el asistente de Bing AI. Define el comportamiento del asistente en conversaciones.
- **BING_AI_GENERATE_IMAGE**: Indica si se deben generar imágenes como parte de las respuestas del asistente de Bing AI.
- **BING_AI_DEBUG**: Indica si se debe habilitar el modo de depuración para el asistente de Bing AI.
- **BING_AI_MODE**: Modo de Bing AI es predeterminado 'precise' GPT-4. Puede ser 'turbo', 'precise' o 'balanced'. 'Turbo' es el modo creativo.
- **BING_AI_PERSONA**: La personalización del modo Bing AI (cooking, copilot, designer, fitness, mica, shopping,shopping copilot, sydney, travel) de forma predeterminada está vacía y no tiene personalización. Recomiendo (sydney o copiloto).

# Extraer cookies de Bing
![cookies](https://raw.githubusercontent.com/andresayac/bot-wa-bing-ai/main/cookies-bing.gif)

#### Configuracion adicional del BOT
- **BOT_LANGUAGE**: Idioma predeterminado utilizado por el bot. Puede ser 'en' (Inglés), 'es' (Español), 'fr' (Francés), 'de' (Alemán), 'it' (Italiano), 'pt' (Portugués), 'zh' (Chino) o 'ja' (Japonés).
- **BOT_RECONGNIZE_AUDIO**: Indica si el bot debería reconocer mensajes de audio.
- **BOT_RECONGNIZE_IMAGE**: Indica si el bot debería reconocer imágenes.
- **BOT_RECONGNIZE_PDF**: Indica si el bot debería reconocer archivos PDF.
- **BOT_TEXT_TO_SPEECH**: Indica si el bot debería convertir texto en habla.
- **BOT_MESSAGE_ON_PROCESS**: Mensaje de edición en tiempo real para mostrar a las usuarios.

**Nota**: Asegúrate de configurar estas variables de entorno correctamente antes de ejecutar el bot para un funcionamiento adecuado.

## URL de la API de Bing
Referencia: [node-chatgpt-api](https://github.com/Richard-Weiss/node-chatgpt-api)

## Ejecutar el Bot
Una vez que hayas completado el archivo `.env`, puedes iniciar el bot ejecutando `npm start`.
- Para utilizar el bot en whatsapp es necesario escanear el codigo qr desde tu whatsapp como si fueras a vincularlo en whatsapp web, dicho codigo QR esta en  el archivo bot.qr.png

## Contribución
Si deseas contribuir a este proyecto, siéntete libre de hacerlo. Cualquier tipo de mejora, corrección de errores o nuevas características son bienvenidas.

## Licencia
Este proyecto está bajo la licencia [MIT](LICENSE).
