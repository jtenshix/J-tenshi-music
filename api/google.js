import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const playlistId = 'PLkcZMdABSTfhe26NpsiFJev_0lCOcfCCf';
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50&key=${process.env.API_KEY}`
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
