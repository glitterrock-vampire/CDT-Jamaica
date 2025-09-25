// This script updates the Baddie Language document using the Sanity CLI
// Run with: npx sanity exec scripts/updateBaddieWithCli.js --with-user-token

// The document ID for Baddie Language
const DOC_ID = '7gNGK9M49tqCuJRrasQYRK';

// The update to apply
const update = {
  _id: DOC_ID,
  _type: 'repertoireItem',
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
};

// The update function that will be run by the Sanity CLI
module.exports = async (client) => {
  try {
    console.log('Updating Baddie Language document...');
    const result = await client
      .patch(DOC_ID)
      .set(update)
      .commit();
    
    console.log('Successfully updated Baddie Language document:', result._id);
    return result;
  } catch (error) {
    console.error('Error updating Baddie Language:', error);
    throw error;
  }
};
