// @ts-nocheck

// Common validation rules
const requiredField = Rule => Rule.required();
const urlValidation = Rule => Rule.uri({
  scheme: ['http', 'https', 'mailto', 'tel']
});

// Function to fetch duration from YouTube API
// async function fetchYoutubeDuration(youtubeId) {
//   if (!youtubeId) return null;
  
//   const YOUTUBE_API_KEY = process.env.SANITY_STUDIO_YOUTUBE_API_KEY;
//   if (!YOUTUBE_API_KEY) {
//     console.warn('YouTube API key is not set in environment variables');
//     return null;
//   }

//   try {
//     const response = await fetch(
//       `https://www.googleapis.com/youtube/v3/videos?id=${youtubeId}&part=contentDetails&key=${YOUTUBE_API_KEY}`
//     );
//     const data = await response.json();
    
//     if (data.items && data.items.length > 0) {
//       const duration = data.items[0].contentDetails.duration;
//       const match = duration.match(/PT(?:\d+H)?(\d+M)?(\d+S)?/);
      
//       if (match) {
//         const hours = (duration.match(/(\d+)H/) || [])[1] || 0;
//         const minutes = (duration.match(/(\d+)M/) || [])[1] || 0;
//         const seconds = (duration.match(/(\d+)S/) || [])[1] || 0;
        
//         if (hours > 0) {
//           return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
//         }
//         return `${minutes}:${String(seconds).padStart(2, '0')}`;
//       }
//     }
//     return null;
//   } catch (error) {
//     console.error('Error fetching YouTube duration:', error);
//     return null;
//   }
// }

