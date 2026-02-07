import { client } from './sanity';

export const getManagement = async () => {
  const query = `
    *[_type == "management"] | order(order asc) {
      _id,
      name,
      title,
      bio,
      headshot {
        asset-> {
          _id,
          url
        },
        alt
      },
      order
    }
  `;
  
  try {
    const management = await client.fetch(query);
    return management || [];
  } catch (error) {
    console.error('Error fetching management team:', error);
    return [];
  }
};
