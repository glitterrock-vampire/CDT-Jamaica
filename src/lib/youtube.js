// Use environment variable or fallback to the hardcoded key
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY || 'AIzaSyCdBI9tzY35G-f3QZtDY_sNTrPxAejPY1s';

export const fetchVideoDuration = async (videoId) => {
  if (!videoId) {
    console.error('No video ID provided');
    return null;
  }
  
  if (!YOUTUBE_API_KEY) {
    console.error('YouTube API key is not set');
    return null;
  }

  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${YOUTUBE_API_KEY}`;
  
  try {
    console.log(`Fetching duration for video: ${videoId}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('YouTube API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData.error
      });
      return null;
    }

    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const duration = data.items[0].contentDetails.duration;
      console.log(`Duration for ${videoId}:`, duration);
      return duration; // Returns ISO 8601 duration format
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching YouTube video duration:', error);
    return null;
  }
};

export const formatDuration = (isoDuration) => {
  if (!isoDuration) return '';
  
  // Parse ISO 8601 duration format (e.g., PT1H2M3S)
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  
  if (!match) return '';
  
  const hours = (parseInt(match[1]) || 0);
  const minutes = (parseInt(match[2]) || 0);
  const seconds = (parseInt(match[3]) || 0);
  
  const parts = [];
  
  if (hours > 0) {
    parts.push(hours.toString().padStart(2, '0'));
  }
  
  parts.push(minutes.toString().padStart(hours > 0 ? 2 : 1, '0'));
  parts.push(seconds.toString().padStart(2, '0'));
  
  return parts.join(':');
};