export default {
  name: 'repertoireItem',
  title: 'Repertoire Item',
  type: 'document',
  fields: [
    // Basic Information
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The title of the piece',
      validation: Rule => Rule.required()
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Optional subtitle for the piece'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: requiredField,
      description: 'The URL-friendly version of the title (auto-generated from title)'
    },
    {
      name: 'choreographer',
      title: 'Choreographer',
      type: 'string',
      validation: requiredField,
      description: 'The name of the choreographer'
    },
    {
      name: 'companyPremiere',
      title: 'Company Premiere',
      type: 'string',
      description: 'When and where the company first performed this piece'
    },
    {
      name: 'music',
      title: 'Music Credits',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of music credits'
    },
    {
      name: 'costumeDesign',
      title: 'Costume Design',
      type: 'string',
      description: 'Name of the costume designer'
    },
    {
      name: 'lighting',
      title: 'Lighting',
      type: 'string',
      description: 'Name of the lighting designer'
    },
    {
      name: 'runTime',
      title: 'Run Time',
      type: 'string',
      description: 'Run time in MM:SS format (e.g., 03:45)',
      validation: Rule => Rule.custom(field => {
        if (!field) return true;
        const durationStr = String(field).trim();
        if (!/^\d{1,2}:\d{2}(?::\d{2})?$/.test(durationStr)) {
          return 'Invalid format. Please enter as MM:SS or H:MM:SS (e.g., 3:45 or 1:23:45)';
        }
        const parts = durationStr.split(':');
        const minutes = parseInt(parts[parts.length - 2], 10);
        const seconds = parseInt(parts[parts.length - 1], 10);
        if (minutes > 59) return 'Minutes cannot be more than 59';
        if (seconds > 59) return 'Seconds cannot be more than 59';
        return true;
      })
    },
    {
      name: 'worldPremiere',
      title: 'World Premiere',
      type: 'string',
      description: 'When and where the piece was first performed'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' }
          ]
        }
      ],
      description: 'Detailed description of the piece'
    },
    {
      name: 'mediaReviews',
      title: 'Media Reviews',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'quote', title: 'Quote', type: 'text', rows: 3, validation: requiredField },
            { name: 'source', title: 'Source', type: 'string', validation: requiredField },
            { name: 'author', title: 'Author', type: 'string' },
            { name: 'year', title: 'Year', type: 'string' },
            { name: 'url', title: 'URL', type: 'url', validation: urlValidation }
          ]
        }
      ],
      description: 'Notable reviews or quotes about the piece'
    },
    // Additional Fields (to support existing data and DanceDetail.js)
    // {
    //   name: 'composer',
    //   title: 'Composer',
    //   type: 'string',
    //   description: 'The composer(s) of the music'
    // },
    {
      name: 'year',
      title: 'Year',
      type: 'number',
      description: 'Year of the world premiere'
    },
    // {
    //   name: 'premieredBy',
    //   title: 'Premiered By',
    //   type: 'string',
    //   description: 'The company or individual who premiered the piece'
    // },
    // {
    //   name: 'dedicatedTo',
    //   title: 'Dedicated To',
    //   type: 'string',
    //   description: 'Person or group the piece is dedicated to'
    // },
    // {
    //   name: 'genre',
    //   title: 'Genres',
    //   type: 'array',
    //   of: [{ type: 'string' }],
    //   options: {
    //     list: [
    //       { title: 'Contemporary', value: 'contemporary' },
    //       { title: 'Dancehall', value: 'dancehall' },
    //       { title: 'Modern', value: 'modern' },
    //       { title: 'Jazz', value: 'jazz' },
    //       { title: 'Hip Hop', value: 'hiphop' },
    //       { title: 'Ballet', value: 'ballet' },
    //       { title: 'Fusion', value: 'fusion' },
    //       { title: 'Folk', value: 'folk' },
    //       { title: 'Afro-Modern', value: 'afro-modern' }
    //     ]
    //   },
    //   description: 'List of genres that describe this piece'
    // },
    // {
    //   name: 'stylePeriod',
    //   title: 'Style Periods',
    //   type: 'array',
    //   of: [{ type: 'string' }],
    //   options: {
    //     list: [
    //       { title: 'Contemporary', value: 'contemporary' },
    //       { title: 'Modern', value: 'modern' },
    //       { title: 'Traditional', value: 'traditional' }
    //     ]
    //   },
    //   description: 'Style periods that influence this piece'
    // },
    // {
    //   name: 'movements',
    //   title: 'Movements',
    //   type: 'array',
    //   of: [{ type: 'string' }],
    //   description: 'List of movements or sections in the piece'
    // },
    {
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Thumbnail image for the piece (square format)'
    },
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Hero image for the piece (landscape format)'
    },
    {
      name: 'galleryImages',
      title: 'Gallery Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true, metadata: ['blurhash', 'lqip', 'palette', 'exif', 'location'] },
          fields: [
            { name: 'alt', title: 'Alt Text', type: 'string', description: 'Alternative text for accessibility' },
            { name: 'caption', title: 'Caption', type: 'string', description: 'Optional caption for the image' }
          ]
        }
      ],
      description: 'Additional images for the gallery section (up to 10 images recommended)',
      validation: Rule => Rule.max(10).warning('Consider limiting to 10 images for optimal performance')
    },
    // {
    //   name: 'youtubeUrl',
    //   title: 'YouTube URL',
    //   type: 'url',
    //   validation: urlValidation,
    //   description: 'Full YouTube URL for the piece'
    // },
    {
      name: 'youtubeId',
      title: 'YouTube ID',
      type: 'string',
      description: 'The YouTube video ID (e.g., 4QnwZ0OlmUk)'
    },
    // {
    //   name: 'isFeatured',
    //   title: 'Featured',
    //   type: 'boolean',
    //   description: 'Whether this piece should be featured prominently',
    //   initialValue: false
    // },
    // {
    //   name: 'status',
    //   title: 'Status',
    //   type: 'string',
    //   options: {
    //     list: [
    //       { title: 'Active', value: 'active' },
    //       { title: 'Archived', value: 'archived' },
    //       { title: 'In Development', value: 'in-development' }
    //     ]
    //   },
    //   initialValue: 'active',
    //   description: 'The current status of this piece in the repertoire'
    // },
    // {
    //   name: 'difficulty',
    //   title: 'Difficulty Level',
    //   type: 'string',
    //   options: {
    //     list: [
    //       { title: 'Beginner', value: 'beginner' },
    //       { title: 'Intermediate', value: 'intermediate' },
    //       { title: 'Advanced', value: 'advanced' },
    //       { title: 'Professional', value: 'professional' }
    //     ]
    //   },
    //   description: 'Technical difficulty level of the piece'
    // },
    // {
    //   name: 'performanceNotes',
    //   title: 'Performance Notes',
    //   type: 'array',
    //   of: [
    //     {
    //       type: 'block',
    //       styles: [
    //         { title: 'Normal', value: 'normal' },
    //         { title: 'H1', value: 'h1' },
    //         { title: 'H2', value: 'h2' },
    //         { title: 'H3', value: 'h3' },
    //         { title: 'Quote', value: 'blockquote' }
    //       ]
    //     }
    //   ],
    //   description: 'Detailed performance notes and cast information'
    // },
    // {
    //   name: 'technicalRequirements',
    //   title: 'Technical Requirements',
    //   type: 'array',
    //   of: [{ type: 'string' }],
    //   description: 'List of technical requirements for this piece'
    // },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'title', title: 'SEO Title', type: 'string', description: 'Title for search engines' },
        { name: 'description', title: 'SEO Description', type: 'text', rows: 2, description: 'Description for search engines' }
      ]
    }
  ],
  
  // Preview configuration
  preview: {
    select: {
      title: 'title',
      subtitle: 'choreographer',
      media: 'thumbnail',
      altMedia: 'heroImage',
      year: 'year'
    },
    prepare(selection) {
      const { title, subtitle, media, altMedia, year } = selection;
      const displayMedia = media || altMedia;
      const yearText = year ? year : '';
      return {
        title: title || 'Untitled',
        subtitle: [subtitle, yearText].filter(Boolean).join(' • '),
        media: displayMedia
      };
    }
  }
};