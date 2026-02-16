// Script to add management team data to Sanity
// Run this script with: node scripts/addManagement.js

import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create client with write token for scripts
const writeClient = createClient({
  projectId: 'sbvvl9vs',
  dataset: 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: true
});

const managementTeam = [
  {
    _type: 'management',
    name: 'Tony Wilson',
    title: 'OD, Founder of The Company Dance Theatre',
    order: 1
  },
  {
    _type: 'management',
    name: 'Dr. Sade Bully-Bell',
    title: 'Artistic Director',
    order: 2
  },
  {
    _type: 'management',
    name: 'Renee I. McDonald',
    title: 'Associate Artistic Director',
    order: 3
  },
  {
    _type: 'management',
    name: 'Steven Cornwall',
    title: 'Artistic Director, The CDT School',
    order: 4
  },
  {
    _type: 'management',
    name: 'Colin Blackwood',
    title: 'Executive Director',
    order: 5
  },
  {
    _type: 'management',
    name: 'JAMAICA DANCE UMBRELLA',
    title: '',
    order: 6
  }
];

async function addManagementTeam() {
  console.log('Adding management team members to Sanity...');
  console.log('Using token:', process.env.SANITY_WRITE_TOKEN ? 'Token found' : 'No token found');
  
  try {
    for (const member of managementTeam) {
      console.log(`Adding: ${member.name}`);
      
      // Check if management member already exists
      const existingMember = await writeClient.fetch(
        `*[_type == "management" && name == $name][0]`,
        { name: member.name }
      );
      
      if (existingMember) {
        console.log(`Management member ${member.name} already exists. Skipping...`);
        continue;
      }
      
      // Create new management member
      const result = await writeClient.create(member);
      console.log(`Created: ${result.name} (ID: ${result._id})`);
    }
    
    console.log('Management team data successfully added to Sanity!');
  } catch (error) {
    console.error('Error adding management team:', error);
  }
}

// Run the script
addManagementTeam();
