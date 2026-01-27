export default {
  name: 'boardMember',
  title: 'Board Member',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'position',
      title: 'Position/Title',
      type: 'string',
      description: 'e.g., Chairperson, Treasurer, Secretary, Board Member, etc.',
      validation: Rule => Rule.required()
    },
    {
      name: 'bio',
      title: 'Biography',
      type: 'text',
      description: 'Brief biography and background of the board member'
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
      name: 'term',
      title: 'Term',
      type: 'string',
      description: 'e.g., 2024-2026, 2023-Present'
    },
    {
      name: 'featured',
      title: 'Featured Board Member',
      type: 'boolean',
      initialValue: false,
      description: 'Show this board member in featured sections'
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which to display this board member (lower numbers appear first)'
    }
  ],
  orderings: [
    {
      title: 'Position',
      name: 'positionAsc',
      by: [{ field: 'order', direction: 'asc' }]
    },
    {
      title: 'Name (A-Z)',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }]
    }
  ],
  preview: {
    select: {
      title: 'name',
      position: 'position',
      media: 'headshot'
    },
    prepare(selection) {
      const { title, position, media } = selection;
      return {
        title: title,
        subtitle: position || 'Board Member',
        media
      };
    }
  }
};
