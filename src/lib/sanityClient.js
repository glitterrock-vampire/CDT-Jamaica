import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Only access environment variables during build time or server-side
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.REACT_APP_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.REACT_APP_SANITY_DATASET || 'production';

if (!projectId) {
  console.error('Missing Sanity project ID. Please set NEXT_PUBLIC_SANITY_PROJECT_ID or REACT_APP_SANITY_PROJECT_ID');
}

const clientConfig = {
  projectId,
  dataset,
  apiVersion: '2023-05-03',
  useCdn: process.env.NODE_ENV === 'production',
  // Only include token if we're on the server side
  ...(typeof window === 'undefined' && process.env.SANITY_API_TOKEN ? { 
    token: process.env.SANITY_API_TOKEN 
  } : {}),
  ignoreBrowserTokenWarning: true,
};

export const client = sanityClient(clientConfig);

const builder = imageUrlBuilder(client);

export { builder };

export default client;
