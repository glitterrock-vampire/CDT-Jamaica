import { createClient } from '@sanity/client';

// Create Sanity client
const client = createClient({
  projectId: 'sbvvl9vs',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: 'skEkeCZV1xAygAcJoYvMoMkYxovWNKON6cvNSMMgPL6xX8l0KMdkNXrChzKHfKdjJyPwBsUa2rI9i7asRoxP1jWMB1HphLzaSBKre5m8PhufGHxjIoNsfHTvbQayOhUW9xtLsBWA54cCAF0xYg4YOy5mIgm3KiopuCHdPfhDrIpe7By4q4tr'
});

const boardMembers = [
  { name: 'Eva Lewis', position: 'Chair' },
  { name: 'Terry Hall', position: 'Director' },
  { name: 'Danielle Stiebel Johnson', position: 'Director' },
  { name: 'Zurie Johnson', position: 'Secretary' }
];

async function addBoardMembersToSanity() {
  console.log('Adding board members to Sanity...');
  
  try {
    for (let i = 0; i < boardMembers.length; i++) {
      const member = boardMembers[i];
      
      const boardMemberDoc = {
        _type: 'boardMember',
        name: member.name,
        position: member.position,
        bio: `${member.name} serves as ${member.position} on the Board of Directors for Company Dance Theatre.`,
        featured: true,
        order: i + 1,
        headshot: null, // Will be added later
      };
      
      try {
        const result = await client.create(boardMemberDoc);
        console.log(`✅ Added: ${member.name} - ${member.position} (ID: ${result._id})`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⚠️  Already exists: ${member.name}`);
        } else {
          console.error(`❌ Error adding ${member.name}:`, error.message);
        }
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n🎉 Board member migration completed!');
    console.log(`Added ${boardMembers.length} board members to Sanity`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run the migration
addBoardMembersToSanity();
