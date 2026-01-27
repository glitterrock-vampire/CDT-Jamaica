import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Configuration
const config = {
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID || 'sbvvl9vs',
  dataset: process.env.REACT_APP_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
  ignoreBrowserTokenWarning: true
};

// Create a Sanity client
export const client = createClient(config);

// Helper function to generate image URLs
const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);

// Fetch site settings
export const getSiteSettings = async () => {
  const query = `*[_type == "siteSettings"][0]{
    title,
    description,
    lightLogo,
    darkLogo,
    heroImage,
    seasonPoster
  }`;
  
  try {
    const settings = await client.fetch(query);
    return settings;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
};

// Fetch all repertoire items
export const getRepertoireItems = async () => {
  try {
    console.log('Fetching repertoire items from Sanity...');
    
    const query = `*[_type == "repertoireItem"] | order(title asc) {
      _id,
      title,
      slug,
      runTime,
      year,
      youtubeId,
      description,
      genre,
      stylePeriod,
      choreographer,
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
      "heroImage": heroImage.asset->{
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
      "image": image.asset->{
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
      _updatedAt,
      title,
      subtitle,
      slug,
      runTime,
      year,
      youtubeId,
      description,
      choreographer,
      companyPremiere,
      worldPremiere,
      music,
      costumeDesign,
      lighting,
      premieredBy,
      mediaReviews[] {
        _key,
        _type,
        quote,
        source,
        year,
        url
      },
      thumbnail {
        asset->{
          _id,
          _updatedAt,
          url,
          metadata {
            dimensions {
              width,
              height,
              aspectRatio
            }
          }
        },
        alt,
        crop,
        hotspot
      },
      heroImage {
        asset->{
          _id,
          _updatedAt,
          url,
          metadata {
            dimensions {
              width,
              height,
              aspectRatio
            }
          }
        },
        alt,
        crop,
        hotspot
      },
      image {
        asset->{
          _id,
          _updatedAt,
          url,
          metadata {
            dimensions {
              width,
              height,
              aspectRatio
            }
          }
        },
        alt,
        crop,
        hotspot
      }
    }`;
    
    console.log(`Fetching repertoire item with ID: ${id} (also checking ${docId})`);
    const item = await client.fetch(query, { 
      id,
      draftId: docId 
    });
    
    if (!item) {
      throw new Error(`Repertoire item with ID ${id} not found`);
    }
    
    console.log('Fetched item with heroImage:', {
      _id: item._id,
      title: item.title,
      hasHeroImage: !!item.heroImage,
      heroImage: item.heroImage,
      hasImage: !!item.image,
      image: item.image,
      hasThumbnail: !!item.thumbnail,
      thumbnail: item.thumbnail
    });
    
    return item;
  } catch (error) {
    console.error('Error in getRepertoireItemById:', error);
    throw error;
  }
};
