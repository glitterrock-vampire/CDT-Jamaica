// This script will update the schema in Sanity
// Run with: npx sanity exec scripts/updateSchema.js --with-user-token

const client = require('part:@sanity/base/client')

// This function will update all repertoire items to ensure they have the correct duration format
const updateRepertoireItems = async () => {
  try {
    // Get all repertoire items
    const query = `*[_type == "repertoireItem"]{
      _id,
      duration
    }`
    
    const items = await client.fetch(query)
    
    // Update each item to ensure duration is a string
    const transactions = items.map(item => {
      let newDuration = item.duration
      
      // If duration is an object, set it to empty string
      if (item.duration && typeof item.duration === 'object') {
        newDuration = ''
      }
      
      return client
        .patch(item._id)
        .set({ duration: newDuration })
        .commit()
    })
    
    await Promise.all(transactions)
    console.log(`Updated ${items.length} repertoire items`)
    
  } catch (error) {
    console.error('Error updating repertoire items:', error)
  }
}

// Run the update
updateRepertoireItems().catch(console.error)
