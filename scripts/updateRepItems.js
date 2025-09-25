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

const updates = [
  {
    _id: '7gNGK9M49tqCuJRrasQYOf', // Divulgence
    data: {
      title: 'Divulgence',
      slug: { _type: 'slug', current: 'divulgence' },
      description: '\"I close my eyes, take a deep breath, and let it out completely\" - John Locke',
      choreographer: 'Renée I. McDonald',
      companyPremiere: 'Little Theatre (CDT 2014 Jamaica Season)',
      music: ['Eros - Ludovico Einaudi'],
      costumeDesign: 'Sharon Jackson',
      lightingDesign: 'Nadia Roxburgh',
      duration: '5:23',
      worldPremiere: 'Little Theatre (CDT 2014 Jamaica Season)',
      genre: ['modern', 'contemporary'],
      mediaReviews: [
        {
          _type: 'object',
          quote: 'It was more than a dance. In a declaration of self, the all-female cast, dressed in full black, hair loose, and at times moving in rapid pace, entered and exited the stage while exploring various levels, in mainly straight-line formations. After charging towards the audience in a frightening manner, they fall on to the stage dramatically, thus ending what appeared to be a psycho dance.',
          source: 'Gleaner, 2014'
        },
        {
          _type: 'object',
          quote: 'In 2014, McDonald delivered metaphysics of presence through dance when she choreographed "Divulgence". The remount on Saturday was just as engrossing, from the interplay between light and darkness, the black long dresses worn by the dancers to their screams towards the end.',
          source: 'Gleaner, 2017'
        },
        {
          _type: 'object',
          quote: 'Renowned all-female powerhouse piece',
          source: 'Gleaner, 2022'
        }
      ],
      status: 'active',
      stylePeriod: ['contemporary'],
      category: 'jamaican',
    }
  },
  {
    _id: '7gNGK9M49tqCuJRrasQYSD', // Gamma Gamma
    data: {
      title: 'Gamma Gamma',
      slug: { _type: 'slug', current: 'gamma-gamma' },
      description: 'Gamma Gamma is a modern dance work rooted in afro-modern rhythms and sensibilities, weaving tradition with contemporary expression. The piece unfolds in three distinct phases, guiding the audience through a journey of identity, discovery, and playful exploration. With dynamic movement and layered musicality, Gamma Gamma celebrates the resilience and joy found in self-expression and community.',
      choreographer: 'Dr. Sade Bully-Bell',
      companyPremiere: 'Little Theatre (CDT 2022 Jamaica Season)',
      music: [
        'River Bell',
        'Antonio Sánchez',
        'EVM128',
        'Bill Evans'
      ],
      costumeDesign: 'Dr. Sade Bully-Bell',
      lightingDesign: 'Dr. Sade Bully-Bell and Nadia Roxburgh',
      duration: '12:36',
      worldPremiere: 'Little Theatre (CDT 2022 Jamaica Season)',
      genre: ['modern', 'contemporary', 'afro-modern'],
      status: 'active',
      stylePeriod: ['contemporary'],
      category: 'jamaican',
    }
  }
];

async function updateRepItems() {
  try {
    for (const { _id, data } of updates) {
      console.log(`Updating ${data.title}...`);
      
      const result = await client
        .patch(_id)
        .set(data)
        .commit();
      
      console.log(`Successfully updated ${data.title}:`, result._id);
    }
    
    console.log('All updates completed!');
  } catch (error) {
    console.error('Error updating repertoire items:', error);
  }
}

updateRepItems();
