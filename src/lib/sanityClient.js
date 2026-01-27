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
  useCdn: true, // Enable CDN for better performance
  // No token needed for public data access
  ignoreBrowserTokenWarning: true,
};

export const client = sanityClient(clientConfig);

const builder = imageUrlBuilder(client);

export { builder };

export default client;
