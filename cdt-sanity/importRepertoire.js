// Import required modules
const { createClient } = require('@sanity/client');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

// Initialize Sanity client
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || process.env.REACT_APP_SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || process.env.REACT_APP_SANITY_API_VERSION || '2023-05-03',
  token: process.env.SANITY_TOKEN || process.env.REACT_APP_SANITY_TOKEN,
  useCdn: false,
});

if (!process.env.SANITY_PROJECT_ID && !process.env.REACT_APP_SANITY_PROJECT_ID) {
  console.error('Error: Missing Sanity project ID in environment variables');
  process.exit(1);
}

// Repertoire data
const repertoireItems = [
  {
    title: 'Melanin Migration The Journey 2023 Excerpt',
    description: 'this is a test',
    youtubeId: 'UYn0xEwOhJ0',
    choreographer: 'David Blake',
    year: '2023',
  },
  {
    title: 'Divulgence 2014 Excerpt',
    description: 'this is a test',
    youtubeId: 'P0B9h3OHRkg',
    choreographer: 'Reneé I. McDonald, Associate Artistic Director, the company dance theatre',
    year: '2014',
  },
  {
    title: 'Creole Blooming 2010 Excerpts',
    description: 'this is a test',
    youtubeId: '4QnwZ0OlmUk',
    choreographer: 'Michael Holgate',
    year: '2010',
  },
  {
    title: 'Calabash! 1999 Excerpt',
    description: 'this is a test',
    youtubeId: 'BuI-K4ItOSk',
    choreographer: 'Tony Wilson, the od founder, the company dance theatre',
    year: '1999',
  },
  {
    title: 'Baddie Language 2023 Excerpt',
    description: 'this is a test',
    youtubeId: 'HrXTUVPJK1A',
    choreographer: 'Steven Cornwall',
    year: '2023',
  },
  {
    title: 'Gamma Gamma 2022 Excerpt',
    description: 'this is a test',
    youtubeId: 'RGTMRRG_fo8',
    choreographer: 'Dr. Sade Bully-Bell, Artistic Director, the company dance theatre',
    year: '2022',
  },
];

// Function to create or update repertoire items
async function importRepertoire() {
  try {
    const transaction = client.transaction();
    
    for (const item of repertoireItems) {
      // Create a slug from the title
      const slug = item.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with one
        .trim();

      // Create the document
      const doc = {
        _type: 'repertoireItem',
        title: item.title,
        slug: { current: slug },
        description: item.description,
        composer: item.choreographer, // Using choreographer as composer based on schema
        year: item.year,
        youtubeId: item.youtubeId,
      };

      // Add to transaction
      transaction.create(doc);
      console.log(`Added to transaction: ${item.title}`);
    }

    // Commit the transaction
    const result = await transaction.commit();
    console.log('Successfully imported repertoire items:', result);
  } catch (error) {
    console.error('Error importing repertoire items:', error);
  }
}

// Run the import
importRepertoire();
