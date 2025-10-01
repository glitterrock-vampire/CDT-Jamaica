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
  
  try {
    const settings = await client.fetch(query);
    console.log('Fetched site settings:', settings ? '✅' : '❌ Not found');
    return settings;
  } catch (error) {
    console.error('❌ Error fetching site settings:', error);
    return null;
  }
}

export async function getRepertoireItems() {
  const query = `*[_type == "repertoireItem"] | order(year desc) {
    _id,
    title,
    "slug": slug.current,
    choreographer,
    year,
    description,
    "thumbnail": thumbnail { asset->{ url }, alt },
    "heroImage": heroImage { asset->{ url }, alt },
    duration
  }`;
  
  try {
    const items = await client.fetch(query);
    console.log('Fetched items:', items); // Check the structure here
    return items || [];
  } catch (error) {
    console.error('Error fetching repertoire items:', error);
    return [];
  }
}

// Helper function to get image URL
export function getImageUrl(source, width = 800) {
  if (!source?.asset?.url) return null;
  const url = new URL(source.asset.url);
  url.searchParams.set('w', width);
  url.searchParams.set('auto', 'format');
  url.searchParams.set('q', 75);
  return url.toString();
}