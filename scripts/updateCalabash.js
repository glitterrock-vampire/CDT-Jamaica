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

async function updateCalabash() {
  try {
    // Check if document exists
    const existingDocs = await client.fetch('*[_type == "repertoireItem" && title == "Calabash"]');
    
    const doc = {
      _type: 'repertoireItem',
      title: 'Calabash',
      slug: {
        _type: 'slug',
        current: 'calabash',
      },
      description: 'Replanted and renewed: bursting forth resplendently the kaleidoscopic seeds of Beauty, Passion and Power.',
      choreographer: 'Tony Wilson',
      companyPremiere: '1999',
      worldPremiere: '1999',
      music: [
        'Babatunde Olatunji',
        'Diana Ross',
        'Elton John',
        'Grub Cooper',
        'Tim Rice',
        'Tongo Santamaria'
      ],
      costumes: 'Tony Wilson',
      lighting: 'Tony Wilson',
      duration: '26:48',
      genre: ['modern', 'contemporary', 'folk'],
      mediaReviews: [
        {
          _type: 'object',
          quote: 'My favourite dance, "Wilson\'s Calabash", ended the show with the prettiest costumes, which were designed by Wilson.',
          source: 'Jamaica Gleaner, 2025'
        },
        {
          _type: 'object',
          quote: 'It was a joyful piece, best described as a montage of dance movements depicting what appeared to be different genres of praise movements.',
          source: 'Jamaica Gleaner, 2018'
        }
      ]
    };

    if (existingDocs && existingDocs.length > 0) {
      // Update existing document
      const docId = existingDocs[0]._id;
      console.log('Updating existing document:', docId);
      await client
        .patch(docId)
        .set(doc)
        .commit();
      console.log('Successfully updated Calabash');
    } else {
      // Create new document
      console.log('Creating new document for Calabash');
      await client.create(doc);
      console.log('Successfully created Calabash');
    }
  } catch (error) {
    console.error('Error updating Calabash:', error);
  }
}

updateCalabash();
