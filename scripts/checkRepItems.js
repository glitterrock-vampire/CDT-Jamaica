// @ts-check
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '../.env.local' });

const client = createClient({
  projectId: 'sbvvl9vs',
  dataset: 'production',
  token: process.env.SANITY_AUTH_TOKEN,
  apiVersion: '2023-05-03',
  useCdn: true,
});

async function checkRepItems() {
  try {
    const query = `*[_type == "repertoireItem" && title in ["Divulgence", "Gamma Gamma"]]{
      _id,
      title,
      "heroImage": heroImage.asset->url,
      "thumbnail": thumbnail.asset->url
    }`;
    
    const docs = await client.fetch(query);
    console.log('Found matching repertoire items:');
    console.log(JSON.stringify(docs, null, 2));
    
  } catch (error) {
    console.error('Error checking repertoire items:', error);
  }
}

checkRepItems();
