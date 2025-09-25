// @ts-nocheck
import YouTubeDurationInput from '../components/YouTubeDurationInput.jsx';

// Common validation rules
const requiredField = Rule => Rule.required();
const urlValidation = Rule => Rule.uri({
  scheme: ['http', 'https', 'mailto', 'tel']
});

// Function to fetch duration from YouTube API
async function fetchYoutubeDuration(youtubeId) {
  if (!youtubeId) return null;
  
  const YOUTUBE_API_KEY = process.env.SANITY_STUDIO_YOUTUBE_API_KEY;
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key is not set in environment variables');
    return null;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${youtubeId}&part=contentDetails&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const duration = data.items[0].contentDetails.duration;
      const match = duration.match(/PT(?:\d+H)?(\d+M)?(\d+S)?/);
      
      if (match) {
        const hours = (duration.match(/(\d+)H/) || [])[1] || 0;
        const minutes = (duration.match(/(\d+)M/) || [])[1] || 0;
        const seconds = (duration.match(/(\d+)S/) || [])[1] || 0;
        
        if (hours > 0) {
          return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
        return `${minutes}:${String(seconds).padStart(2, '0')}`;
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching YouTube duration:', error);
    return null;
  }
}

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
      validation: requiredField,
      description: 'The title of the piece'
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      initialValue: 'jamaican',
      hidden: true,
      readOnly: true
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
      name: 'composer',
      title: 'Composer',
      type: 'string',
      description: 'The composer of the music'
    },
    {
      name: 'music',
      title: 'Music Credits',
      type: 'array',
      of: [{type: 'string'}],
      description: 'List of music credits'
    },
    {
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      description: 'Whether this piece should be featured prominently',
      initialValue: false
    },
    {
      name: 'difficulty',
      title: 'Difficulty Level',
      type: 'string',
      options: {
        list: [
          {title: 'Beginner', value: 'beginner'},
          {title: 'Intermediate', value: 'intermediate'},
          {title: 'Advanced', value: 'advanced'},
          {title: 'Professional', value: 'professional'}
        ]
      },
      description: 'Technical difficulty level of the piece'
    },
    {
      name: 'performanceNotes',
      title: 'Performance Notes',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'}
          ]
        }
      ],
      description: 'Detailed performance notes and cast information',
      // Ensure the field can handle both array and single block formats
      validation: Rule => Rule.custom(field => {
        // If the field is already an array or undefined, it's valid
        if (Array.isArray(field) || field === undefined) return true;
        
        // If it's a single block, wrap it in an array
        if (field && field._type === 'block') return true;
        
        return 'Performance notes must be a block of text or an array of blocks';
      }),
      // Normalize the data to always be an array
      prepare: value => {
        if (!value) return { value: [] };
        if (Array.isArray(value)) return { value };
        if (value._type === 'block') return { value: [value] };
        return { value: [] };
      }
    },
    // SEO and technical requirements are defined later in the schema
    {
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: requiredField,
      description: 'The year the piece was created'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'A brief description of the piece',
      validation: Rule => Rule.max(300).warning('Description should be less than 300 characters')
    },
    
    // Media (mainImage removed; using heroImage and thumbnail only)
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'A larger hero image for the piece',
    },
    
    // Performance Details
    {
      name: 'premieredBy',
      title: 'Premiered By',
      type: 'string',
      description: 'The company or group that premiered this piece'
    },
    {
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'A thumbnail image for the piece'
    },
    {
      name: 'youtubeId',
      title: 'YouTube Video ID',
      type: 'string',
      description: 'The YouTube video ID (the part after v= in the URL)'
    },
    
    // Duration
    {
      name: 'duration',
      title: 'Duration',
      type: 'string',
      inputComponent: YouTubeDurationInput,
      description: 'Duration in MM:SS format (e.g., 03:45)',
      validation: Rule => Rule.custom(field => {
        if (!field) return true;
        if (typeof field === 'object') return 'Invalid duration format. Please enter as MM:SS (e.g., 3:45)';
        const durationStr = String(field).trim();
        
        // Check if the duration matches MM:SS or H:MM:SS format
        if (!/^\d{1,2}:\d{2}(?::\d{2})?$/.test(durationStr)) {
          return 'Invalid duration format. Please enter as MM:SS or H:MM:SS (e.g., 3:45 or 1:23:45)';
        }
        
        const parts = durationStr.split(':');
        const minutes = parseInt(parts[parts.length - 2], 10);
        const seconds = parseInt(parts[parts.length - 1], 10);
        
        if (minutes > 59) return 'Minutes cannot be more than 59';
        if (seconds > 59) return 'Seconds cannot be more than 59';
        
        return true;
      })
    },
    
    // Additional Information
    {
      name: 'dancers',
      title: 'Number of Dancers',
      type: 'number',
      description: 'The number of dancers required for this piece',
      validation: Rule => Rule.min(1).integer().positive()
    },
    {
      name: 'style',
      title: 'Dance Style',
      type: 'string',
      options: {
        list: [
          {title: 'Contemporary', value: 'contemporary'},
          {title: 'Dancehall', value: 'dancehall'},
          {title: 'Modern', value: 'modern'},
          {title: 'Jazz', value: 'jazz'},
          {title: 'Hip Hop', value: 'hiphop'},
          {title: 'Ballet', value: 'ballet'},
          {title: 'Fusion', value: 'fusion'},
          {title: 'Other', value: 'other'}
        ]
      },
      description: 'The primary dance style of the piece'
    },
    {
      name: 'genre',
      title: 'Genres',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Contemporary', value: 'contemporary'},
          {title: 'Dancehall', value: 'dancehall'},
          {title: 'Modern', value: 'modern'},
          {title: 'Jazz', value: 'jazz'},
          {title: 'Hip Hop', value: 'hiphop'},
          {title: 'Ballet', value: 'ballet'},
          {title: 'Fusion', value: 'fusion'},
          {title: 'Folk', value: 'folk'},
          {title: 'Afro-Modern', value: 'afro-modern'}
        ]
      },
      description: 'List of genres that describe this piece'
    },
    // Style Periods
    {
      name: 'stylePeriod',
      title: 'Style Periods',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Contemporary', value: 'contemporary'},
          {title: 'Modern', value: 'modern'},
          {title: 'Traditional', value: 'traditional'}
        ]
      },
      description: 'Style periods that influence this piece'
    },
    
    // Status
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Active', value: 'active'},
          {title: 'Archived', value: 'archived'},
          {title: 'In Development', value: 'in-development'}
        ]
      },
      initialValue: 'active',
      description: 'The current status of this piece in the repertoire'
    },
    
    // SEO Metadata
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'SEO Title',
          type: 'string',
          description: 'Title for search engines (defaults to the piece title)'
        },
        {
          name: 'description',
          title: 'SEO Description',
          type: 'text',
          rows: 2,
          description: 'Description for search engines (defaults to the piece description)'
        }
      ]
    },
    
    // Technical Requirements
    {
      name: 'technicalRequirements',
      title: 'Technical Requirements',
      type: 'array',
      of: [{type: 'string'}],
      description: 'List of technical requirements for this piece'
    },
    {
      name: 'costumeDesign',
      title: 'Costume Design',
      type: 'string',
      description: 'Name of the costume designer'
    },
    {
      name: 'lightingDesign',
      title: 'Lighting Design',
      type: 'string',
      description: 'Name of the lighting designer'
    },
    {
      name: 'lighting',
      title: 'Lighting',
      type: 'string',
      description: 'Lighting information',
      hidden: true
    },
    {
      name: 'costumes',
      title: 'Costumes',
      type: 'string',
      description: 'Costume information',
      hidden: true
    },
    
    // Performance Information
    {
      name: 'worldPremiere',
      title: 'World Premiere',
      type: 'string',
      description: 'Location and year of world premiere'
    },
    {
      name: 'companyPremiere',
      title: 'Company Premiere',
      type: 'string',
      description: 'Location and year of company premiere'
    },
    {
      name: 'dedicatedTo',
      title: 'Dedicated To',
      type: 'string',
      description: 'Dedication information'
    },
    
    // Media and Reviews
    {
      name: 'mediaReviews',
      title: 'Media Reviews',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'quote',
            title: 'Quote',
            type: 'text',
            rows: 3
          },
          {
            name: 'source',
            title: 'Source',
            type: 'string'
          },
          {
            name: 'year',
            title: 'Year',
            type: 'string'
          },
          {
            name: 'url',
            title: 'URL',
            type: 'url'
          }
        ]
      }],
      description: 'Notable reviews or quotes about the piece'
    },
    
    // Structure
    {
      name: 'movements',
      title: 'Movements',
      type: 'array',
      of: [{type: 'string'}],
      description: 'List of movements or sections in the piece'
    },
    
    // Additional Information
    {
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 2,
      description: 'A notable quote about the piece'
    },
    {
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      description: 'Full YouTube URL for the piece'
    },
    
    // Additional Notes
    {
      name: 'notes',
      title: 'Additional Notes',
      type: 'text',
      rows: 3,
      description: 'Any additional notes about this piece'
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
      const {title, subtitle, year} = selection;
      const media = selection.media || selection.altMedia;
      return {
        title: title,
        subtitle: `${subtitle} (${year})`,
        media
      };
    }
  }
};
