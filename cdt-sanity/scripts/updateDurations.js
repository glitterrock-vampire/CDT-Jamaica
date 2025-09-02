const { createClient } = require('@sanity/client');
const { fetchVideoDuration } = require('../../frontend/src/lib/youtube');
require('dotenv').config({ path: '.env' });

// Initialize Sanity client
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false, // Important for write operations
  apiVersion: process.env.SANITY_API_VERSION || '2023-05-03',
});

async function updateDurations() {
  try {
    // Fetch all repertoire items that have a YouTube ID but no duration
    const query = `*[_type == "repertoireItem" && defined(youtubeId) && (!defined(duration) || duration == "")]{
      _id,
      youtubeId,
      title,
      duration
    }`;

    const items = await client.fetch(query);
    console.log(`Found ${items.length} items to update`);

    for (const item of items) {
      try {
        console.log(`Processing: ${item.title} (${item.youtubeId})`);
        
        // Fetch duration from YouTube
        const duration = await fetchVideoDuration(item.youtubeId);
        
        if (duration) {
          console.log(`  -> Updating duration to: ${duration}`);
          
          // Update the document in Sanity
          await client
            .patch(item._id)
            .set({ duration })
            .commit();
            
          console.log('  -> Update successful');
        } else {
          console.log('  -> No duration found for this video');
        }
      } catch (error) {
        console.error(`Error updating item ${item._id}:`, error.message);
      }
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('All updates completed');
  } catch (error) {
    console.error('Error in updateDurations:', error);
  }
}

// Run the function
updateDurations();
