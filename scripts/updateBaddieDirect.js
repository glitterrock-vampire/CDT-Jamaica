// @ts-check
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '../.env.local' });

// Configuration
const CONFIG = {
  PROJECT_ID: 'sbvvl9vs',
  DATASET: 'production',
  API_VERSION: '2023-05-03',
  DOCUMENT_ID: '7gNGK9M49tqCuJRrasQYRK', // Baddie Language document ID
  LOG_PREFIX: '[Baddie Language Update]',
};

// Initialize the Sanity client with enhanced configuration
const client = createClient({
  projectId: CONFIG.PROJECT_ID,
  dataset: CONFIG.DATASET,
  token: process.env.SANITY_AUTH_TOKEN,
  apiVersion: CONFIG.API_VERSION,
  useCdn: false,
  // Enable API version header for better debugging
  withCredentials: true,
  // Add request timeout (5 seconds)
  timeout: 5000,
});

/**
 * Logs a formatted message to the console
 * @param {string} message - The message to log
 * @param {'info'|'error'|'success'} [level='info'] - The log level
 * @param {any} [data] - Additional data to log
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
 * Updates the Baddie Language document in Sanity
 */
async function updateBaddie() {
  const startTime = Date.now();
  log('Starting document update...');

  try {
    // Verify required environment variables
    if (!process.env.SANITY_AUTH_TOKEN) {
      throw new Error('Missing required environment variable: SANITY_AUTH_TOKEN');
    }

    log(`Updating document with ID: ${CONFIG.DOCUMENT_ID}`);
    
    // Document data with additional fields and better organization
    const updateData = {
      _type: 'repertoireItem',
      title: 'Baddie Language',
      slug: { _type: 'slug', current: 'baddie-language' },
      description: `Baddie Language is a mixture of old and current dance styles and movement derived from Jamaica’s culture, characterized by quick, flowing movements, body isolations, and expressive, often exaggerated, moves that incorporate African and Caribbean dance influences.`,
      
      // Creative Team
      choreographer: 'Steve Cornwall',
      composer: 'Various Artists',
      costumeDesign: 'Steve Cornwall and Kaye-Ann Green',
      lightingDesign: 'Kareen McLean',
      
      // Performance Information
      companyPremiere: 'Little Theatre (CDT 2023 Season)',
      worldPremiere: 'Little Theatre (CDT 2023 Season)',
      duration: '7:00',
      
      // Classification
      genre: ['dancehall', 'contemporary'],
      stylePeriod: ['contemporary'],
      category: 'jamaican',
      status: 'active',
      
      // Additional Metadata
      year: 2023,
      isFeatured: true,
      difficulty: 'intermediate',
      
      // Music Credits
      music: [
        'Buju Banton',
        'Lisa Hype',
        'Stalk Ashley',
        'SQUASH',
        'Vybz Kartel'
      ],
      
      // Performance Notes
      performanceNotes: {
        _type: 'block',
        style: 'normal',
        children: [{
          _type: 'span',
          text: 'This piece requires a minimum of 6 dancers and features high-energy movements.'
        }]
      },
      
      // SEO Metadata
      seo: {
        title: 'Baddie Language - Contemporary Dancehall Piece by Steve Cornwall',
        description: 'Experience the vibrant energy of Baddie Language, a contemporary dancehall piece that blends traditional and modern Jamaican dance styles.'
      },
      
      // Technical Requirements
      technicalRequirements: [
        'Dance floor suitable for barefoot performance',
        'Basic lighting setup with color options',
        'Sound system with clear audio quality'
      ]
    };

    log('Sending update to Sanity...');
    
    // Execute the update with error handling
    const result = await client
      .patch(CONFIG.DOCUMENT_ID)
      .set(updateData)
      .commit()
      .catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          throw new Error(`Sanity API Error: ${error.response.status} - ${JSON.stringify(error.response.body)}`);
        } else if (error.request) {
          // The request was made but no response was received
          throw new Error('No response received from Sanity API');
        } else {
          // Something happened in setting up the request that triggered an Error
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
        log('Warning: Could not verify document update', 'error', verifyError);
      }
      
      return result;
    } else {
      throw new Error('No result returned from Sanity API');
    }
  } catch (error) {
    const errorMessage = error.response 
      ? `API Error: ${error.statusCode} - ${error.message}`
      : error.message;
      
    log(`❌ Update failed after ${((Date.now() - startTime) / 1000).toFixed(2)}s`, 'error');
    log(errorMessage, 'error');
    
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
updateBaddie()
  .then(() => {
    log('Update process completed', 'success');
    process.exit(0);
  })
  .catch((error) => {
    log('Unhandled error in update process:', 'error', error);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  log('Unhandled Rejection at:', 'error', promise);
  log('Reason:', 'error', reason);
  process.exit(1);
});
