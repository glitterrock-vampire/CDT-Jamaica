import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Configuration for Sanity client
const projectId = process.env.REACT_APP_SANITY_PROJECT_ID || 'sbvvl9vs';
const dataset = process.env.REACT_APP_SANITY_DATASET || 'production';

if (!projectId) {
  console.error('Missing Sanity project ID. Please set REACT_APP_SANITY_PROJECT_ID in your environment variables');
}

const clientConfig = {
  projectId,
  dataset,
  apiVersion: '2023-05-03',
  useCdn: true,
  ignoreBrowserTokenWarning: true,
};

export const client = createClient(clientConfig);

const builder = imageUrlBuilder(client);

export { builder };

export default client;
