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
      learnMoreUrl,
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
    *[_type == "performance" && date >= now()] | order(date asc) {
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
      learnMoreUrl,
      isUpcoming,
      slug {
        current
      }
    }
  `;
  
  try {
    const performances = await client.fetch(query);
    // Fix timezone issues for each performance
    const fixedPerformances = performances.map(performance => ({
      ...performance,
      date: fixSanityDate(performance.date)
    }));

    // Hardcoded March 14th performance - always include today
    const march14Performance = {
      _id: 'march14-2026-hardcoded',
      title: 'Caribbean Dance Showcase',
      company: 'CDT Senior Company',
      date: new Date(2026, 2, 14), // March 14, 2026
      time: '7:00 PM',
      venue: 'Phillip Sherlock Center',
      location: 'Kingston, Jamaica',
      image: {
        asset: {
          _id: 'image-march14',
          url: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&h=600&fit=crop'
        },
        alt: 'Caribbean Dance Showcase Performance'
      },
      description: 'An electrifying evening of contemporary Caribbean dance featuring original choreography that celebrates our rich cultural heritage while pushing artistic boundaries.',
      category: 'Main Stage',
      ticketUrl: 'https://www.miramarculturalcenter.org/Events-directory/Streams',
      learnMoreUrl: '/performances',
      isUpcoming: true,
      slug: { current: 'caribbean-dance-showcase-march-14' }
    };

    // Combine hardcoded performance with Sanity performances, remove duplicates, and sort
    const allPerformances = [march14Performance, ...fixedPerformances];
    const uniquePerformances = allPerformances.filter((perf, index, self) => 
      index === self.findIndex(p => p._id === perf._id)
    );
    
    return uniquePerformances.sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch (error) {
    console.error('Error fetching upcoming performances:', error);
    // Return just the hardcoded performance if Sanity fails
    return [{
      _id: 'march14-2026-hardcoded',
      title: 'Caribbean Dance Showcase',
      company: 'CDT Senior Company',
      date: new Date(2026, 2, 14),
      time: '7:00 PM',
      venue: 'Phillip Sherlock Center',
      location: 'Kingston, Jamaica',
      image: {
        asset: {
          _id: 'image-march14',
          url: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&h=600&fit=crop'
        },
        alt: 'Caribbean Dance Showcase Performance'
      },
      description: 'An electrifying evening of contemporary Caribbean dance featuring original choreography that celebrates our rich cultural heritage while pushing artistic boundaries.',
      category: 'Main Stage',
      ticketUrl: 'https://www.miramarculturalcenter.org/Events-directory/Streams',
      learnMoreUrl: '/performances',
      isUpcoming: true,
      slug: { current: 'caribbean-dance-showcase-march-14' }
    }];
  }
};

export const getFeaturedPerformance = async () => {
  // Hardcoded March 14th performance for hero section
  const march14Featured = {
    _id: 'march14-2026-featured',
    title: 'Caribbean Dance Showcase',
    slug: { current: 'caribbean-dance-showcase-march-14' },
    date: new Date(2026, 2, 14), // March 14, 2026
    time: '7:00 PM',
    venue: 'Phillip Sherlock Center',
    location: 'Kingston, Jamaica',
    description: 'An electrifying evening of contemporary Caribbean dance featuring original choreography that celebrates our rich cultural heritage while pushing artistic boundaries.',
    learnMoreUrl: '/performances',
    isFeatured: true,
    image: {
      asset: {
        _id: 'hero-image-march14',
        url: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=1920&h=1080&fit=crop'
      },
      alt: 'Caribbean Dance Showcase Performance'
    }
  };

  // Try to get featured from Sanity, but fallback to hardcoded March 14th
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
      description,
      learnMoreUrl,
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
      return performance;
    }
    // Fallback to hardcoded March 14th performance
    return march14Featured;
  } catch (error) {
    console.error('Error fetching featured performance:', error);
    // Return hardcoded March 14th performance as fallback
    return march14Featured;
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
      learnMoreUrl,
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
