// Migration script to convert performanceNotes from block to array of blocks
// Run with: SANITY_AUTH_TOKEN=your-token node scripts/migrations/fixPerformanceNotes.js

import sanityClient from '@sanity/client'

const client = sanityClient({
  projectId: 'sbvvl9vs',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN,
  apiVersion: '2023-05-03' // Use a recent API version
})

async function migratePerformanceNotes() {
  console.log('Starting migration for performanceNotes...')
  
  // Fetch all documents with performanceNotes
  const query = `*[_type == 'repertoireItem' && defined(performanceNotes)] {
    _id,
    _rev,
    performanceNotes
  }`
  
  const documents = await client.fetch(query)
  console.log(`Found ${documents.length} documents with performanceNotes`)
  
  let updatedCount = 0
  
  for (const doc of documents) {
    const {_id, _rev, performanceNotes} = doc
    
    // Skip if already an array
    if (Array.isArray(performanceNotes)) continue
    
    // Skip if not a block
    if (!performanceNotes || performanceNotes._type !== 'block') {
      console.log(`Skipping document ${_id} - performanceNotes is not a block`)
      continue
    }
    
    // Update the document with the fixed performanceNotes
    try {
      await client
        .patch(_id)
        .set({performanceNotes: [performanceNotes]})
        .commit()
      
      updatedCount++
      console.log(`Updated document ${_id}`)
    } catch (error) {
      console.error(`Error updating document ${_id}:`, error.message)
    }
  }
  
  console.log(`\nMigration complete!`)
  console.log(`- Total documents processed: ${documents.length}`)
  console.log(`- Documents updated: ${updatedCount}`)
}

migratePerformanceNotes().catch(error => {
  console.error('Migration failed:', error)
  process.exit(1)
})
