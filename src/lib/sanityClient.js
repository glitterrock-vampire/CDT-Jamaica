import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = sanityClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID || 'your-sanity-project-id', // Fallback for local dev
  dataset: process.env.REACT_APP_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.REACT_APP_SANITY_TOKEN, // Only if you need write access
  ignoreBrowserTokenWarning: true,
  withCredentials: true
});

const builder = imageUrlBuilder(client);

export { builder };

export default client;
