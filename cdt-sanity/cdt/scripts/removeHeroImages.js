// This script will remove all hero images from repertoire items

const sanityClient = require('@sanity/client')

// Initialize the Sanity client
const client = sanityClient({
  projectId: process.env.SANITY_STUDIO_API_PROJECT_ID || 'sbvvl9vs', // Use your project ID
  dataset: process.env.SANITY_STUDIO_API_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN, // Make sure you have a token with write access
  useCdn: false // Use the API, not the CDN
})

async function removeHeroImages() {
  // First, fetch all repertoire items that have a heroImage
  const query = `*[_type == "repertoireItem" && defined(heroImage)] { _id, _rev }`
  
  try {
    const items = await client.fetch(query)
    console.log(`Found ${items.length} items with hero images to update`)
    
    if (items.length === 0) {
      console.log('No items with hero images found')
      return
    }
    
    // Create a transaction to update all items
    const transaction = items.reduce((tx, item) => {
      return tx.patch(item._id, {
        unset: ['heroImage']
      })
    }, client.transaction())
    
    // Commit the transaction
    const result = await transaction.commit()
    console.log(`Successfully removed hero images from ${result.results.length} items`)
    
  } catch (error) {
    console.error('Error removing hero images:', error.message)
  }
}

// Run the function
removeHeroImages()
