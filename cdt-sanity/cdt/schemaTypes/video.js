import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
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
          { title: 'Other', value: 'other' },
        ],
      },
      initialValue: 'videoLog',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'videoFile',
      title: 'Video File',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Optional thumbnail image for the video',
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'Video duration in format MM:SS or HH:MM:SS',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Video',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
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
          { title: 'Interview', value: 'interview' },
        ],
      },
    }),
    defineField({
      name: 'vimeoUrl',
      title: 'Vimeo URL (Optional)',
      type: 'url',
      description: 'If you prefer to host on Vimeo instead of uploading directly',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL (Optional)',
      type: 'url',
      description: 'If you prefer to host on YouTube instead of uploading directly',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      videoType: 'videoType',
      media: 'thumbnail',
    },
    prepare({ title, videoType, media }) {
      return {
        title: title,
        subtitle: `Type: ${videoType}`,
        media: media,
      }
    },
  },
  orderings: [
    {
      title: 'Published Date (Newest First)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Published Date (Oldest First)',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
    {
      title: 'Title (A-Z)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})
