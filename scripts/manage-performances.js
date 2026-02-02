#!/usr/bin/env node

/**
 * Performance Management Script for CDT Jamaica
 * This script helps manage performances in Sanity CMS
 * 
 * Usage:
 * node scripts/manage-performances.js add-miramar
 * node scripts/manage-performances.js delete <performance-id>
 * node scripts/manage-performances.js list
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

// Miramar Performance Data
const miramarPerformance = {
  _type: 'performance',
  title: 'Miramar Cultural Center Performance',
  company: 'CDT All Companies',
  date: '2026-03-14T19:00:00.000Z', // March 14, 2026 at 7 PM
  time: '7:00 PM',
  venue: 'MIRAMAR CULTURAL CENTER',
  location: 'Kingston, Jamaica',
  description: 'CDT Jamaica presents an extraordinary evening of contemporary Caribbean dance at the prestigious Miramar Cultural Center. Featuring all companies in a showcase of new works and beloved repertoire.',
  category: 'mainstage',
  isUpcoming: true,
  isFeatured: true,
  ticketUrl: '', // Add ticket URL when available
  slug: {
    current: 'miramar-cultural-center-performance',
    _type: 'slug'
  }
};

// Helper Functions
async function listPerformances() {
  try {
    console.log('📋 Fetching current performances...');
    const performances = await client.fetch(`
      *[_type == "performance"] | order(date asc) {
        _id,
        title,
        date,
        venue,
        isUpcoming,
        isFeatured,
        slug {
          current
        }
      }
    `);
    
    console.log('\n🎭 Current Performances:');
    performances.forEach((perf, index) => {
      console.log(`${index + 1}. ${perf.title}`);
      console.log(`   ID: ${perf._id}`);
      console.log(`   Date: ${new Date(perf.date).toLocaleDateString()}`);
      console.log(`   Venue: ${perf.venue}`);
      console.log(`   Slug: ${perf.slug?.current || 'No slug'}`);
      console.log(`   Upcoming: ${perf.isUpcoming ? 'Yes' : 'No'}`);
      console.log(`   Featured: ${perf.isFeatured ? 'Yes' : 'No'}`);
      console.log('');
    });
    
    return performances;
  } catch (error) {
    console.error('❌ Error fetching performances:', error.message);
    return [];
  }
}

async function addMiramarPerformance() {
  try {
    console.log('🎭 Adding Miramar Cultural Center Performance...');
    
    // Check if performance already exists
    const existing = await client.fetch(`
      *[_type == "performance" && slug.current == "miramar-cultural-center-performance"][0]
    `);
    
    if (existing) {
      console.log('⚠️  Performance with this slug already exists!');
      console.log(`   Title: ${existing.title}`);
      console.log(`   ID: ${existing._id}`);
      
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise(resolve => {
        rl.question('Do you want to delete it and recreate? (y/n): ', resolve);
      });
      rl.close();
      
      if (answer.toLowerCase() === 'y') {
        await client.delete(existing._id);
        console.log('🗑️  Deleted existing performance');
      } else {
        console.log('❌ Operation cancelled');
        return;
      }
    }
    
    // Create the performance
    const result = await client.create(miramarPerformance);
    
    console.log('✅ Successfully added Miramar Performance!');
    console.log(`   ID: ${result._id}`);
    console.log(`   Title: ${result.title}`);
    console.log(`   Slug: ${result.slug.current}`);
    console.log(`   Date: ${new Date(result.date).toLocaleDateString()}`);
    
    return result;
  } catch (error) {
    console.error('❌ Error adding performance:', error.message);
    throw error;
  }
}

async function deletePerformance(performanceId) {
  try {
    console.log(`🗑️  Deleting performance: ${performanceId}`);
    
    // First get the performance details
    const performance = await client.fetch(`
      *[_type == "performance" && _id == $id][0]{
        _id,
        title,
        slug {
          current
        }
      }
    `, { id: performanceId });
    
    if (!performance) {
      console.log('❌ Performance not found');
      return;
    }
    
    console.log(`   Found: ${performance.title}`);
    console.log(`   Slug: ${performance.slug?.current || 'No slug'}`);
    
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise(resolve => {
      rl.question('Are you sure you want to delete this performance? (y/n): ', resolve);
    });
    rl.close();
    
    if (answer.toLowerCase() === 'y') {
      await client.delete(performanceId);
      console.log('✅ Performance deleted successfully');
    } else {
      console.log('❌ Deletion cancelled');
    }
  } catch (error) {
    console.error('❌ Error deleting performance:', error.message);
    throw error;
  }
}

// Main execution
async function main() {
  const command = process.argv[2];
  const argument = process.argv[3];
  
  console.log('🎭 CDT Jamaica Performance Management Script\n');
  
  try {
    switch (command) {
      case 'list':
        await listPerformances();
        break;
        
      case 'add-miramar':
        await addMiramarPerformance();
        break;
        
      case 'delete':
        if (!argument) {
          console.log('❌ Please provide a performance ID');
          console.log('Usage: node scripts/manage-performances.js delete <performance-id>');
          process.exit(1);
        }
        await deletePerformance(argument);
        break;
        
      default:
        console.log('Usage:');
        console.log('  node scripts/manage-performances.js list              - List all performances');
        console.log('  node scripts/manage-performances.js add-miramar       - Add Miramar performance');
        console.log('  node scripts/manage-performances.js delete <id>       - Delete performance by ID');
        console.log('');
        console.log('📝 Note: Make sure to set SANITY_WRITE_TOKEN in your .env file');
        break;
    }
  } catch (error) {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { listPerformances, addMiramarPerformance, deletePerformance };
