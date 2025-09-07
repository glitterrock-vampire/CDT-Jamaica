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
      description: 'This image will be used as the hero image in the navigation bar',
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
          },
          validation: Rule => Rule.required()
        }
      ],
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Site Description',
      type: 'text',
      description: 'Description of the website for SEO purposes'
    }
  ]
};
