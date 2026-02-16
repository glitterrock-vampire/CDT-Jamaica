import { createClient } from '@sanity/client';

// Create Sanity client for the script
const client = createClient({
  projectId: 'sbvvl9vs',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: 'skEkeCZV1xAygAcJoYvMoMkYxovWNKON6cvNSMMgPL6xX8l0KMdkNXrChzKHfKdjJyPwBsUa2rI9i7asRoxP1jWMB1HphLzaSBKre5m8PhufGHxjIoNsfHTvbQayOhUW9xtLsBWA54cCAF0xYg4YOy5mIgm3KiopuCHdPfhDrIpe7By4q4tr'
});

const dancers = [
  { firstName: 'ABIGAIL', lastName: 'BERRY' },
  { firstName: 'ANDREW', lastName: 'BAILEY' },
  { firstName: 'ASSANTEWAA', lastName: 'ALBERTS' },
  { firstName: 'GINA', lastName: 'STRACHAN' },
  { firstName: 'JANNA', lastName: 'NESBETH' },
  { firstName: 'JEVON', lastName: 'FERRIL' },
  { firstName: 'JOSHUA', lastName: 'CRAIGIE' },
  { firstName: 'KAELAH', lastName: 'MCKOY' },
  { firstName: 'KAILEY', lastName: 'HO' },
  { firstName: 'KENYA', lastName: 'HARVEY' },
  { firstName: 'KISHAN', lastName: 'CARNEGIE' },
  { firstName: 'MATTHEW', lastName: 'JOHNSON' },
  { firstName: 'NAIMA', lastName: 'SCOTT' },
  { firstName: 'NAOMI', lastName: 'CAMPBELL' },
  { firstName: 'NATHAN', lastName: 'CAMPBELL' },
  { firstName: 'RAINA', lastName: 'VAZ' },
  { firstName: 'SHAUNA', lastName: 'CUMMINGS' },
  { firstName: 'SHAMITHA', lastName: 'CHINDEPALLI' },
  { firstName: 'SHILOH', lastName: 'REID' },
  { firstName: 'SIERRA', lastName: 'MOSS-SOLOMON' },
  { firstName: 'TAKIYA', lastName: 'BROWNE' },
  { firstName: 'UTON', lastName: 'VASSELL' },
  { firstName: 'VIVETTE', lastName: 'MILLER' },
  { firstName: 'ZHANE', lastName: 'PADMORE' }
];

async function addDancersToSanity() {
  console.log('Adding dancers to Sanity...');
  
  try {
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
    console.log('First 6 dancers are marked as featured for the home page');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run the migration
addDancersToSanity();
