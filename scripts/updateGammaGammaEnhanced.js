// @ts-check
const { createClient } = require('@sanity/client');
const path = require('path');

// Load environment variables from both .env and .env.local
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// Configuration with fallbacks
const CONFIG = {
  PROJECT_ID: process.env.REACT_APP_SANITY_PROJECT_ID || 'sbvvl9vs',
  DATASET: process.env.REACT_APP_SANITY_DATASET || 'production',
  API_VERSION: process.env.REACT_APP_SANITY_API_VERSION || '2023-05-03',
  USE_CDN: process.env.REACT_APP_SANITY_USE_CDN === 'true' || false,
  DOCUMENT_ID: 'OPoS2nHFE7kiEoiY47hyJP', // Document ID for Gamma Gamma
  LOG_PREFIX: '[Gamma Gamma Update]',
};

// Initialize the Sanity client with fallback token
const client = createClient({
  projectId: CONFIG.PROJECT_ID,
  dataset: CONFIG.DATASET,
  // Try both possible token environment variables
  token: process.env.REACT_APP_SANITY_TOKEN || process.env.SANITY_AUTH_TOKEN,
  apiVersion: CONFIG.API_VERSION,
  useCdn: CONFIG.USE_CDN,
  timeout: 10000, // 10 seconds timeout
});

/**
 * Logs a formatted message to the console
 */
function log(message, level = 'info', data) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} ${CONFIG.LOG_PREFIX} [${level.toUpperCase()}] ${message}`;
  
  if (data) {
    console[level === 'error' ? 'error' : 'log'](logMessage, data);
  } else {
    console[level === 'error' ? 'error' : 'log'](logMessage);
  }
}

/**
 * Updates the Gamma Gamma document in Sanity
 */
async function updateGammaGamma() {
  const startTime = Date.now();
  log('Starting Gamma Gamma document update...');

  try {
    // Verify required environment variables
    const token = process.env.REACT_APP_SANITY_TOKEN || process.env.SANITY_AUTH_TOKEN;
    if (!token) {
      throw new Error('Missing required environment variable: REACT_APP_SANITY_TOKEN or SANITY_AUTH_TOKEN');
    }

    log(`Checking if document with ID ${CONFIG.DOCUMENT_ID} exists...`);
    
    // First, check if the document exists by querying for it
    const existingDoc = await client.fetch('*[_id == $id][0]', { id: CONFIG.DOCUMENT_ID });
    
    if (!existingDoc) {
      log('Document not found, creating a new one...', 'warn');
      // Create a minimal document first
      const newDoc = {
        _id: CONFIG.DOCUMENT_ID,
        _type: 'repertoireItem',
        title: 'Gamma Gamma',
        slug: { _type: 'slug', current: 'gamma-gamma' },
      };
      
      log('Creating new document...');
      await client.create(newDoc);
      log('Successfully created new document', 'success');
    } else {
      log(`Found existing document (last updated: ${existingDoc._updatedAt || 'unknown'})`);
    }
    
    // Document data for Gamma Gamma - only including fields that exist in the schema
    const updateData = {
      _type: 'repertoireItem',
      title: 'Gamma Gamma',
      slug: { _type: 'slug', current: 'gamma-gamma' },
      
      // Basic Information
      description: 'Gamma Gamma is a modern dance work rooted in afro-modern rhythms and sensibilities, weaving tradition with contemporary expression. The piece unfolds in three distinct phases, guiding the audience through a journey of identity, discovery, and playful exploration. With dynamic movement and layered musicality, Gamma Gamma celebrates the resilience and joy found in self-expression and community.',
      
      // Creative Team
      choreographer: 'Dr. Sade Bully-Bell',
      composer: 'River Bell, Antonio Sánchez, EVM128, Bill Evans',
      
      // Performance Information
      companyPremiere: 'Little Theatre (CDT 2022 Jamaica Season)',
      worldPremiere: 'Little Theatre (CDT 2022 Jamaica Season)',
      duration: '12:36',
      
      // Classification
      genre: ['afro-modern', 'contemporary'],
      stylePeriod: 'contemporary',
      category: 'jamaican',
      status: 'active',
      
      // Music Credits
      music: [
        'River Bell',
        'Antonio Sánchez',
        'EVM128',
        'Bill Evans'
      ],
      
      // Additional fields that exist in the schema
      // (Removed fields that don't exist in the schema: isFeatured, difficulty, performanceNotes, seo, technicalRequirements)
      
      // Add any other fields that exist in your schema here
      // For example, if you have a 'year' field:
      year: 2022,
      
      // If you need to add the performance notes, you might need to add a field in your Sanity schema first
      // performanceNotes: [
      //   {
      //     _type: 'block',
      //     children: [
      //       {
      //         _type: 'span',
      //         text: 'Cast information here...'
      //       }
      //     ]
      //   }
      // ]
    };

    log('Sending update to Sanity...');
    
    // Execute the update with error handling
    const result = await client
      .patch(CONFIG.DOCUMENT_ID)
      .set(updateData)
      .commit()
      .catch(error => {
        if (error.response) {
          throw new Error(`Sanity API Error: ${error.response.status} - ${JSON.stringify(error.response.body)}`);
        } else if (error.request) {
          throw new Error('No response received from Sanity API');
        } else {
          throw new Error(`Request setup error: ${error.message}`);
        }
      });
    
    const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);
    
    if (result) {
      log(`✅ Successfully updated document in ${executionTime}s`, 'success');
      log(`Document ID: ${result._id}`, 'success');
      log(`Revision ID: ${result._rev}`, 'success');
      
      // Verify the update was successful
      try {
        const updatedDoc = await client.getDocument(CONFIG.DOCUMENT_ID);
        if (!updatedDoc) {
          log('Document verification failed - document not found', 'error');
          return result;
        }
        
        log('Document verification successful', 'success');
        log('Updated document preview:', 'info', {
          title: updatedDoc.title || 'No title',
          updatedAt: updatedDoc._updatedAt || 'Unknown',
          status: updatedDoc.status || 'Unknown'
        });
      } catch (verifyError) {
        log('Warning: Could not verify document update', 'warn', verifyError);
      }
      
      return result;
    } else {
      throw new Error('No result returned from Sanity API');
    }
  } catch (error) {
    log(`❌ Update failed after ${((Date.now() - startTime) / 1000).toFixed(2)}s`, 'error');
    log(error.message, 'error');
    
    // Log additional error details if available
    if (error.response) {
      log('Error details:', 'error', {
        statusCode: error.statusCode,
        responseBody: error.response.body,
        requestId: error.response.headers['x-sanity-request-id']
      });
    }
    
    process.exit(1);
  }
}

// Execute the update
updateGammaGamma()
  .then(() => {
    log('Update process completed', 'success');
    process.exit(0);
  })
  .catch((error) => {
    log('Unhandled error in update process:', 'error', error);
    process.exit(1);
  });
