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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: input => input
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]+/g, '')
          .replace(/-+/g, '-')
      },
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
      options: {
        dateFormat: 'YYYY-MM-DD',
        calendarTodayLabel: 'Today'
      },
      validation: Rule => Rule.required().min(new Date())
    },
    {
      name: 'time',
      title: 'Time',
      type: 'string',
      options: {
        list: [
          { title: '10:00 AM', value: '10:00 AM' },
          { title: '11:00 AM', value: '11:00 AM' },
          { title: '12:00 PM', value: '12:00 PM' },
          { title: '1:00 PM', value: '1:00 PM' },
          { title: '2:00 PM', value: '2:00 PM' },
          { title: '3:00 PM', value: '3:00 PM' },
          { title: '4:00 PM', value: '4:00 PM' },
          { title: '5:00 PM', value: '5:00 PM' },
          { title: '6:00 PM', value: '6:00 PM' },
          { title: '7:00 PM', value: '7:00 PM' },
          { title: '8:00 PM', value: '8:00 PM' },
          { title: '9:00 PM', value: '9:00 PM' },
          { title: '10:00 PM', value: '10:00 PM' }
        ]
      },
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
    },
    {
      name: 'isFeatured',
      title: 'Featured Performance',
      type: 'boolean',
      initialValue: false,
      description: 'Show this performance in the homepage hero section as the featured performance'
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
