const { google } = require('googleapis');
const { youtube } = google.youtube_v3_api_v1;

exports.handler = async (event, context) => {
  const { playlistId } = event.queryStringParameters;
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!playlistId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Playlist ID is missing' })
    };
  }

  try {
    const response = await youtube.playlistItems.list({
      key: apiKey,
      part: 'snippet',
      playlistId: playlistId,
      maxResults: 50
    });

    const videos = response.data.items.map(item => ({
      title: item.snippet.title,
      videoId: item.snippet.resourceId.videoId,
      thumbnail: item.snippet.thumbnails.high.url
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(videos)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch videos' })
    };
  }
};
