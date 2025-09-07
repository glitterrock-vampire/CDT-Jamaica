// @ts-nocheck
// YouTube duration input component
import YouTubeDurationInput from '../components/YouTubeDurationInput.jsx';

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
      // Convert ISO 8601 duration to MM:SS or H:MM:SS
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
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility',
          options: {
            isHighlighted: true
          }
        }
      ]
    },
    {
      name: 'composer',
      title: 'Composer',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'Video duration (auto-filled from YouTube when YouTube ID is provided)',
      components: {
        input: (props) => {
          const { value, onChange, document } = props;
          const youtubeId = document?.youtubeId;
          return (
            <YouTubeDurationInput
              value={value}
              onChange={onChange}
              youtubeId={youtubeId}
            />
          );
        }
      },
      validation: Rule => Rule.custom(field => {
        // Allow empty field
        if (!field) return true;
        
        // Check if field is an object (incorrect format)
        if (typeof field === 'object') {
          return 'Invalid duration format. Please enter as MM:SS (e.g., 3:45)';
        }
        
        // Convert to string for validation
        const durationStr = String(field).trim();
        
        // Check for MM:SS or H:MM:SS format
        const timeFormat = /^([0-9]+:)?[0-5]?[0-9]:[0-5][0-9]$/;
        
        if (timeFormat.test(durationStr)) {
          return true;
        }
        
        return 'Please enter duration as MM:SS (e.g., 3:45) or H:MM:SS (e.g., 1:23:45)';
      }),
      options: {
        isHighlighted: true
      },
      initialValue: ''
    },
    {
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'Year of composition or premiere'
    },
    {
      name: 'youtubeId',
      title: 'YouTube Video ID',
      type: 'string',
      description: 'The ID of the YouTube video (the part after v= in the URL)',
      options: {
        isHighlighted: true
      },
      validation: Rule => Rule.custom(async (youtubeId, context) => {
        // Skip if we're in a document update and the youtubeId hasn't changed
        if (context.document?.youtubeId === youtubeId) {
          return true;
        }
        
        // Skip if no youtubeId is provided
        if (!youtubeId) {
          return true;
        }
        
        // Get the parent document
        const { getClient } = context;
        const client = getClient({ apiVersion: '2023-05-03' });
        
        try {
          // Fetch the duration from YouTube
          const duration = await fetchYoutubeDuration(youtubeId);
          
          if (duration) {
            // Update the document with the new duration
            await client
              .patch(context.document?._id || '')
              .set({ duration })
              .commit();
          }
        } catch (error) {
          console.error('Error updating YouTube duration:', error);
          // Don't fail validation if there's an error, just log it
        }
        
        return true;
      })
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3
    },
    {
      name: 'instruments',
      title: 'Instruments',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      }
    },
    {
      name: 'style',
      title: 'Style/Period',
      type: 'string',
      options: {
        list: [
          {title: 'Baroque', value: 'baroque'},
          {title: 'Classical', value: 'classical'},
          {title: 'Romantic', value: 'romantic'},
          {title: '20th Century', value: '20th-century'},
          {title: 'Contemporary', value: 'contemporary'},
          {title: 'Jamaican', value: 'jamaican'}
        ]
      }
    },
    {
      name: 'notableRecordings',
      title: 'Notable Recordings',
      type: 'array',
      of: [{type: 'string'}],
      description: 'List of notable recordings or performances'
    },
    {
      name: 'premieredBy',
      title: 'Premiered By',
      type: 'string',
      description: 'Who premiered this piece (if known)'
    },
    {
      name: 'dedicatedTo',
      title: 'Dedicated To',
      type: 'string',
      description: 'If the piece was dedicated to someone'
    },
    {
      name: 'movements',
      title: 'Movements',
      type: 'array',
      of: [{type: 'string'}],
      description: 'List of movements (if applicable)'
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Classical Masterpieces', value: 'classical'},
          {title: 'Contemporary Works', value: 'contemporary'},
          {title: 'Jamaican Compositions', value: 'jamaican'}
        ],
        layout: 'dropdown'
      },
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'title',
      composer: 'composer',
      media: 'thumbnail'
    },
    actions: (prev) => {
      return [
        ...prev,
        {
          label: 'Update YouTube Duration',
          onHandle: async ({ draft, published, onComplete }) => {
            const doc = draft || published;
            if (!doc || !doc.youtubeId) {
              onComplete();
              return;
            }
            
            const YOUTUBE_API_KEY = process.env.SANITY_STUDIO_YOUTUBE_API_KEY;
            if (!YOUTUBE_API_KEY) {
              console.warn('YouTube API key is not set in environment variables');
              onComplete();
              return;
            }
            
            try {
              const response = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?id=${doc.youtubeId}&part=contentDetails&key=${YOUTUBE_API_KEY}`
              );
              const data = await response.json();
              
              if (data.items && data.items.length > 0) {
                const duration = data.items[0].contentDetails.duration;
                const match = duration.match(/PT(?:\d+H)?(\d+M)?(\d+S)?/);
                if (match) {
                  const hours = (duration.match(/(\d+)H/) || [])[1] || 0;
                  const minutes = (duration.match(/(\d+)M/) || [])[1] || 0;
                  const seconds = (duration.match(/(\d+)S/) || [])[1] || 0;
                  
                  let formattedDuration = '';
                  if (hours > 0) {
                    formattedDuration = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                  } else {
                    formattedDuration = `${minutes}:${String(seconds).padStart(2, '0')}`;
                  }
                  
                  await fetch(
                    `https://${process.env.SANITY_STUDIO_PROJECT_ID}.api.sanity.io/v1/data/mutate/production`,
                    {
                      method: 'post',
                      headers: {
                        'Content-type': 'application/json',
                        Authorization: `Bearer ${process.env.SANITY_STUDIO_API_TOKEN}`
                      },
                      body: JSON.stringify({
                        mutations: [
                          {
                            patch: {
                              id: doc._id,
                              set: {
                                duration: formattedDuration,
                                _originalYoutubeId: doc.youtubeId
                              }
                            }
                          }
                        ]
                      })
                    }
                  );
                }
              }
            } catch (error) {
              console.error('Error updating YouTube duration:', error);
            }
            
            onComplete();
          }
        }
      ];
    },
    prepare(selection) {
      return {
        title: selection.title || 'Untitled',
        subtitle: selection.composer || '',
        media: selection.media
      };
    }
  }
};
