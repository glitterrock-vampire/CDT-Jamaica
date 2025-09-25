// Script to remove `mainImage` from all repertoireItem documents
// Run with: node scripts/removeMainImage.mjs

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
if (!process.env.SANITY_AUTH_TOKEN) dotenv.config({ path: '../.env.local' })

const client = createClient({
  projectId: 'sbvvl9vs',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN
})

async function removeMainImage() {
  console.log('Starting removal of mainImage from repertoireItem documents...')
  if (!process.env.SANITY_AUTH_TOKEN) {
    console.warn('⚠️  SANITY_AUTH_TOKEN is not set. Set it in .env.local or your shell before running this script.')
  }

  const query = `*[_type == "repertoireItem" && defined(mainImage)][]._id`

  try {
    const ids = await client.fetch(query)
    console.log(`Found ${ids.length} documents with mainImage`)
    let count = 0

    for (const id of ids) {
      try {
        await client.patch(id).unset(['mainImage']).commit()
        count++
        console.log(`✅ Unset mainImage for ${id}`)
      } catch (err) {
        console.error(`❌ Error updating ${id}:`, err.message)
      }
    }

    console.log(`\n✅ Completed. mainImage removed from ${count} documents.`)
  } catch (error) {
    console.error('❌ Error during removal:', error.message)
  } finally {
    process.exit()
  }
}

removeMainImage()
