// Script to create a new Calabash repertoire item
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
  useCdn: false,
  withCredentials: true
});

async function createCalabashDocument() {
  try {
    console.log('Creating new Calabash document...');
    
    const document = {
      _type: 'repertoireItem',
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
      status: 'active',
      // Keep the existing image references if they exist
      thumbnail: {
        _type: 'image',
        asset: {
          _ref: 'image-869b99c8675e5ae4ba81262a13f2a4f0205d8ce9-4928x3264-jpg',
          _type: 'reference'
        }
      },
      heroImage: {
        _type: 'image',
        asset: {
          _ref: 'image-6d93329fa7bdcbd6ff44179210f45d4c502464e0-1350x900-jpg',
          _type: 'reference'
        }
      }
    };

    const result = await client.create(document);
    console.log('✅ Successfully created new Calabash document:', result);
    console.log('You can view it at:', `https://cdt-jamaica.sanity.studio/desk/repertoireItem;${result._id}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    if (error.response) {
      console.error('Error response:', await error.response.body);
    }
  }
}

createCalabashDocument();
