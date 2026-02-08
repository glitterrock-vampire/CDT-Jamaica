import { client } from './sanity';

// Helper function to fix timezone issues with Sanity dates
const fixSanityDate = (date) => {
  if (!date) return null;
  
  // If date is a string, create a Date object
  const dateObj = new Date(date);
  
  // Get the date components in UTC to avoid timezone shifts
  const year = dateObj.getUTCFullYear();
  const month = dateObj.getUTCMonth();
  const day = dateObj.getUTCDate();
  
  // Create a new Date object using the local timezone with UTC components
  // This preserves the original date that was stored in Sanity
  return new Date(year, month, day);
};

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
    // Fix timezone issues for each performance
    return performances.map(performance => ({
      ...performance,
      date: fixSanityDate(performance.date)
    }));
  } catch (error) {
    console.error('Error fetching performances:', error);
    return [];
  }
};

export const getUpcomingPerformances = async () => {
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
      isUpcoming,
      slug {
        current
      }
    }
  `;
  
  try {
    const performances = await client.fetch(query);
    // Fix timezone issues for each performance
    return performances.map(performance => ({
      ...performance,
      date: fixSanityDate(performance.date)
    }));
  } catch (error) {
    console.error('Error fetching upcoming performances:', error);
    return [];
  }
};

export const getFeaturedPerformance = async () => {
  const query = `
    *[_type == "performance" && isFeatured == true] | order(date asc) [0] {
      _id,
      title,
      slug {
        current
      },
      date,
      time,
      venue,
      location,
      isFeatured,
      image {
        asset-> {
          _id,
          url
        },
        alt
      }
    }
  `;
  
  try {
    const performance = await client.fetch(query);
    // Fix timezone issue for the performance
    if (performance) {
      performance.date = fixSanityDate(performance.date);
    }
    return performance;
  } catch (error) {
    console.error('Error fetching featured performance:', error);
    return null;
  }
};

export const getPerformanceBySlug = async (slug) => {
  console.log('getPerformanceBySlug called with slug:', slug);
  
  // Try multiple slug formats to handle different naming conventions
  const possibleSlugs = [
    slug, // Original slug as-is
    slug.startsWith('performance-') ? slug.replace('performance-', '') : slug, // Without prefix
    slug.startsWith('performance-') ? slug : `performance-${slug}`, // With prefix
  ];
  
  // Remove duplicates
  const uniqueSlugs = [...new Set(possibleSlugs)];
  console.log('Trying slugs:', uniqueSlugs);
  
  const query = `
    *[_type == "performance" && slug.current in $slugs][0] {
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
    const performance = await client.fetch(query, { slugs: uniqueSlugs });
    console.log('Query result:', performance);
    if (performance) {
      performance.date = fixSanityDate(performance.date);
    }
    return performance;
  } catch (error) {
    console.error('Error fetching performance by slug:', error);
    throw error;
  }
};

