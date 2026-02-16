export default {
  title: 'Management Team Member',
  name: 'management',
  type: 'document',
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string',
      validation: Rule => Rule.required().min(2).max(50)
    },
    {
      title: 'Title/Role',
      name: 'title',
      type: 'string',
      validation: Rule => Rule.required().min(2).max(100)
    },
    {
      title: 'Bio',
      name: 'bio',
      type: 'text',
      rows: 3
    },
    {
      title: 'Headshot',
      name: 'headshot',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          title: 'Alternative Text',
          name: 'alt',
          type: 'string',
          description: 'Important for SEO and web accessibility.'
        }
      ]
    },
    {
      title: 'Order',
      name: 'order',
      type: 'number',
      description: 'Display order for management team members'
    }
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [
        { field: 'order', direction: 'asc' }
      ]
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
      media: 'headshot'
    }
  }
}
