import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = sanityClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: process.env.REACT_APP_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03', // use current UTC date - see "specifying API version"!
  useCdn: process.env.NODE_ENV === 'production', // `false` if you want to ensure fresh data
});

const builder = imageUrlBuilder(client);

export { builder };

export default client;
