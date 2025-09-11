const axios = require('axios');

exports.handler = async function(event, context) {
    const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
    const folderId = process.env.GOOGLE_DRIVE_BANNER_VIDEOS_ID;

    if (!apiKey || !folderId) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Faltan variables de entorno o parámetros.' }) };
    }

    const url = `https://www.googleapis.com/drive/v3/files?key=${apiKey}&q='${folderId}'+in+parents+and+trashed=false&orderBy=createdTime+desc&fields=files(webContentLink,name)`;

    try {
        const response = await axios.get(url);
        const files = response.data.files;
        if (files && files.length > 0) {
            const latestFile = files[0];
            return {
                statusCode: 200,
                body: JSON.stringify({ link: latestFile.webContentLink, name: latestFile.name })
            };
        } else {
            return { statusCode: 404, body: JSON.stringify({ error: 'No se encontraron imágenes en la carpeta.' }) };
        }
    } catch (error) {
        console.error('Error al obtener la imagen de Drive:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Hubo un problema al cargar el banner.' }) };
    }
};
