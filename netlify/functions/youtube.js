const axios = require('axios');

exports.handler = async function(event, context) {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const playlistId = event.queryStringParameters.playlistId;

    if (!apiKey || !playlistId) {
        return { statusCode: 400, body: JSON.stringify({ error: "Faltan variables de entorno o parámetros." }) };
    }

    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${encodeURIComponent(playlistId)}&maxResults=12&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(response.data.items || []),
        };
    } catch (error) {
        console.error("Error al obtener videos:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "Hubo un problema al cargar los videos." }) };
    }
};
