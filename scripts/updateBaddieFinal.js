// Script to update the Baddie Language document with the latest information
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env.local' });

// Initialize Sanity client
const client = createClient({
  projectId: 'sbvvl9vs',
  dataset: 'production',
  token: process.env.SANITY_AUTH_TOKEN, // Make sure to set this in your .env.local file
  apiVersion: '2023-05-03',
  useCdn: false
});

async function updateBaddieLanguage() {
  try {
    // The document ID from our previous search
    const docId = '7gNGK9M49tqCuJRrasQYRK';
    console.log('Updating Baddie Language document...');
    
    const result = await client
      .patch(docId)
      .set({
        title: 'Baddie Language',
        slug: { _type: 'slug', current: 'baddie-language' },
        description: 'Baddie Language is a mixture of old and current dance styles and movement derived from Jamaica\'s culture, characterized by quick, flowing movements, body isolations, and expressive, often exaggerated, moves that incorporate African and Caribbean dance influences.',
        choreographer: 'Steve Cornwall',
        composer: 'Various Artists',
        companyPremiere: 'Little Theatre (CDT 2023 Season)',
        worldPremiere: 'Little Theatre (CDT 2023 Season)',
        music: [
          'Buju Banton',
          'Lisa Hype',
          'Stalk Ashley',
          'SQUASH',
          'Vybz Kartel'
        ],
        costumeDesign: 'Steve Cornwall and Kaye-Ann Green',
        lightingDesign: 'Kareen McLean',
        duration: '7:00',
        genre: ['dancehall', 'contemporary'],
        stylePeriod: ['contemporary'],
        category: 'jamaican',
        status: 'active',
      })
      .commit();
    
    console.log('Successfully updated Baddie Language document:', result._id);
  } catch (error) {
    console.error('Error updating Baddie Language:', error);
  }
}

updateBaddieLanguage();
