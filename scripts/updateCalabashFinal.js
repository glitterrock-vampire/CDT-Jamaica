// Script to update the Calabash document with the latest information
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env.local' });

// Initialize Sanity client
const client = createClient({
  projectId: 'sbvvl9vs',
  dataset: 'production',
  token: 'skpQIuqHMEixIEMGsE08jx5meNhubltET00M6F980L7wXIg6DokzFhDmKowmcGCmipu0sX1s9ZNC6894zPRt49H9Fep0dx9gNYA9umxa0Ml6Uo6s26a2EjE0Iov2AQCdDH3yqH87mMRh6XVYDaqz5XG0jbRxODI8dn8PbX6XeTEMen5amnh1',
  apiVersion: '2023-05-03',
  useCdn: false
});

async function updateCalabash() {
  try {
    // Get the Calabash document
    const docId = '7gNGK9M49tqCuJRrasQYQR';
    console.log('Updating Calabash document...');
    
    const result = await client
      .patch(docId)
      .set({
        title: 'Calabash',
        slug: { _type: 'slug', current: 'calabash' },
        description: 'Replanted and renewed: bursting forth resplendently the kaleidoscopic seeds of Beauty, Passion and Power.',
        choreographer: 'Tony Wilson',
        composer: 'Babatunde Olatunji, Diana Ross, Elton John, Grub Cooper, Tim Rice, Tongo Santamaria',
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
        costumeDesign: 'Tony Wilson',
        lightingDesign: 'Tony Wilson',
        duration: '26:48',
        genre: ['modern', 'contemporary', 'folk'],
        stylePeriod: ['contemporary'],
        category: 'jamaican',
        mediaReviews: [
          {
            _key: 'review1',
            _type: 'object',
            quote: "My favourite dance, 'Wilson's Calabash', ended the show with the prettiest costumes, which were designed by Wilson.",
            source: 'Jamaica Gleaner',
            year: 2025,
            url: 'https://jamaica-gleaner.com/calabash-review-2025'
          },
          {
            _key: 'review2',
            _type: 'object',
            quote: "It was a joyful piece, best described as a montage of dance movements depicting what appeared to be different genres of praise movements.",
            source: 'Jamaica Gleaner',
            year: 2018,
            url: 'https://jamaica-gleaner.com/calabash-review-2018'
          }
        ],
        status: 'active'
      })
      .commit();
    
    console.log('✅ Successfully updated Calabash:', result);
    console.log('View updated document:', `https://cdt-jamaica.sanity.studio/desk/repertoireItem;${docId}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    if (error.response) {
      console.error('Error response:', await error.response.body);
    }
  }
}

updateCalabash();
