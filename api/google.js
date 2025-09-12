import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Configuración de CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://jtenshix.github.io'); // Tu dominio de GitHub Pages
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Maneja solicitudes OPTIONS (preflight para CORS)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Verifica que solo se permitan solicitudes GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const playlistId = 'PLkcZMdABSTfhe26NpsiFJev_0lCOcfCCf';
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50&key=${process.env.API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Error en YouTube API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching YouTube playlist:', error);
    res.status(500).json({ error: 'Error al obtener la playlist', details: error.message });
  }
}
