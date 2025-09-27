import { client } from './sanity';

export async function getSiteSettings() {
  const query = `*[_type == "siteSettings"][0]{
    title,
    description,
    heroImage{
      asset->{
        _id,
        url
      },
      alt
    },
    lightLogo{
      asset->{
        _id,
        url
      },
      alt
    },
    darkLogo{
      asset->{
        _id,
        url
      },
      alt
    }
  }`;
  
  const settings = await client.fetch(query);
  return settings;
}
export async function getRepertoireItems() {
  try {
    const query = `*[_type == "repertoireItem"] | order(year desc) {
      _id,
      title,
      "slug": slug.current,
      choreographer,
      composer,
      description,
      year,
      duration,
      genre,
      "thumbnail": thumbnail.asset->{
        _id,
        url,
        alt,
        "dimensions": metadata.dimensions
      },
      "heroImage": heroImage.asset->{
        _id,
        url,
        alt,
        "dimensions": metadata.dimensions
      },
      companyPremiere
    }`;
    
    console.log('🔍 Executing Sanity query...');
    const items = await client.fetch(query);
    
    // Log detailed information about the fetched items
    console.group('📦 Sanity Response');
    console.log('Total items:', items?.length || 0);
    
    if (items && items.length > 0) {
      console.log('First item structure:', JSON.stringify(items[0], null, 2));
      
      // Check if thumbnails and hero images are properly loaded
      items.forEach((item, index) => {
        console.group(`Item ${index + 1}: ${item.title || 'Untitled'}`);
        console.log('ID:', item._id);
        console.log('Has thumbnail:', !!item.thumbnail?.asset?.url);
        console.log('Has heroImage:', !!item.heroImage?.asset?.url);
        console.log('Thumbnail URL:', item.thumbnail?.asset?.url);
        console.log('Hero Image URL:', item.heroImage?.asset?.url);
        console.groupEnd();
      });
    } else {
      console.log('No items found in Sanity');
    }
    console.groupEnd();
    
    return items || [];
  } catch (error) {
    console.error('❌ Error in getRepertoireItems:', error);
    return [];
  }
}