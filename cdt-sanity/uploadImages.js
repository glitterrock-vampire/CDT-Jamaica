const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');
const { readFileSync } = require('fs');

// Initialize Sanity client
// Load environment variables
require('dotenv').config();

// Initialize Sanity client
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'sbvvl9vs',
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false, // Required for mutations
  apiVersion: process.env.SANITY_API_VERSION || '2023-05-03',
});

// Path to your images directory
const imagesDir = path.join(
  __dirname,
  '..',
  'frontend',
  'public',
  'images'
);

// Get all image files from the directory
const imageFiles = fs
  .readdirSync(imagesDir)
  .filter(
    (file) =>
      file.endsWith('.jpg') ||
      file.endsWith('.jpeg') ||
      file.endsWith('.png') ||
      file.endsWith('.gif')
  )
  .map((file) => ({
    path: path.join(imagesDir, file),
    filename: file,
    name: path.parse(file).name, // Get the name without extension
  }));

async function uploadImages() {
  try {
    if (!process.env.SANITY_AUTH_TOKEN) {
      throw new Error('SANITY_AUTH_TOKEN is not set in .env file');
    }
    
    console.log(`Found ${imageFiles.length} images to upload...`);

    for (const { path: imagePath, filename, name } of imageFiles) {
      console.log(`Uploading ${filename}...`);

      // Read the image file
      const buffer = readFileSync(imagePath);

      // Upload the image to Sanity
      const result = await client.assets.upload('image', buffer, {
        filename: filename,
        contentType: 'image/jpeg', // Adjust if you have other image types
      });

      console.log(`✅ Uploaded: ${filename} (${result._id})`);

      // Create a document for this image if needed
      // For example, if you have an 'image' type in your schema
      const imageDoc = await client.create({
        _type: 'image',
        title: name.replace(/-/g, ' '), // Convert filename to title
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: result._id,
          },
        },
      });

      console.log(`✅ Created document for: ${filename} (${imageDoc._id})`);
    }

    console.log('🎉 All images uploaded successfully!');
  } catch (error) {
    console.error('Error uploading images:', error);
  }
}

// Run the upload
uploadImages();
