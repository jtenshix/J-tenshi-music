export default async function handler(req, res) {
  // 1. HEADERS CORS - ¡ESTO ARREGLA EL BLOQUEO!
  res.setHeader('Access-Control-Allow-Origin', 'https://jtenshix.github.io');  // Tu dominio exacto
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Maneja preflight (solicitud OPTIONS que envía el navegador antes del GET)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Solo permite GET
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  // 2. LÓGICA DE YOUTUBE
  try {
    const playlistId = 'PLkcZMdABSTfhe26NpsiFJev_0lCOcfCCf';  // Tu playlist
    const apiKey = process.env.API_KEY;  // De Environment Variables

    if (!apiKey) {
      throw new Error('API_KEY no configurada en Vercel');
    }

    // Usa fetch nativo (sin node-fetch, para simplicidad)
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Error de YouTube: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);  // Envía los datos con CORS ya incluido
  } catch (error) {
    console.error('Error en API:', error.message);  // Aparece en logs de Vercel
    res.status(500).json({ error: 'Error al cargar videos', details: error.message });
  }
}
