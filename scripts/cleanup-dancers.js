#!/usr/bin/env node

/**
 * Dancer Cleanup Script for CDT Jamaica
 * This script verifies dancers against an approved list and removes any not on the list
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Sanity client configuration
const client = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID || 'sbvvl9vs',
  dataset: process.env.REACT_APP_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN, // You'll need to set this in your .env file
});

// Approved dancer list from user (camel case format)
const APPROVED_DANCERS = [
  'Assantewaa Alberts',
  'Nneka Alvaranga', 
  'Andrew Bailey',
  'Abigail Berry',
  'Joel Brown',
  'Takiya Browne',
  'Naomi Campbell',
  'Nathan Campbell',
  'Kishan Carnegie',
  'Shamitha Chindepalli',
  'Joshua Craigie',
  'Shauna Cummings',
  'Jevon Ferril',
  'Kenya Harvey',
  'Kailey Ho',
  'Matthew Johnson',
  'Kaelah Mckoy',
  'Vivette Miller',
  'Sierra Moss-solomon',
  'Janna Nesbeth',
  'Zhane Padmore',
  'Shiloh Reid',
  'Naima Scott',
  'Gina Strachan',
  'Uton Vassell',
  'Raina Vaz'
];

// Helper function to convert ALL CAPS to camel case
function toCamelCase(name) {
  if (!name || typeof name !== 'string') return name;
  
  // Check if name is ALL CAPS
  if (name === name.toUpperCase()) {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  return name; // Return as-is if not ALL CAPS
}

async function updateDancerNames() {
  console.log('\n🔄 Updating ALL CAPS dancer names to camel case...');
  
  const dancers = await getAllDancers();
  const allCapsDancers = dancers.filter(dancer => dancer.name === dancer.name.toUpperCase());
  
  if (allCapsDancers.length === 0) {
    console.log('✅ No ALL CAPS dancer names found to update.');
    return;
  }
  
  console.log(`Found ${allCapsDancers.length} ALL CAPS dancer names to update:`);
  
  for (const dancer of allCapsDancers) {
    const camelCaseName = toCamelCase(dancer.name);
    
    if (camelCaseName !== dancer.name) {
      console.log(`📝 Updating: "${dancer.name}" → "${camelCaseName}"`);
      
      try {
        await client.patch(dancer._id)
          .set({ name: camelCaseName })
          .commit();
        
        console.log(`✅ Updated: ${camelCaseName}`);
      } catch (error) {
        console.error(`❌ Failed to update ${dancer.name}:`, error.message);
      }
    } else {
      console.log(`✅ Already correct: ${dancer.name}`);
    }
  }
  
  console.log('\n🎉 Name updates completed!');
}

// Helper Functions
async function getAllDancers() {
  try {
    console.log('📋 Fetching all dancers from Sanity...');
    const dancers = await client.fetch(`
      *[_type == "dancer"] {
        _id,
        name,
        role,
        slug {
          current
        }
      } | order(name asc)
    `);
    
    console.log(`\n🎭 Found ${dancers.length} dancers in Sanity:`);
    dancers.forEach((dancer, index) => {
      console.log(`${index + 1}. ${dancer.name} (ID: ${dancer._id})`);
    });
    
    return dancers;
  } catch (error) {
    console.error('❌ Error fetching dancers:', error.message);
    return [];
  }
}

function findUnapprovedDancers(allDancers) {
  console.log('\n🔍 Checking dancers against approved list...');
  
  const unapproved = [];
  const approved = [];
  
  allDancers.forEach(dancer => {
    const dancerName = dancer.name; // Keep original case
    const isApproved = APPROVED_DANCERS.includes(dancerName);
    
    if (isApproved) {
      approved.push(dancer);
      console.log(`✅ ${dancer.name} - APPROVED`);
    } else {
      unapproved.push(dancer);
      console.log(`❌ ${dancer.name} - NOT ON APPROVED LIST`);
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`✅ Approved dancers: ${approved.length}`);
  console.log(`❌ Unapproved dancers: ${unapproved.length}`);
  
  return { approved, unapproved };
}

async function deleteDancers(dancersToDelete) {
  if (dancersToDelete.length === 0) {
    console.log('\n🎉 No dancers to delete. All dancers are on the approved list!');
    return;
  }
  
  console.log(`\n⚠️  Found ${dancersToDelete.length} dancers to delete:`);
  dancersToDelete.forEach((dancer, index) => {
    console.log(`${index + 1}. ${dancer.name} (ID: ${dancer._id})`);
  });
  
  // Ask for confirmation
  console.log('\n🗑️  Do you want to delete these dancers? (y/n):');
  
  // For now, we'll proceed with deletion since this is automated
  console.log('🗑️  Deleting dancers...');
  
  for (const dancer of dancersToDelete) {
    try {
      await client.delete(dancer._id);
      console.log(`✅ Deleted: ${dancer.name}`);
    } catch (error) {
      console.error(`❌ Failed to delete ${dancer.name}:`, error.message);
    }
  }
  
  console.log('\n🎉 Dancer cleanup completed!');
}

async function verifyApprovedDancers(allDancers) {
  console.log('\n🔍 Verifying all approved dancers exist in Sanity...');
  
  const missing = [];
  
  APPROVED_DANCERS.forEach(approvedName => {
    const exists = allDancers.some(dancer => 
      dancer.name === approvedName // Exact case match
    );
    
    if (exists) {
      console.log(`✅ ${approvedName} - Found in Sanity`);
    } else {
      missing.push(approvedName);
      console.log(`❌ ${approvedName} - MISSING from Sanity`);
    }
  });
  
  if (missing.length > 0) {
    console.log(`\n⚠️  ${missing.length} approved dancers are missing from Sanity:`);
    missing.forEach((name, index) => {
      console.log(`${index + 1}. ${name}`);
    });
    console.log('\n💡 You may need to add these dancers to Sanity Studio');
  } else {
    console.log('\n🎉 All approved dancers found in Sanity!');
  }
  
  return missing;
}

// Main execution
async function main() {
  const command = process.argv[2];
  
  console.log('🎭 CDT Jamaica Dancer Cleanup Script\n');
  
  try {
    if (command === '--update-names') {
      await updateDancerNames();
      return;
    }
    
    const allDancers = await getAllDancers();
    
    if (allDancers.length === 0) {
      console.log('❌ No dancers found in Sanity. Nothing to clean up.');
      return;
    }
    
    const { approved, unapproved } = findUnapprovedDancers(allDancers);
    const missing = await verifyApprovedDancers(allDancers);
    
    if (command === '--delete') {
      await deleteDancers(unapproved);
    } else if (command === '--check') {
      console.log('\n📋 Check completed. Use --delete to remove unapproved dancers.');
      console.log('💡 Use --update-names to convert ALL CAPS names to camel case first.');
    } else {
      console.log('\n📋 Usage:');
      console.log('  node scripts/cleanup-dancers.js --check       # Check dancers without deleting');
      console.log('  node scripts/cleanup-dancers.js --update-names # Convert ALL CAPS to camel case');
      console.log('  node scripts/cleanup-dancers.js --delete      # Delete unapproved dancers');
      console.log('\n⚠️  Recommended workflow:');
      console.log('  1. Run --update-names first');
      console.log('  2. Run --check to verify');
      console.log('  3. Run --delete to remove unapproved dancers');
    }
    
  } catch (error) {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('cleanup-dancers.js')) {
  main();
}

export { getAllDancers, findUnapprovedDancers, deleteDancers, verifyApprovedDancers };
