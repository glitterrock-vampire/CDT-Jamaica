const { createClient } = require('@sanity/client')
require('dotenv').config({ path: '.env.local' })

// Initialize Sanity client
const client = createClient({
  projectId: 'sbvvl9vs',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN,
  apiVersion: '2023-05-03',
})

// Updated data for Melanin Migration
const melaninMigrationUpdate = {
  title: 'Melanin Migration the Journey (2023)',
  choreographer: 'David Blake',
  composer: 'Dwight Trible',
  year: 2023,
}

async function updateMelaninMigration() {
  try {
    console.log('🔍 Searching for Melanin Migration entry...')

    // Find the existing Melanin Migration entry
    const existing = await client.fetch('*[_type == "repertoireItem" && (title match "Melanin Migration*" || title match "Melanin Migration the Journey*")][0]')

    if (!existing) {
      console.log('❌ Melanin Migration entry not found')
      console.log('💡 You may need to create it manually in Sanity Studio first')
      console.log('📋 Required data:')
      console.log('- Title: Melanin Migration the Journey (2023)')
      console.log('- Choreographer: David Blake')
      console.log('- Composer: Dwight Trible')
      console.log('- Year: 2023')
      console.log('- Dancers: Andrew Bailey, Joel Brown, Joshua Craigie')
      return
    }

    console.log('✅ Found existing entry:', existing.title)
    console.log('🔄 Updating with new information...')

    // Update the document while preserving existing data
    const updated = await client
      .patch(existing._id)
      .set(melaninMigrationUpdate)
      .commit()

    console.log('✅ Successfully updated Melanin Migration!')
    console.log('📋 Updated information:')
    console.log('- Title:', updated.title)
    console.log('- Choreographer:', updated.choreographer)
    console.log('- Composer:', updated.composer)
    console.log('- Year:', updated.year)

    // Show what other data was preserved
    console.log('📋 Preserved existing data:')
    console.log('- Description:', updated.description ? '✅' : '❌')
    console.log('- Images:', updated.heroImage || updated.thumbnail ? '✅' : '❌')
    console.log('- Duration:', updated.duration ? '✅' : '❌')
    console.log('- Status:', updated.status ? '✅' : '❌')

  } catch (error) {
    console.error('❌ Error updating Melanin Migration:', error.message)

    if (error.message.includes('Insufficient permissions')) {
      console.log('💡 Permission issue: Make sure your SANITY_AUTH_TOKEN has Editor permissions')
      console.log('   Go to https://sanity.io/manage → Your Project → API → Tokens')
    }
  }
}

// Alternative: Create new entry if it doesn't exist
async function createMelaninMigration() {
  try {
    console.log('🔍 Checking if Melanin Migration exists...')

    const existing = await client.fetch('*[_type == "repertoireItem" && title match "Melanin Migration*"][0]')

    if (existing) {
      console.log('✅ Entry already exists, updating instead...')
      return updateMelaninMigration()
    }

    console.log('🆕 Creating new Melanin Migration entry...')

    const newEntry = {
      _type: 'repertoireItem',
      title: 'Melanin Migration the Journey (2023)',
      slug: {
        _type: 'slug',
        current: 'melanin-migration-the-journey-2023'
      },
      choreographer: 'David Blake',
      composer: 'Dwight Trible',
      year: 2023,
      status: 'active',
      category: 'contemporary', // adjust based on your schema
      isFeatured: false,
    }

    const created = await client.create(newEntry)
    console.log('✅ Created new Melanin Migration entry:', created._id)

  } catch (error) {
    console.error('❌ Error creating Melanin Migration:', error.message)
  }
}

// Run the appropriate function
async function main() {
  console.log('🎭 CDT Jamaica - Melanin Migration Update Script')
  console.log('=' .repeat(50))

  // First try to update existing entry
  await updateMelaninMigration()

  console.log('\n🎉 Script completed!')
  console.log('💡 Check your Sanity Studio at http://localhost:3333/ to verify the changes')
}

// Run the script
main().catch(console.error)
