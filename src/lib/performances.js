import { client } from './sanityClient';

export const getPerformances = async () => {
  const query = `
    *[_type == "performance"] | order(date asc) {
      _id,
      title,
      company,
      date,
      time,
      venue,
      location,
      image {
        asset-> {
          _id,
          url
        },
        alt
      },
      description,
      category,
      ticketUrl,
      isUpcoming
    }
  `;
  
  try {
    const performances = await client.fetch(query);
    return performances;
  } catch (error) {
    console.error('Error fetching performances:', error);
    return [];
  }
};

export const getUpcomingPerformances = async () => {
  const query = `
    *[_type == "performance" && isUpcoming == true && date >= now()] | order(date asc) {
      _id,
      title,
      company,
      date,
      time,
      venue,
      location,
      image {
        asset-> {
          _id,
          url
        },
        alt
      },
      description,
      category,
      ticketUrl,
      isUpcoming
    }[0...5]
  `;
  
  try {
    const performances = await client.fetch(query);
    return performances;
  } catch (error) {
    console.error('Error fetching upcoming performances:', error);
    return [];
  }
};

export const getPerformanceBySlug = async (slug) => {
  const query = `
    *[_type == "performance" && slug.current == $slug][0] {
      _id,
      title,
      company,
      date,
      time,
      venue,
      location,
      image {
        asset-> {
          _id,
          url
        },
        alt
      },
      description,
      category,
      ticketUrl,
      isUpcoming
    }
  `;
  
  try {
    const performance = await client.fetch(query, { slug });
    return performance;
  } catch (error) {
    console.error('Error fetching performance:', error);
    return null;
  }
};
