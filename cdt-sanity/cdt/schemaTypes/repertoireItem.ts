import {defineType, defineField} from 'sanity'
import {Rule} from '@sanity/types'

export default defineType({
  name: 'repertoireItem',
  title: 'Repertoire Item',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'composer',
      title: 'Composer',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'e.g., 30 min',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'Year of composition or premiere',
    }),
    defineField({
      name: 'youtubeId',
      title: 'YouTube Video ID',
      type: 'string',
      description: 'The ID of the YouTube video (the part after v= in the URL)',
    }),
    // @ts-ignore - TypeScript workaround for Sanity image field
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Upload a thumbnail image for this repertoire item',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility',
          validation: (Rule: any) => Rule.required(),
        },
      ]
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'instruments',
      title: 'Instruments',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
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
          {title: 'Jamaican', value: 'jamaican'},
        ],
      },
    }),
    defineField({
      name: 'notableRecordings',
      title: 'Notable Recordings',
      type: 'array',
      of: [{type: 'string'}],
      description: 'List of notable recordings or performances',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Classical Masterpieces', value: 'classical'},
          {title: 'Contemporary Works', value: 'contemporary'},
          {title: 'Jamaican Compositions', value: 'jamaican'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule: any) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      composer: 'composer',
      category: 'category',
    },
    prepare(selection: {title: string; composer: string; category: string}) {
      const {title, composer, category} = selection
      const categoryTitles = {
        classical: 'Classical',
        contemporary: 'Contemporary',
        jamaican: 'Jamaican',
      }
      return {
        title,
        subtitle: `${composer} • ${categoryTitles[category as keyof typeof categoryTitles] || category}`,
      }
    },
  },
})
