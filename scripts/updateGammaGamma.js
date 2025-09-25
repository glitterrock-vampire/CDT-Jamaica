// @ts-check
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '../.env.local' });

// Initialize the Sanity client with a management token
const client = createClient({
  projectId: 'sbvvl9vs',
  dataset: 'production',
  token: process.env.SANITY_AUTH_TOKEN,
  apiVersion: '2023-05-03',
  useCdn: false,
});

async function findGammaGamma() {
  try {
    const query = `*[_type == "repertoireItem" && title == "Gamma Gamma"][0] { _id }`;
    const doc = await client.fetch(query);
    return doc?._id;
  } catch (error) {
    console.error('Error finding Gamma Gamma document:', error);
    return null;
  }
}

async function updateGammaGamma() {
  try {
    console.log('Searching for Gamma Gamma document...');
    const docId = await findGammaGamma();
    
    if (!docId) {
      console.log('Gamma Gamma document not found. Creating a new one...');
      // If not found, we'll create a new document
      const newDoc = {
        _type: 'repertoireItem',
        title: 'Gamma Gamma',
        slug: { _type: 'slug', current: 'gamma-gamma' },
        description: 'Gamma Gamma is a modern dance work rooted in afro-modern rhythms and sensibilities, weaving tradition with contemporary expression. The piece unfolds in three distinct phases, guiding the audience through a journey of identity, discovery, and playful exploration. With dynamic movement and layered musicality, Gamma Gamma celebrates the resilience and joy found in self-expression and community.',
        choreographer: 'Dr. Sade Bully-Bell',
        composer: 'Dr. Sade Bully-Bell and Nadia Roxburgh',
        companyPremiere: 'Little Theatre (CDT 2022 Jamaica Season)',
        worldPremiere: 'Little Theatre (CDT 2022 Jamaica Season)',
        music: [
          'River Bell - Antonio Sánchez',
          'EVM128 - Bill Evans'
        ],
        costumeDesign: 'Dr. Sade Bully-Bell',
        lightingDesign: 'Dr. Sade Bully-Bell and Nadia Roxburgh',
        genre: ['modern', 'contemporary', 'afro-modern'],
        stylePeriod: 'contemporary',
        category: 'Contemporary Works',
        status: 'active',
        year: 2022,
      };
      
      const result = await client.create(newDoc);
      console.log('Successfully created Gamma Gamma document:', result._id);
      return;
    }
    
    console.log('Found Gamma Gamma document. Updating...');
    
    const result = await client
      .patch(docId)
      .set({
        title: 'Gamma Gamma',
        slug: { _type: 'slug', current: 'gamma-gamma' },
        description: 'Gamma Gamma is a modern dance work rooted in afro-modern rhythms and sensibilities, weaving tradition with contemporary expression. The piece unfolds in three distinct phases, guiding the audience through a journey of identity, discovery, and playful exploration. With dynamic movement and layered musicality, Gamma Gamma celebrates the resilience and joy found in self-expression and community.',
        choreographer: 'Dr. Sade Bully-Bell',
        composer: 'Dr. Sade Bully-Bell and Nadia Roxburgh',
        companyPremiere: 'Little Theatre (CDT 2022 Jamaica Season)',
        worldPremiere: 'Little Theatre (CDT 2022 Jamaica Season)',
        music: [
          'River Bell - Antonio Sánchez',
          'EVM128 - Bill Evans'
        ],
        costumeDesign: 'Dr. Sade Bully-Bell',
        lightingDesign: 'Dr. Sade Bully-Bell and Nadia Roxburgh',
        genre: ['modern', 'contemporary', 'afro-modern'],
        stylePeriod: 'contemporary',
        category: 'Contemporary Works',
        status: 'active',
        year: 2022,
      })
      .commit();
    
    console.log('Successfully updated Gamma Gamma document:', result._id);
  } catch (error) {
    console.error('Error updating Gamma Gamma:', error);
  }
}

updateGammaGamma();
