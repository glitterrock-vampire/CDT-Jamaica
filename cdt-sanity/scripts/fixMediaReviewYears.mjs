// Script to convert mediaReviews[].year numbers to strings across all repertoire items
// Run with: node scripts/fixMediaReviewYears.mjs

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Try loading env from current directory, then from parent
dotenv.config({ path: '.env.local' })
if (!process.env.SANITY_AUTH_TOKEN) {
  dotenv.config({ path: '../.env.local' })
}

const client = createClient({
  projectId: 'sbvvl9vs',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN
})

async function fixMediaReviewYears() {
  console.log('Starting migration: convert mediaReviews[].year numbers to strings...')

  if (!process.env.SANITY_AUTH_TOKEN) {
    console.warn('⚠️  SANITY_AUTH_TOKEN is not set. Set it in .env.local or your shell before running this script.')
  }

  const query = `*[_type == "repertoireItem" && defined(mediaReviews)]{ _id, mediaReviews }`

  try {
    const docs = await client.fetch(query)
    console.log(`Found ${docs.length} repertoire items with mediaReviews`)

    let updatedCount = 0

    for (const doc of docs) {
      const { _id, mediaReviews } = doc
      if (!Array.isArray(mediaReviews) || mediaReviews.length === 0) continue

      let needsUpdate = false
      const updatedReviews = mediaReviews.map((rev) => {
        if (!rev) return rev
        // Only change if year exists and is a number
        if (typeof rev.year === 'number') {
          needsUpdate = true
          return { ...rev, year: String(rev.year) }
        }
        return rev
      })

      if (!needsUpdate) {
        console.log(`Skipping ${_id} - no numeric years found`)
        continue
      }

      try {
        await client
          .patch(_id)
          .set({ mediaReviews: updatedReviews })
          .commit()
        updatedCount++
        console.log(`✅ Updated ${_id}`)
      } catch (err) {
        console.error(`❌ Error updating ${_id}:`, err.message)
      }
    }

    console.log(`\n✅ Migration completed. Documents updated: ${updatedCount}`)
  } catch (error) {
    console.error('❌ Migration error:', error.message)
  } finally {
    process.exit()
  }
}

fixMediaReviewYears()
