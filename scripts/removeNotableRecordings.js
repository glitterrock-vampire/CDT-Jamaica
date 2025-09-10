// Script to remove notable recordings from the Calabash document
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

async function removeNotableRecordings() {
  try {
    const docId = '7gNGK9M49tqCuJRrasQYQR';
    console.log('Removing notable recordings from Calabash document...');
    
    const result = await client
      .patch(docId)
      .unset(['notableRecordings']) // This will remove the field entirely
      .commit();
    
    console.log('✅ Successfully removed notable recordings:', result);
    console.log('View updated document:', `https://cdt-jamaica.sanity.studio/desk/repertoireItem;${docId}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    if (error.response) {
      console.error('Error response:', await error.response.body);
    }
  }
}

removeNotableRecordings();
