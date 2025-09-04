import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Configuration for Sanity client
const projectId = process.env.REACT_APP_SANITY_PROJECT_ID;
const dataset = process.env.REACT_APP_SANITY_DATASET || 'production';

// Throw error if project ID is missing in production
if (!projectId) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Missing Sanity project ID. Please set REACT_APP_SANITY_PROJECT_ID');
  } else {
    console.error('Warning: Missing Sanity project ID. Set REACT_APP_SANITY_PROJECT_ID in .env');
  }
}

const clientConfig = {
  projectId,
  dataset,
  apiVersion: '2023-05-03',
  useCdn: process.env.NODE_ENV === 'production',
  // Token is only used server-side or during build
  token: process.env.NODE_ENV === 'development' ? process.env.REACT_APP_SANITY_TOKEN : undefined,
  ignoreBrowserTokenWarning: true,
  // Enable CORS by default
  withCredentials: true,
};

export const client = sanityClient(clientConfig);

const builder = imageUrlBuilder(client);

export { builder };

export default client;
