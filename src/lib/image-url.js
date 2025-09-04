import client from './sanityClient';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);

// This function will help us to get the image URL with the specified options
export function imageUrlFor(source) {
  return builder.image(source);
}

// This function will help us to get the image dimensions
export function getImageDimensions(source) {
  if (!source || !source.asset) return null;
  const dimensions = source.asset._ref.split('-');
  const width = parseInt(dimensions[2], 10);
  const height = parseInt(dimensions[3], 10);
  return { width, height };
}

// This function will help us to get the aspect ratio of the image
export function getImageAspectRatio(source) {
  const dimensions = getImageDimensions(source);
  if (!dimensions) return 0;
  return dimensions.width / dimensions.height;
}
