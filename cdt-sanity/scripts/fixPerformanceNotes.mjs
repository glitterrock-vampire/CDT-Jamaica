// Simple script to fix performanceNotes field
// Run with: node scripts/fixPerformanceNotes.mjs

import { createClient } from '@sanity/client'
import { v4 as uuidv4 } from 'uuid'

const client = createClient({
  projectId: 'sbvvl9vs',
  dataset: 'production',
  useCdn: false,
  token: 'skpQIuqHMEixIEMGsE08jx5meNhubltET00M6F980L7wXIg6DokzFhDmKowmcGCmipu0sX1s9ZNC6894zPRt49H9Fep0dx9gNYA9umxa0Ml6Uo6s26a2EjE0Iov2AQCdDH3yqH87mMRh6XVYDaqz5XG0jbRxODI8dn8PbX6XeTEMen5amnh1',
  apiVersion: '2023-05-03'
})

function ensureArrayWithKeys(notes) {
  // If it's already an array, ensure each item has a key
  if (Array.isArray(notes)) {
    return notes.map(note => ({
      ...note,
      _key: note._key || `key_${uuidv4().replace(/-/g, '')}`
    }))
  }
  
  // If it's a single block, wrap it in an array and add a key
  if (notes && typeof notes === 'object' && notes._type === 'block') {
    return [{
      ...notes,
      _key: `key_${uuidv4().replace(/-/g, '')}`
    }]
  }
  
  // If it's something else, return an empty array
  return []
}

async function fixPerformanceNotes() {
  console.log('Starting to fix performanceNotes...')
  
  // Find all documents with performanceNotes
  const query = `*[_type == 'repertoireItem' && defined(performanceNotes)][0...100] {
    _id,
    _rev,
    performanceNotes
  }`
  
  try {
    const docs = await client.fetch(query)
    console.log(`Found ${docs.length} documents with performanceNotes`)
    
    for (const doc of docs) {
      const {_id, _rev, performanceNotes} = doc
      
      // Process the performanceNotes to ensure it's an array with keys
      const updatedNotes = ensureArrayWithKeys(performanceNotes)
      
      // Check if we need to update the document
      if (JSON.stringify(performanceNotes) === JSON.stringify(updatedNotes)) {
        console.log(`Skipping ${_id} - no changes needed`)
        continue
      }
      
      // Update the document
      try {
        await client
          .patch(_id)
          .set({performanceNotes: updatedNotes})
          .commit()
        
        console.log(`✅ Updated ${_id}`)
      } catch (error) {
        console.error(`❌ Error updating ${_id}:`, error.message)
      }
    }
    
    console.log('\n✅ Fix completed!')
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    process.exit()
  }
}

fixPerformanceNotes()