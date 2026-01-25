export default {
  name: 'performance',
  title: 'Performance',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'company',
      title: 'Company',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: Rule => Rule.required()
    },
    {
      name: 'time',
      title: 'Time',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'venue',
      title: 'Venue',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          title: 'Alternative Text',
          type: 'string'
        }
      ]
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Main Stage', value: 'Main Stage' },
          { title: 'Youth Performance', value: 'Youth Performance' },
          { title: 'Showcase', value: 'Showcase' },
          { title: 'Workshop', value: 'Workshop' },
          { title: 'International', value: 'International' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'ticketUrl',
      title: 'Ticket URL',
      type: 'url',
      description: 'Optional link to purchase tickets'
    },
    {
      name: 'isUpcoming',
      title: 'Is Upcoming',
      type: 'boolean',
      initialValue: true,
      description: 'Whether this performance should be shown in upcoming performances'
    }
  ],
  orderings: [
    {
      title: 'Date (Earliest First)',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }]
    },
    {
      title: 'Date (Latest First)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }]
    }
  ],
  preview: {
    select: {
      title: 'title',
      company: 'company',
      date: 'date',
      venue: 'venue',
      media: 'image'
    },
    prepare(selection) {
      const { title, company, date, venue, media } = selection;
      return {
        title: `${title} - ${company}`,
        subtitle: `${new Date(date).toLocaleDateString()} at ${venue}`,
        media
      };
    }
  }
};
