export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'title',
      title: 'Site Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'lightLogo',
      title: 'Light Mode Logo',
      type: 'image',
      description: 'Logo to be displayed in light mode',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility',
          validation: Rule => Rule.required()
        }
      ],
      validation: Rule => Rule.required()
    },
    {
      name: 'darkLogo',
      title: 'Dark Mode Logo',
      type: 'image',
      description: 'Logo to be displayed in dark mode',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility',
          validation: Rule => Rule.required()
        }
      ],
      validation: Rule => Rule.required()
    },
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      description: 'This image will be used as the hero image for Contact, About, Repertoire, and Performances pages',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility',
          validation: Rule => Rule.required()
        }
      ],
      validation: Rule => Rule.required()
    },
    {
      name: 'homePageHeroImage',
      title: 'Home Page Hero Image',
      type: 'image',
      description: 'This image will be used specifically as the hero image for the Home page only',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility',
          validation: Rule => Rule.required()
        }
      ]
    },
    {
      name: 'description',
      title: 'Site Description',
      type: 'text',
      description: 'Description of the website for SEO purposes'
    },
    {
      name: 'videos',
      title: 'Videos',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'slug',
              title: 'Slug',
              type: 'slug',
              options: {
                source: 'title',
                maxLength: 96
              },
              validation: Rule => Rule.required()
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3
            },
            {
              name: 'videoType',
              title: 'Video Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Video Log', value: 'videoLog' },
                  { title: 'Studio Log', value: 'studioLog' },
                  { title: 'Performance', value: 'performance' },
                  { title: 'Interview', value: 'interview' },
                  { title: 'Behind the Scenes', value: 'behindTheScenes' },
                  { title: 'Other', value: 'other' }
                ]
              },
              initialValue: 'videoLog'
            },
            {
              name: 'videoFile',
              title: 'Video File',
              type: 'file',
              options: {
                accept: 'video/*'
              },
              validation: Rule => Rule.required()
            },
            {
              name: 'thumbnail',
              title: 'Thumbnail Image',
              type: 'image',
              options: {
                hotspot: true
              },
              description: 'Optional thumbnail image for the video'
            },
            {
              name: 'duration',
              title: 'Duration',
              type: 'string',
              description: 'Video duration in format MM:SS or HH:MM:SS'
            },
            {
              name: 'publishedAt',
              title: 'Published At',
              type: 'datetime',
              initialValue: () => new Date().toISOString()
            },
            {
              name: 'isFeatured',
              title: 'Featured Video',
              type: 'boolean',
              initialValue: false
            },
            {
              name: 'tags',
              title: 'Tags',
              type: 'array',
              of: [{ type: 'string' }],
              options: {
                layout: 'tags'
              }
            },
            {
              name: 'category',
              title: 'Category',
              type: 'string',
              options: {
                list: [
                  { title: 'Signals', value: 'signals' },
                  { title: 'News + Archive', value: 'newsArchive' },
                  { title: 'Video Log', value: 'videoLog' },
                  { title: 'Studio Log', value: 'studioLog' },
                  { title: 'Performance', value: 'performance' },
                  { title: 'Rehearsal', value: 'rehearsal' },
                  { title: 'Interview', value: 'interview' }
                ]
              }
            },
            {
              name: 'vimeoUrl',
              title: 'Vimeo URL (Optional)',
              type: 'url',
              description: 'If you prefer to host on Vimeo instead of uploading directly'
            },
            {
              name: 'youtubeUrl',
              title: 'YouTube URL (Optional)',
              type: 'url',
              description: 'If you prefer to host on YouTube instead of uploading directly'
            }
          ]
        }
      ]
    }
  ]
};
