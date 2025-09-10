// @ts-check
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '../.env.local' });

const client = createClient({
  projectId: 'sbvvl9vs',
  dataset: 'production',
  token: process.env.SANITY_AUTH_TOKEN,
  apiVersion: '2023-05-03',
  useCdn: false,
});

async function updateBaddieLanguage() {
  try {
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
      costumes: 'Steve Cornwall and Kaye-Ann Green',
      lighting: 'Kareen McLean',
      duration: '7:00',
      description: 'Baddie Language is a mixture of old and current dance styles and movement derived from Jamaica\'s culture, characterized by quick, flowing movements, body isolations, and expressive, often exaggerated, moves that incorporate African and Caribbean dance influences.',
      genre: ['dancehall', 'contemporary'],
      stylePeriod: ['Contemporary'],
      category: 'Contemporary Works',
    };

    // Always create a new document with a unique ID
    console.log('Creating new document for Baddie Language');
    const result = await client.create({
      ...doc,
      _id: `baddie-language-${Date.now()}`
    });
    
    console.log('Successfully created Baddie Language with ID:', result._id);
  } catch (error) {
    console.error('Error updating Baddie Language:', error);
  }
}

updateBaddieLanguage();
