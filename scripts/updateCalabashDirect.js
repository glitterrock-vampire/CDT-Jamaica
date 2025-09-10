// Script to update the Calabash repertoire item directly
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env.local' });

// Initialize Sanity client
const client = createClient({
  projectId: 'sbvvl9vs',
  dataset: 'production',
  token: 'skkYTWRj6IXl26TMK68l64MfTbEMXWQITXmJYPAEUMHb40nsWRZNbkYKhnpiSQtGNZBTf5BFhhSS48T3M',
  apiVersion: '2023-05-03',
  useCdn: false,
});

async function updateCalabash() {
  try {
    // Use the specific document ID from the URL
    const docId = '7gNGK9M49tqCuJRrasQYQR';
    console.log('Fetching document with ID:', docId);
    
    const existingDoc = await client.getDocument(docId).catch((error) => {
      console.error('Error fetching document:', error);
      return null;
    });

    if (existingDoc) {
      console.log('Updating existing document...');
      
      const result = await client
        .patch(docId)
        .set({
          title: 'Calabash',
          slug: { _type: 'slug', current: 'calabash' },
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
              _key: 'review1',
              _type: 'object',
              quote: "A mesmerizing journey through Jamaican cultural heritage, Calabash is a testament to the company's ability to blend tradition with contemporary dance.",
              source: 'The Jamaica Observer',
              year: 2024,
              url: 'https://www.jamaicaobserver.com/calabash-review'
            },
            {
              _key: 'review2',
              _type: 'object',
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
        })
        .commit();
      
      console.log('✅ Successfully updated Calabash:', result);
    } else {
      console.log('Document not found. Creating new document...');
      const result = await client.create({
        _type: 'repertoireItem',
        _id: 'calabash',
        title: 'Calabash',
        slug: { _type: 'slug', current: 'calabash' },
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
            _key: 'review1',
            _type: 'object',
            quote: "A mesmerizing journey through Jamaican cultural heritage, Calabash is a testament to the company's ability to blend tradition with contemporary dance.",
            source: 'The Jamaica Observer',
            year: 2024,
            url: 'https://www.jamaicaobserver.com/calabash-review'
          },
          {
            _key: 'review2',
            _type: 'object',
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
      });
      
      console.log('✅ Successfully created Calabash:', result);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    if (error.response) {
      console.error('Error response:', error.response.body);
    }
  }
}

updateCalabash();
