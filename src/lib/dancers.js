import { client } from './sanityClient';

export const getDancers = async () => {
  const query = `
    *[_type == "dancer"] | order(order asc, name asc) {
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
    return dancers;
  } catch (error) {
    console.error('Error fetching dancers:', error);
    return [];
  }
};

export const getFeaturedDancers = async () => {
  const query = `
    *[_type == "dancer" && featured == true] | order(order asc, name asc) {
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
    return dancers;
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
