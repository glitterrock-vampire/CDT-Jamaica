// Script to add performance data to Sanity
// Run this script with: node scripts/addPerformances.js

import { client } from '../src/lib/sanityClient.js';

const performances = [
  {
    _type: 'performance',
    title: 'Jamaica Dance Umbrella',
    date: '2026-03-01',
    time: '6:00 PM',
    venue: 'Phillip Sherlock Center',
    location: 'Kingston, Jamaica',
    description: 'A celebration of Jamaican dance featuring contemporary and traditional works from across the island.',
    category: 'Main Stage',
    isUpcoming: true
  },
  {
    _type: 'performance',
    title: 'Caribbean Rhythms International',
    date: '2026-03-14',
    time: '8:00 PM',
    venue: 'Miramar Cultural Center',
    location: 'Florida, USA',
    description: 'An electrifying showcase of Caribbean dance traditions bringing the vibrant culture of Jamaica to international audiences.',
    category: 'International',
    isUpcoming: true
  },
  {
    _type: 'performance',
    title: 'Spring Season Premiere',
    date: '2026-04-17',
    time: '7:30 PM',
    venue: 'Phillip Sherlock Center',
    location: 'Kingston, Jamaica',
    description: 'Three-night celebration featuring new choreographic works and beloved repertoire pieces from all CDT companies.',
    category: 'Showcase',
    isUpcoming: true
  },
  {
    _type: 'performance',
    title: 'Spring Season Premiere - Night 2',
    date: '2026-04-18',
    time: '7:30 PM',
    venue: 'Phillip Sherlock Center',
    location: 'Kingston, Jamaica',
    description: 'Second night of our spring season showcase with different programming and special guest performances.',
    category: 'Showcase',
    isUpcoming: true
  },
  {
    _type: 'performance',
    title: 'Spring Season Premiere - Night 3',
    date: '2026-04-19',
    time: '7:30 PM',
    venue: 'Phillip Sherlock Center',
    location: 'Kingston, Jamaica',
    description: 'Final night of our spring season featuring the best of CDT\'s repertoire and world premieres.',
    category: 'Showcase',
    isUpcoming: true
  },
  {
    _type: 'performance',
    title: 'UK Dance Exchange',
    date: '2026-05-06',
    time: '7:00 PM',
    venue: 'Lester',
    location: 'Lester, UK',
    description: 'Cultural exchange performance bringing Jamaican dance heritage to UK audiences in collaboration with local dance companies.',
    category: 'International',
    isUpcoming: true
  },
  {
    _type: 'performance',
    title: 'Annual Gala Performance',
    date: '2026-06-13',
    time: '7:30 PM',
    venue: 'Courtleigh Auditorium',
    location: 'Kingston, Jamaica',
    description: 'Our annual gala celebration featuring the best works of the season and special guest artists.',
    category: 'Main Stage',
    isUpcoming: true
  }
];

async function addPerformances() {
  try {
    console.log('Adding performances to Sanity...');
    
    for (const performance of performances) {
      const result = await client.create(performance);
      console.log(`Created performance: ${result.title} (ID: ${result._id})`);
    }
    
    console.log('All performances added successfully!');
  } catch (error) {
    console.error('Error adding performances:', error);
  }
}

addPerformances();
