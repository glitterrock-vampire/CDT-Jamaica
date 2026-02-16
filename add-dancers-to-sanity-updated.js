import { createClient } from '@sanity/client';

// Create Sanity client for the script
const client = createClient({
  projectId: 'sbvvl9vs',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: 'skEkeCZV1xAygAcJoYvMoMkYxovWNKON6cvNSMMgPL6xX8l0KMdkNXrChzKHfKdjJyPwBsUa2rI9i7asRoxP1jWMB1HphLzaSBKre5m8PhufGHxjIoNsfHTvbQayOhUW9xtLsBWA54cCAF0xYg4YOy5mIgm3KiopuCHdPfhDrIpe7By4q4tr'
});

async function getDancersFromSanity() {
  console.log('Fetching dancers from Sanity...');
  
  try {
    const dancers = await client.fetch(
      '*[_type == "dancer"] | order(order asc)'
    );
    
    console.log(`✅ Fetched ${dancers.length} dancers from Sanity`);
    return dancers;
  } catch (error) {
    console.error('❌ Error fetching dancers from Sanity:', error.message);
    return [];
  }
}

async function addDancersToSanity() {
  console.log('Adding dancers to Sanity...');
  
  try {
    const dancers = await getDancersFromSanity();
    
    for (let i = 0; i < dancers.length; i++) {
      const dancer = dancers[i];
      const fullName = `${dancer.firstName} ${dancer.lastName}`;
      
      const dancerDoc = {
        _type: 'dancer',
        name: fullName,
        role: 'Company Dancer',
        bio: `Company Dance Theatre member ${dancer.firstName} ${dancer.lastName}.`,
        yearsActive: '2024-Present',
        featured: i < 6, // First 6 dancers are featured
        order: i + 1,
        headshot: null, // Will be added later
      };
      
      try {
        const result = await client.create(dancerDoc);
        console.log(`✅ Added: ${fullName} (ID: ${result._id})`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⚠️  Already exists: ${fullName}`);
        } else {
          console.error(`❌ Error adding ${fullName}:`, error.message);
        }
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n🎉 Dancer migration completed!');
    console.log(`Added ${dancers.length} dancers to Sanity`);
  } catch (error) {
    console.error('❌ Error in addDancersToSanity:', error.message);
  }
}

// Run the function
addDancersToSanity();
