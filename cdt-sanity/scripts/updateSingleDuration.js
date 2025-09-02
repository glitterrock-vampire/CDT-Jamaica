const { createClient } = require('@sanity/client');
const axios = require('axios');
require('dotenv').config({ path: '.env' });

// Load environment variables from frontend .env
require('dotenv').config({ path: '../frontend/.env' });

// YouTube API function
async function fetchVideoDuration(videoId) {
  const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
  
  if (!videoId) {
    console.error('Missing YouTube video ID');
    return null;
  }
  
  if (!YOUTUBE_API_KEY) {
    console.error('Missing YouTube API key');
    return null;
  }

  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${YOUTUBE_API_KEY}`;
  console.log('YouTube API Request:', url);

  try {
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log('YouTube API Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.items && response.data.items.length > 0) {
      const duration = response.data.items[0].contentDetails.duration;
      console.log('Raw duration from YouTube:', duration);
      // Convert ISO 8601 duration to MM:SS format
      const formatted = formatDuration(duration);
      console.log('Formatted duration:', formatted);
      return formatted;
    }
    
    console.log('No video found with ID:', videoId);
    return null;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('YouTube API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('YouTube API Error: No response received', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('YouTube API Error:', error.message);
    }
    return null;
  }
}

// Format ISO 8601 duration to MM:SS
function formatDuration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '';
  
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  
  const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Initialize Sanity client
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
  apiVersion: process.env.SANITY_API_VERSION || '2023-05-03',
});

async function updateDurationForItem(itemId) {
  try {
    // Fetch the specific item
    const item = await client.getDocument(itemId);
    
    if (!item) {
      console.error('Item not found');
      return;
    }

    if (!item.youtubeId) {
      console.log('No YouTube ID found for item:', item.title);
      return;
    }

    console.log(`Fetching duration for: ${item.title} (${item.youtubeId})`);
    
    // Fetch duration from YouTube
    const duration = await fetchVideoDuration(item.youtubeId);
    
    if (duration) {
      console.log(`Updating duration for ${item.title} to:`, duration);
      
      // Update the document in Sanity
      await client
        .patch(item._id)
        .set({ 
          duration: duration,
          _updatedAt: new Date().toISOString()
        })
        .commit();
        
      console.log('✅ Update successful');
    } else {
      console.log('⚠️ No duration found for this video');
    }
  } catch (error) {
    console.error('Error updating item:', error.message);
  }
}

// Get the item ID from command line arguments
const itemId = process.argv[2];
if (!itemId) {
  console.error('Please provide an item ID as an argument');
  process.exit(1);
}

// Run the function
updateDurationForItem(itemId);
