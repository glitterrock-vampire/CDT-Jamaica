// Script to clean up duplicate Calabash entries
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

async function cleanupCalabash() {
  try {
    // Find all Calabash documents
    const query = '*[_type == "repertoireItem" && title == "Calabash"]';
    const calabashDocs = await client.fetch(query);
    
    console.log(`Found ${calabashDocs.length} Calabash documents:`);
    calabashDocs.forEach((doc, index) => {
      console.log(`\nDocument ${index + 1}:`);
      console.log(`ID: ${doc._id}`);
      console.log(`Created: ${doc._createdAt}`);
      console.log(`Has thumbnail: ${!!doc.thumbnail}`);
      console.log(`Has hero image: ${!!doc.heroImage}`);
    });
    
    // Find the document with both thumbnail and hero image (the one we want to keep)
    const docToKeep = calabashDocs.find(doc => doc.thumbnail && doc.heroImage);
    
    if (!docToKeep) {
      console.log('\n❌ No document with both thumbnail and hero image found');
      return;
    }
    
    console.log(`\n✅ Keeping document with ID: ${docToKeep._id}`);
    
    // Delete all other Calabash documents
    const idsToDelete = calabashDocs
      .filter(doc => doc._id !== docToKeep._id)
      .map(doc => doc._id);
    
    if (idsToDelete.length === 0) {
      console.log('No duplicate documents to delete');
      return;
    }
    
    console.log(`\nDeleting ${idsToDelete.length} duplicate documents...`);
    
    // Delete documents one by one to handle errors gracefully
    for (const id of idsToDelete) {
      try {
        await client.delete(id);
        console.log(`✅ Deleted document ${id}`);
      } catch (error) {
        console.error(`❌ Error deleting document ${id}:`, error.message);
      }
    }
    
    console.log('\n✅ Cleanup complete!');
    console.log(`Kept document: https://cdt-jamaica.sanity.studio/desk/repertoireItem;${docToKeep._id}`);
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

cleanupCalabash();
