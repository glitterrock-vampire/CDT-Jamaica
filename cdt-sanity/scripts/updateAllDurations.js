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
  console.log('YouTube API Request for:', videoId);

  try {
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.data.items && response.data.items.length > 0) {
      const duration = response.data.items[0].contentDetails.duration;
      return formatDuration(duration);
    }
    
    console.log('No video found with ID:', videoId);
    return null;
  } catch (error) {
    console.error('YouTube API Error for video', videoId, ':', error.message);
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

async function updateAllDurations() {
  try {
    // Fetch all repertoire items with YouTube IDs
    const query = `*[_type == "repertoireItem" && defined(youtubeId) && youtubeId != ""]{
      _id,
      title,
      youtubeId,
      duration
    }`;

    const items = await client.fetch(query);
    console.log(`Found ${items.length} items with YouTube IDs`);

    for (const item of items) {
      try {
        console.log(`\nProcessing: ${item.title} (${item.youtubeId})`);
        
        // Skip if we already have a duration
        if (item.duration) {
          console.log('  - Already has duration:', item.duration);
          continue;
        }
        
        // Fetch duration from YouTube
        const duration = await fetchVideoDuration(item.youtubeId);
        
        if (duration) {
          console.log(`  - Updating duration to: ${duration}`);
          
          // Update the document in Sanity
          await client
            .patch(item._id)
            .set({ 
              duration: duration,
              _updatedAt: new Date().toISOString()
            })
            .commit();
            
          console.log('  - ✅ Update successful');
        } else {
          console.log('  - ⚠️ No duration found for this video');
        }
      } catch (error) {
        console.error(`Error updating item ${item._id}:`, error.message);
      }
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n🎉 All updates completed!');
  } catch (error) {
    console.error('Error in updateAllDurations:', error);
  }
}

// Run the function
updateAllDurations();
