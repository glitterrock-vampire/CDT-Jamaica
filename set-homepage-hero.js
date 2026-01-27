import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Sanity client
const client = createClient({
  projectId: 'sbvvl9vs',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: 'skEkeCZV1xAygAcJoYvMoMkYxovWNKON6cvNSMMgPL6xX8l0KMdkNXrChzKHfKdjJyPwBsUa2rI9i7asRoxP1jWMB1HphLzaSBKre5m8PhufGHxjIoNsfHTvbQayOhUW9xtLsBWA54cCAF0xYg4YOy5mIgm3KiopuCHdPfhDrIpe7By4q4tr'
});

async function setHomePageHeroImage() {
  try {
    console.log('Setting CDT Streams Photo as home page hero image...');
    
    // Read the image file
    const imagePath = path.resolve(__dirname, 'public/images/CDT Streams Photo.jpg');
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Upload image to Sanity
    const uploadedImage = await client.assets.upload('image', imageBuffer, {
      filename: 'CDT Streams Photo.jpg',
      originalFilename: 'CDT Streams Photo.jpg',
      mimeType: 'image/jpeg',
    });
    
    console.log('✅ Image uploaded successfully:', uploadedImage._id);
    
    // Get current site settings
    const existingSettings = await client.fetch(`*[_type == "siteSettings"][0]`);
    
    if (existingSettings) {
      // Update heroImage with CDT Streams Photo
      await client
        .patch(existingSettings._id)
        .set({
          heroImage: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: uploadedImage._id
            },
            alt: 'CDT Streams Performance - Company Dance Theatre Jamaica'
          }
        })
        .commit();
      
      console.log('✅ Updated heroImage with CDT Streams Photo');
    } else {
      // Create new site settings document
      await client.create({
        _type: 'siteSettings',
        title: 'CDT Jamaica',
        heroImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: uploadedImage._id
          },
          alt: 'CDT Streams Performance - Company Dance Theatre Jamaica'
        },
        description: 'Premier Jamaican cultural dance theatre company showcasing traditional and contemporary performances, workshops, and cultural celebrations.'
      });
      
      console.log('✅ Created new site settings with CDT Streams Photo');
    }
    
    console.log('🎉 CDT Streams Photo is now the hero image!');
    console.log('Home page will use this image.');
    
  } catch (error) {
    console.error('❌ Error setting home page hero image:', error);
  }
}

setHomePageHeroImage();
