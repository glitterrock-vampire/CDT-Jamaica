// Script to import dance pieces into Sanity
const { createClient } = require('@sanity/client');

// Load environment variables from .env file
require('dotenv').config({ path: '.env.local' });

// Configure the client
const client = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID || 'sbvvl9vs',
  dataset: process.env.REACT_APP_SANITY_DATASET || 'production',
  apiVersion: process.env.REACT_APP_SANITY_API_VERSION || '2023-05-03',
  token: process.env.SANITY_AUTH_TOKEN, // Using the token from .env.local
  useCdn: process.env.REACT_APP_SANITY_USE_CDN === 'true' || false // Use CDN setting from .env
});

// Dance pieces data with their existing document IDs
const dancePieces = [
  {
    _id: 'OPoS2nHFE7kiEoiY47hyAH', // Existing document ID for CALABASH
    _type: 'repertoireItem',
    title: 'CALABASH',
    quote: 'Replanted and renewed: bursting forth resplendently the kaleidoscopic seeds of Beauty, Passion and Power.',
    choreographer: 'Tony Wilson',
    companyPremiere: '1999',
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
    worldPremiere: '1999',
    genre: ['modern', 'contemporary', 'folk'],
    mediaReviews: [
      {
        quote: 'My favourite dance, "Wilson\'s Calabash", ended the show with the prettiest costumes, which were designed by Wilson.',
        source: 'Jamaica Gleaner',
        year: 2025
      },
      {
        quote: 'It was a joyful piece, best described as a montage of dance movements depicting what appeared to be different genres of praise movements.',
        source: 'Jamaica Gleaner',
        year: 2018
      }
    ]
  },
  {
    _id: 'OPoS2nHFE7kiEoiY47hyEq', // Existing document ID for Divulgence
    _type: 'repertoireItem',
    title: 'Divulgence',
    quote: 'I close my eyes, take a deep breath, and let it out completely - John Locke',
    choreographer: 'Renée I. McDonald',
    companyPremiere: 'Little Theatre (CDT 2014 Jamaica Season)',
    music: ['Eros - Ludovico Einaudi'],
    costumes: 'Sharon Jackson',
    lighting: 'Nadia Roxburgh',
    duration: '5:23',
    worldPremiere: 'Little Theatre (CDT 2014 Jamaica Season)',
    genre: ['modern', 'contemporary'],
    mediaReviews: [
      {
        quote: 'It was more than a dance. In a declaration of self, the all-female cast, dressed in full black, hair loose, and at times moving in rapid pace, entered and exited the stage while exploring various levels, in mainly straight-line formations. After charging towards the audience in a frightening manner, they fall on to the stage dramatically, thus ending what appeared to be a psycho dance.',
        source: 'Gleaner',
        year: 2014
      },
      {
        quote: 'In 2014, McDonald delivered metaphysics of presence through dance when she choreographed "Divulgence". The remount on Saturday was just as engrossing, from the interplay between light and darkness, the black long dresses worn by the dancers to their screams towards the end.',
        source: 'Gleaner',
        year: 2017
      },
      {
        quote: 'Renowned all-female powerhouse piece',
        source: 'Gleaner',
        year: 2022
      }
    ]
  },
  {
    _id: 'OPoS2nHFE7kiEoiY47hyJP', // Existing document ID for Gamma Gamma
    _type: 'repertoireItem',
    title: 'Gamma Gamma',
    slug: {
      _type: 'slug',
      current: 'gamma-gamma'
    },
    description: 'Gamma Gamma is a modern dance work rooted in afro-modern rhythms and sensibilities, weaving tradition with contemporary expression. The piece unfolds in three distinct phases, guiding the audience through a journey of identity, discovery, and playful exploration. With dynamic movement and layered musicality, Gamma Gamma celebrates the resilience and joy found in self-expression and community.',
    year: 2022,
    duration: '12:36',
    category: 'Contemporary Works',
    stylePeriod: ['Contemporary', 'Jamaican'],
    instruments: ['Percussion', 'Strings', 'Piano'],
    premieredBy: 'Caribbean Dance Theatre',
    dedicatedTo: '',
    notableRecordings: [
      'Premiere performance at Little Theatre, 2022',
      'CDT 2022 Season'
    ],
    movements: [
      'Movement I: Awakening',
      'Movement II: Discovery',
      'Movement III: Celebration'
    ],
    // Additional fields that were in the original data
    choreographer: 'Dr. Sade Bully-Bell',
    companyPremiere: 'Little Theatre (CDT 2022 Jamaica Season)',
    music: [
      'River Bell',
      'Antonio Sánchez',
      'EVM128',
      'Bill Evans'
    ],
    costumes: 'Dr. Sade Bully-Bell',
    lighting: 'Dr. Sade Bully-Bell and Nadia Roxburgh',
    worldPremiere: 'Little Theatre (CDT 2022 Jamaica Season)',
    genre: ['modern', 'contemporary', 'afro-caribbean']
  }
];

// Function to update existing dance pieces
async function updateDancePieces() {
  try {
    const transactions = dancePieces.map(dance => ({
      patch: {
        id: dance._id,
        set: Object.fromEntries(
          Object.entries(dance)
            .filter(([key]) => key !== '_id' && key !== '_type')
        )
      }
    }));

    const result = await client.transaction(transactions).commit();
    console.log('Successfully imported dance pieces:', result);
  } catch (error) {
    console.error('Error importing dance pieces:', error);
  }
}

// Run the update
updateDancePieces();
