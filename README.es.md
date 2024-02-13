#  Chatbot BingGPT-4 Gratis [Español]
Este chatbot utiliza la versión gratuita de Bing usando .

[Read in English](README.md)

## Instalación
1.Clona el repositorio en tu máquina local o servidor usando git clone https://github.com/andresayac/bot-chatgpt.git
2. Navega al directorio del proyecto clonado y ejecuta npm install para instalar todas las dependencias necesarias.
3. Copia el archivo .env.example y cámbiale el nombre a .env. Luego, completa las variables de entorno necesarias en el archivo .env.


## Configuración de ENV
#### Configuración de BING AI
Esta sección describe las variables de entorno necesarias para configurar el servicio de Bing AI.

#### Variables de entorno
**BING_AI_HOST**: La URL del servidor de Bing AI.
**BING_AI_COOKIES**: Cookies necesarias para la autenticación en el servidor de Bing AI.
**BING_AI_SYSTEM_MESSAGE**: Mensaje del sistema utilizado por el asistente de Bing AI. Define el comportamiento del asistente en conversaciones.
**BING_AI_GENERATE_IMAGE**: Indica si se deben generar imágenes como parte de las respuestas del asistente de Bing AI.
**BING_AI_DEBUG**: Indica si se debe habilitar el modo de depuración para el asistente de Bing AI.
Variables de configuración del BOT
**BOT_LANGUAGE**: Idioma predeterminado utilizado por el bot. Puede ser 'en' (Inglés), 'es' (Español), 'fr' (Francés), 'de' (Alemán), 'it' (Italiano), 'pt' (Portugués), 'zh' (Chino) o 'ja' (Japonés).
**BOT_RECONGNIZE_AUDIO**: Indica si el bot debería reconocer mensajes de audio.
**BOT_RECONGNIZE_IMAGE**: Indica si el bot debería reconocer imágenes.
**BOT_RECONGNIZE_PDF**: Indica si el bot debería reconocer archivos PDF.
**BOT_TEXT_TO_SPEECH**: Indica si el bot debería convertir texto en habla.

**Nota**: Asegúrate de configurar estas variables de entorno correctamente antes de ejecutar el bot para un funcionamiento adecuado.

## URL de la API de Bing
Referencia: [node-chatgpt-api](https://github.com/Richard-Weiss/node-chatgpt-api)

## Ejecutar el Bot
Una vez que hayas completado el archivo `.env`, puedes iniciar el bot ejecutando `npm start`.

## Contribución
Si deseas contribuir a este proyecto, siéntete libre de hacerlo. Cualquier tipo de mejora, corrección de errores o nuevas características son bienvenidas.

## Licencia
Este proyecto está bajo la licencia [MIT](LICENSE).
