import { client } from './sanity';
import { processNames } from './nameUtils';

export const getDancers = async () => {
  const query = `
    *[_type == "dancer"] | order(order asc) {
      _id,
      name,
      role,
      bio,
      headshot {
        asset-> {
          _id,
          url
        },
        alt
      },
      yearsActive,
      featured,
      order
    }
  `;
  
  try {
    console.log('Fetching dancers from Sanity...');
    const dancers = await client.fetch(query);
    console.log('Raw dancers data from Sanity:', dancers);
    console.log('Number of dancers fetched:', dancers?.length || 0);
    
    const processedDancers = processNames(dancers);
    console.log('Processed dancers:', processedDancers);
    
    return processedDancers;
  } catch (error) {
    console.error('Error fetching dancers:', error);
    return [];
  }
};

export const getFeaturedDancers = async () => {
  const query = `
    *[_type == "dancer" && featured == true] | order(order asc) {
      _id,
      name,
      role,
      bio,
      headshot {
        asset-> {
          _id,
          url
        },
        alt
      },
      yearsActive,
      featured,
      order
    }
  `;
  
  try {
    const dancers = await client.fetch(query);
    return processNames(dancers);
  } catch (error) {
    console.error('Error fetching featured dancers:', error);
    return [];
  }
};

export const getDancerById = async (id) => {
  const query = `
    *[_type == "dancer" && _id == $id][0] {
      _id,
      name,
      role,
      bio,
      headshot {
        asset-> {
          _id,
          url
        },
        alt
      },
      yearsActive,
      featured,
      order
    }
  `;
  
  try {
    const dancer = await client.fetch(query, { id });
    return dancer;
  } catch (error) {
    console.error('Error fetching dancer:', error);
    return null;
  }
};
