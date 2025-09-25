// @ts-check
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '../.env.local' });

// Initialize the Sanity client
const client = createClient({
  projectId: 'sbvvl9vs',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true, // Use CDN for read-only operations
});

async function findBaddieId() {
  try {
    const query = `*[_type == "repertoireItem" && title == "Baddie Language"]{_id, title}`;
    const docs = await client.fetch(query);
    
    if (docs.length > 0) {
      console.log('Found Baddie Language document:');
      console.log(`ID: ${docs[0]._id}`);
      console.log(`Title: ${docs[0].title}`);
    } else {
      console.log('No Baddie Language document found.');
    }
  } catch (error) {
    console.error('Error finding Baddie Language document:', error);
  }
}

findBaddieId();
