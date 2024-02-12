import parsePDF from 'pdf-parse/lib/pdf-parse.js'

const pdfToText = async (pdfBuffer, maxPage = 10) => {
    try {
        const data = await parsePDF(pdfBuffer, { max: maxPage })
        return cleanText(data.text)
    } catch (error) {
        console.log(error)
        return null
    }
}

function cleanText(text) {
    return text
        .replace(/\r\n|\r|\n/g, ' ') // Reemplaza saltos de línea con espacios.
        .replace(/\s\s+/g, ' ') // Reemplaza espacios múltiples con un único espacio.
        .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ.,;:!?\s]/g, '') // Elimina caracteres no deseados, preservando tildes y la ñ.
}

export { pdfToText }
