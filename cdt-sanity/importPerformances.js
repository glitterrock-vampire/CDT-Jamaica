import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Sanity client
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_AUTH_TOKEN,
  apiVersion: process.env.SANITY_API_VERSION || '2023-01-01',
  useCdn: false,
});

// Performance data from Performances.js fallback
const performances = [
  {
    _type: 'performance',
    title: 'Jamaica Dance Umbrella',
    company: 'CDT Senior Company',
    date: '2026-03-01',
    time: '6:00 PM',
    venue: 'Phillip Sherlock Center',
    location: 'Kingston, Jamaica',
    description: 'A celebration of Jamaican dance featuring contemporary and traditional works from across the island.',
    category: 'Main Stage',
    isUpcoming: true,
    image: {
      url: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=600&fit=crop',
      alt: 'Jamaica Dance Umbrella Performance'
    },
    ticketUrl: null
  },
  {
    _type: 'performance',
    title: 'Caribbean Rhythms International',
    company: 'CDT Senior Company',
    date: '2026-03-14',
    time: '8:00 PM',
    venue: 'Miramar Cultural Center',
    location: 'Florida, USA',
    description: 'An electrifying showcase of Caribbean dance traditions bringing the vibrant culture of Jamaica to international audiences.',
    category: 'International',
    isUpcoming: true,
    image: {
      url: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&h=600&fit=crop',
      alt: 'Caribbean Rhythms International Performance'
    },
    ticketUrl: null
  },
  {
    _type: 'performance',
    title: 'Spring Season Premiere',
    company: 'CDT All Companies',
    date: '2026-04-17',
    time: '7:30 PM',
    venue: 'Phillip Sherlock Center',
    location: 'Kingston, Jamaica',
    description: 'Three-night celebration featuring new choreographic works and beloved repertoire pieces from all CDT companies.',
    category: 'Showcase',
    isUpcoming: true,
    image: {
      url: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&h=600&fit=crop',
      alt: 'Spring Season Premiere Performance'
    },
    ticketUrl: null
  },
  {
    _type: 'performance',
    title: 'UK Dance Exchange',
    company: 'CDT Senior Company',
    date: '2026-05-06',
    time: '7:00 PM',
    venue: 'Lester',
    location: 'Lester, UK',
    description: 'Cultural exchange performance bringing Jamaican dance heritage to UK audiences in collaboration with local dance companies.',
    category: 'International',
    isUpcoming: true,
    image: {
      url: 'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&h=600&fit=crop',
      alt: 'UK Dance Exchange Performance'
    },
    ticketUrl: null
  },
  {
    _type: 'performance',
    title: 'Annual Gala Performance',
    company: 'CDT Senior & Junior Companies',
    date: '2026-06-13',
    time: '7:30 PM',
    venue: 'Courtleigh Auditorium',
    location: 'Kingston, Jamaica',
    description: 'Our annual gala celebration featuring the best works of the season and special guest artists.',
    category: 'Main Stage',
    isUpcoming: true,
    image: {
      url: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&h=600&fit=crop',
      alt: 'Annual Gala Performance'
    },
    ticketUrl: null
  }
];

// Helper to generate a deterministic _id based on title
function generateId(title) {
  return `performance-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`;
}

async function importPerformances() {
  console.log('Starting performance import...');
  
  for (const perf of performances) {
    const docId = generateId(perf.title);
    const doc = {
      ...perf,
      _id: docId,
    };

    try {
      // Try to create or replace the document
      const result = await client.createOrReplace(doc);
      console.log(`✅ Imported: ${result.title} (ID: ${result._id})`);
    } catch (error) {
      console.error(`❌ Failed to import ${perf.title}:`, error.message);
    }
  }
  
  console.log('Import complete.');
  process.exit(0);
}

importPerformances().catch((error) => {
  console.error('Import failed:', error);
  process.exit(1);
});
