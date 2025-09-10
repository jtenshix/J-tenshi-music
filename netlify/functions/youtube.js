// Importa la librería para hacer solicitudes a la API.
const axios = require('axios');

// Esta es la función principal que se ejecutará en Netlify.
exports.handler = async function(event, context) {
    // Guarda tu clave de API, que está segura en Netlify.
    const apiKey = process.env.YOUTUBE_API_KEY;
    
    // Aquí pones el ID de tu playlist de YouTube.
    const playlistId = 'PLkcZMdABSTfhe26NpsiFJev_0lCOcfCCf'; 

    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${apiKey}`;

    try {
        // Hace la llamada a la API de YouTube.
        const response = await axios.get(url);
        
        // Devuelve los datos de los videos a tu página web.
        return {
            statusCode: 200,
            body: JSON.stringify(response.data.items)
        };
    } catch (error) {
        // Si hay un error, lo informa.
        console.error('Error al obtener videos:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Hubo un problema al cargar los videos.' })
        };
    }
};
