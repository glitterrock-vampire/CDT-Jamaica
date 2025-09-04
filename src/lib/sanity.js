import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Configuration
const config = {
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID || 'sbvvl9vs', // Fallback to hardcoded value for now
  dataset: process.env.REACT_APP_SANITY_DATASET || 'production',
  apiVersion: process.env.REACT_APP_SANITY_API_VERSION || '2023-05-03',
  useCdn: process.env.NODE_ENV === 'production', // Only use CDN in production
  ignoreBrowserTokenWarning: true,
  withCredentials: false, // Important: Disable credentials for public access
};

// Create a Sanity client
export const client = createClient(config);

// Verify the client configuration
console.log('Sanity client configured with:', {
  projectId: config.projectId ? '✅ Set' : '❌ Missing',
  dataset: config.dataset,
  apiVersion: config.apiVersion,
  useCdn: config.useCdn,
  hasToken: false, // We're using public read access
  endpoint: `https://${config.projectId}.api.sanity.io/v${config.apiVersion}/data/query/${config.dataset}`,
});

// Helper function to generate image URLs
const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);

// Fetch all repertoire items
export const getRepertoireItems = async () => {
  try {
    console.log('Fetching repertoire items from Sanity...');
    
    const query = `*[_type == "repertoireItem"] | order(title asc) {
      _id,
      title,
      composer,
      duration,
      year,
      youtubeId,
      "thumbnail": thumbnail.asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      }
    }`;
    
    console.log('Executing query:', query);
    const items = await client.fetch(query);
    console.log('Received items:', items);
    
    if (!items || items.length === 0) {
      console.warn('No repertoire items found. Make sure you have published items in your Sanity dataset.');
    }
    
    return items || [];
  } catch (error) {
    console.error('Error in getRepertoireItems:', {
      message: error.message,
      statusCode: error.statusCode,
      response: error.responseBody
    });
    throw new Error('Failed to fetch repertoire items. Please check your network connection and Sanity configuration.');
  }
};

// Fetch a single repertoire item by ID
export const getRepertoireItemById = async (id) => {
  if (!id) {
    throw new Error('No ID provided for repertoire item');
  }

  try {
    // Ensure the ID is in the correct format (add 'drafts.' prefix if it's a draft)
    const docId = id.startsWith('drafts.') ? id : `drafts.${id}`;
    
    const query = `*[_type == "repertoireItem" && (_id == $id || _id == $draftId)][0]{
      _id,
      _type,
      title,
      composer,
      duration,
      year,
      youtubeId,
      description,
      instruments,
      style,
      "category": category,
      "thumbnail": thumbnail.asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      },
      notableRecordings,
      "fullImage": image.asset->url
    }`;
    
    console.log(`Fetching repertoire item with ID: ${id} (also checking ${docId})`);
    const item = await client.fetch(query, { 
      id,
      draftId: docId 
    });
    
    if (!item) {
      throw new Error(`Repertoire item with ID ${id} not found`);
    }
    
    console.log('Fetched item:', item);
    return item;
  } catch (error) {
    console.error('Error in getRepertoireItemById:', error);
    throw error;
  }
};