export const getVideos = async () => {
  const query = `
    *[_type == "siteSettings"][0] {
      videos[] {
        _key,
        title,
        slug,
        description,
        videoType,
        videoFile {
          asset-> {
            _id,
            url,
            originalFilename
          }
        },
        thumbnail {
          asset-> {
            _id,
            url
          },
          alt
        },
        duration,
        publishedAt,
        isFeatured,
        tags,
        category,
        vimeoUrl,
        youtubeUrl
      }
    }
  `;
  
  try {
    const siteSettings = await client.fetch(query);
    const videos = siteSettings?.videos || [];
    // Fix timezone issues for publishedAt dates
    return videos.map(video => ({
      ...video,
      publishedAt: fixSanityDate(video.publishedAt)
    }));
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};

export const getFeaturedVideos = async () => {
  const query = `
    *[_type == "siteSettings"][0] {
      videos[isFeatured == true] {
        _key,
        title,
        slug,
        description,
        videoType,
        videoFile {
          asset-> {
            _id,
            url,
            originalFilename
          }
        },
        thumbnail {
          asset-> {
            _id,
            url
          },
          alt
        },
        duration,
        publishedAt,
        isFeatured,
        tags,
        category,
        vimeoUrl,
        youtubeUrl
      }
    }
  `;
  
  try {
    const siteSettings = await client.fetch(query);
    const videos = siteSettings?.videos || [];
    // Fix timezone issues for publishedAt dates
    return videos.map(video => ({
      ...video,
      publishedAt: fixSanityDate(video.publishedAt)
    }));
  } catch (error) {
    console.error('Error fetching featured videos:', error);
    return [];
  }
};

export const getAllVideos = async () => {
  const query = `
    *[_type == "siteSettings"][0] {
      videos[] {
        _key,
        title,
        slug,
        description,
        videoType,
        videoFile {
          asset-> {
            _id,
            url,
            originalFilename
          }
        },
        thumbnail {
          asset-> {
            _id,
            url
          },
          alt
        },
        duration,
        publishedAt,
        isFeatured,
        tags,
        category,
        vimeoUrl,
        youtubeUrl
      }
    }
  `;
  
  try {
    const siteSettings = await client.fetch(query);
    const videos = siteSettings?.videos || [];
    // Fix timezone issues for publishedAt dates
    return videos.map(video => ({
      ...video,
      publishedAt: fixSanityDate(video.publishedAt)
    }));
  } catch (error) {
    console.error('Error fetching all videos:', error);
    return [];
  }
};

export const getVideosByCategory = async (category) => {
  const query = `
    *[_type == "siteSettings"][0] {
      videos[category == $category] {
        _key,
        title,
        slug,
        description,
        videoType,
        videoFile {
          asset-> {
            _id,
            url,
            originalFilename
          }
        },
        thumbnail {
          asset-> {
            _id,
            url
          },
          alt
        },
        duration,
        publishedAt,
        isFeatured,
        tags,
        category,
        vimeoUrl,
        youtubeUrl
      }
    }
  `;
  
  try {
    console.log('Fetching videos for category:', category);
    const siteSettings = await client.fetch(query, { category });
    console.log('Site settings result:', siteSettings);
    const videos = siteSettings?.videos || [];
    console.log('Filtered videos:', videos);
    // Fix timezone issues for publishedAt dates
    return videos.map(video => ({
      ...video,
      publishedAt: fixSanityDate(video.publishedAt)
    }));
  } catch (error) {
    console.error('Error fetching videos by category:', error);
    return [];
  }
};

export const getVideoBySlug = async (slug) => {
  const query = `
    *[_type == "siteSettings"][0] {
      videos[slug.current == $slug || _key == $slug] {
        _key,
        title,
        slug,
        description,
        videoType,
        videoFile {
          asset-> {
            _id,
            url,
            originalFilename
          }
        },
        thumbnail {
          asset-> {
            _id,
            url
          },
          alt
        },
        duration,
        publishedAt,
        isFeatured,
        tags,
        category,
        vimeoUrl,
        youtubeUrl
      }
    }
  `;
  
  try {
    const siteSettings = await client.fetch(query, { slug });
    const videos = siteSettings?.videos || [];
    const video = Array.isArray(videos) ? videos[0] : (videos || null);
    // Fix timezone issue for the video
    if (video) {
      video.publishedAt = fixSanityDate(video.publishedAt);
    }
    return video;
  } catch (error) {
    console.error('Error fetching video by slug:', error);
    return null;
  }
};

export const getDancers = async () => {
  const query = `*[_type == "dancer"] | order(order asc) {
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
  }`;

  try {
    const dancers = await client.fetch(query);
    return dancers || [];
  } catch (error) {
    console.error('Error fetching dancers:', error);
    return [];
  }
};

export const getBoardMembers = async () => {
  const query = `*[_type == "boardMember"] | order(order asc) {
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
    order
  }`;

  try {
    const boardMembers = await client.fetch(query);
    return boardMembers || [];
  } catch (error) {
    console.error('Error fetching board members:', error);
    return [];
  }
};

export const getManagement = async () => {
  const query = `*[_type == "management"] | order(order asc) {
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
  }`;

  try {
    const management = await client.fetch(query);
    return management || [];
  } catch (error) {
    console.error('Error fetching management:', error);
    return [];
  }
};
