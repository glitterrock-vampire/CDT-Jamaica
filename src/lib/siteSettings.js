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
  const query = `*[_type == "repertoireItem"] | order(year desc) {
    _id,
    title,
    choreographer,
    composer,
    description,
    year,
    "thumbnail": thumbnail.asset->{
      url,
      alt,
      "dimensions": metadata.dimensions
    },
    "image": image.asset->{
      url,
      alt,
      "dimensions": metadata.dimensions
    }
  }`;
  
  const items = await client.fetch(query);
  return items || [];
}
