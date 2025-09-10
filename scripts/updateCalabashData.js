// Script to update the Calabash repertoire item in Sanity
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env.local' });

// Initialize Sanity client
const client = createClient({
  projectId: 'sbvvl9vs', // From sanity.config.ts
  dataset: 'production', // From sanity.config.ts
  token: process.env.SANITY_AUTH_TOKEN, // From .env.local
  apiVersion: '2023-05-03',
  useCdn: false, // Ensure fresh data
});

// Calabash repertoire item data
const calabashData = {
  _type: 'repertoireItem',
  _id: 'calabash', // This should match the existing document ID in Sanity
  title: 'Calabash',
  slug: {
    _type: 'slug',
    current: 'calabash',
  },
  description: 'A vibrant celebration of Jamaican culture through dance, featuring traditional and contemporary movements that tell the story of the Calabash, a symbol of unity and tradition in Jamaican heritage.',
  choreographer: 'Tony Wilson',
  composer: 'Various Traditional',
  companyPremiere: '1999, Little Theatre, Kingston, Jamaica',
  worldPremiere: '1999, Little Theatre, Kingston, Jamaica',
  music: ['Traditional Jamaican Folk Music', 'Pocomania Drums', 'Mento Rhythms'],
  costumeDesign: 'Paulette Bellamy',
  lightingDesign: 'Sharon Purdy',
  genre: ['folk', 'traditional', 'afro-caribbean'],
  stylePeriod: ['contemporary', 'traditional'],
  category: 'jamaican',
  dedicatedTo: 'The people of Jamaica',
  movements: ['Opening Processional', 'Drum Call', 'Harvest Dance', 'Celebration'],
  notableRecordings: ['Calabash - 25th Anniversary Performance (2024)'],
  mediaReviews: [
    {
      quote: "A mesmerizing journey through Jamaican cultural heritage, Calabash is a testament to the company's ability to blend tradition with contemporary dance.",
      source: 'The Jamaica Observer',
      year: 2024,
      url: 'https://www.jamaicaobserver.com/calabash-review'
    },
    {
      quote: "Tony Wilson's choreography in Calabash captures the essence of Jamaican folk traditions with stunning authenticity and energy.",
      source: 'Dance Jamaica Magazine',
      year: 2023,
      url: 'https://www.dancejamaica.com/reviews/calabash-2023'
    }
  ],
  youtubeUrl: 'https://www.youtube.com/watch?v=example123',
  youtubeId: 'example123',
  duration: '00:12:34',
  year: '1999',
  quote: 'The calabash, a vessel of our history, a container of our culture, and a symbol of our unity.',
  status: 'active'
};

// Function to update or create the document
async function updateCalabash() {
  try {
    console.log('Updating Calabash repertoire item...');
    
    // First, check if the document exists
    const existingDoc = await client.getDocument(calabashData._id).catch(() => null);
    
    let result;
    if (existingDoc) {
      // Update existing document
      console.log('Document exists, updating...');
      result = await client
        .patch(calabashData._id)
        .set(calabashData)
        .commit();
    } else {
      // Create new document
      console.log('Creating new document...');
      result = await client.create(calabashData);
    }
    
    console.log('✅ Successfully updated Calabash repertoire item:', result._id);
    return result;
  } catch (error) {
    console.error('❌ Error updating Calabash:', error);
    if (error.response) {
      console.error('Error details:', error.response.body);
    }
    throw error;
  }
}

// Execute the update
updateCalabash()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
