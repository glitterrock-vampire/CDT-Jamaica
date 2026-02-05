import { client } from './sanity';
import { processNames } from './nameUtils';

export const getBoardMembers = async () => {
  const query = `
    *[_type == "boardMember"] | order(order asc) {
      _id,
      name,
      position,
      bio,
      headshot {
        asset-> {
          _id,
          url
        },
        alt
      },
      term,
      featured,
      order
    }
  `;
  
  try {
    const boardMembers = await client.fetch(query);
    return processNames(boardMembers);
  } catch (error) {
    console.error('Error fetching board members:', error);
    return [];
  }
};

export const getFeaturedBoardMembers = async () => {
  const query = `
    *[_type == "boardMember" && featured == true] | order(order asc) {
      _id,
      name,
      position,
      bio,
      headshot {
        asset-> {
          _id,
          url
        },
        alt
      },
      term,
      featured,
      order
    }
  `;
  
  try {
    const boardMembers = await client.fetch(query);
    return processNames(boardMembers);
  } catch (error) {
    console.error('Error fetching featured board members:', error);
    return [];
  }
};

export const getBoardMemberById = async (id) => {
  const query = `
    *[_type == "boardMember" && _id == $id][0] {
      _id,
      name,
      position,
      bio,
      headshot {
        asset-> {
          _id,
          url
        },
        alt
      },
      term,
      featured,
      order
    }
  `;
  
  try {
    const boardMember = await client.fetch(query, { id });
    return boardMember;
  } catch (error) {
    console.error('Error fetching board member:', error);
    return null;
  }
};
