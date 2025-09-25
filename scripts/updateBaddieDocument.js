// @ts-check
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '../.env.local' });

// Initialize the Sanity client
const client = createClient({
  projectId: 'sbvvl9vs',
  dataset: 'production',
  token: process.env.SANITY_AUTH_TOKEN, // Make sure to set this in your .env.local file
  apiVersion: '2023-05-03',
  useCdn: false,
});

async function updateBaddieLanguage() {
  try {
    // First, try to find an existing document with the same title
    const existingDocs = await client.fetch(
      `*[_type == "repertoireItem" && title == "Baddie Language"]`
    );

    const doc = {
      _type: 'repertoireItem',
      title: 'Baddie Language',
      slug: {
        _type: 'slug',
        current: 'baddie-language',
      },
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
      description: 'Baddie Language is a mixture of old and current dance styles and movement derived from Jamaica\'s culture, characterized by quick, flowing movements, body isolations, and expressive, often exaggerated, moves that incorporate African and Caribbean dance influences.',
      genre: ['dancehall', 'contemporary'],
      stylePeriod: ['contemporary'],
      category: 'jamaican',
      status: 'active',
    };

    if (existingDocs && existingDocs.length > 0) {
      // Update existing document
      console.log('Updating existing Baddie Language document');
      const docId = existingDocs[0]._id;
      const result = await client
        .patch(docId)
        .set(doc)
        .commit();
      
      console.log('Successfully updated Baddie Language with ID:', result._id);
    } else {
      // Create new document
      console.log('Creating new document for Baddie Language');
      const result = await client.create({
        ...doc,
        _id: `baddie-language-${Date.now()}`
      });
      
      console.log('Successfully created Baddie Language with ID:', result._id);
    }
  } catch (error) {
    console.error('Error updating Baddie Language:', error);
  }
}

updateBaddieLanguage();
