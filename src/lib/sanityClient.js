import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Configuration for Sanity client
const projectId = process.env.REACT_APP_SANITY_PROJECT_ID;
const dataset = process.env.REACT_APP_SANITY_DATASET || 'production';

if (!projectId) {
  console.error('Missing Sanity project ID. Please set REACT_APP_SANITY_PROJECT_ID in your environment variables');
}

const clientConfig = {
  projectId,
  dataset,
  apiVersion: '2023-05-03',
  useCdn: process.env.NODE_ENV === 'production',
  // Note: In Create React App, all environment variables are included in the client bundle
  // if they start with REACT_APP_. Be careful not to expose sensitive tokens.
  token: process.env.REACT_APP_SANITY_TOKEN,
  ignoreBrowserTokenWarning: true,
};

export const client = sanityClient(clientConfig);

const builder = imageUrlBuilder(client);

export { builder };

export default client;
