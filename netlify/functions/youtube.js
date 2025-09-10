// netlify/functions/youtube.js
const axios = require('axios');

exports.handler = async function(event, context) {
  const apiKey = process.env.YOUTUBE_API_KEY;

  // Obtener playlistId desde query string
  const playlistId = event.queryStringParameters && event.queryStringParameters.playlistId;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Falta la variable de entorno YOUTUBE_API_KEY" }),
    };
  }

  if (!playlistId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Falta el parámetro playlistId en la query." }),
    };
  }

  // Puedes ajustar maxResults si quieres traer más/menos
  const maxResults = 12;
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${encodeURIComponent(playlistId)}&maxResults=${maxResults}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    // Devolvemos items como un array (misma forma que ya devolvías antes)
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        // permite que tu frontend haga fetch sin problemas (si usas cors en otro dominio, ajustar)
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(response.data.items || []),
    };
  } catch (error) {
    console.error("Error al obtener videos desde YouTube API:", error && error.toString ? error.toString() : error);
    // enviar mensaje útil al frontend
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Hubo un problema al cargar los videos desde YouTube." }),
    };
  }
};
