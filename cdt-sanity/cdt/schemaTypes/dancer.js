export default {
  name: 'dancer',
  title: 'Dancer',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'role',
      title: 'Role/Position',
      type: 'string',
      description: 'e.g., Principal Dancer, Company Member, Apprentice, etc.'
    },
    {
      name: 'bio',
      title: 'Biography',
      type: 'text',
      description: 'Brief biography of the dancer'
    },
    {
      name: 'headshot',
      title: 'Headshot',
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
          validation: Rule => Rule.required()
        }
      ],
      validation: Rule => Rule.required()
    },
    {
      name: 'yearsActive',
      title: 'Years Active',
      type: 'string',
      description: 'e.g., 2020-Present, 2018-2022'
    },
    {
      name: 'featured',
      title: 'Featured Dancer',
      type: 'boolean',
      initialValue: false,
      description: 'Show this dancer in featured sections'
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which to display this dancer (lower numbers appear first)'
    }
  ],
  orderings: [
    {
      title: 'Name (A-Z)',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }]
    },
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }]
    }
  ],
  preview: {
    select: {
      title: 'name',
      role: 'role',
      media: 'headshot'
    },
    prepare(selection) {
      const { title, role, media } = selection;
      return {
        title: title,
        subtitle: role || 'Dancer',
        media
      };
    }
  }
};
