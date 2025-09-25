import { createClient } from '@sanity/client'

// Initialize Sanity client
const client = createClient({
  projectId: 'sbvvl9vs',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN, // You'll need to add this to your .env
  apiVersion: '2023-05-03',
})

const creoleBloomingData = {
  _type: 'repertoireItem',
  title: 'Creole Blooming',
  slug: {
    _type: 'slug',
    current: 'creole-blooming'
  },
  choreographer: 'Michael Holgate',
  composer: 'Musique GH Francaise et Turk',
  year: 2010,
  description: `'Creole Blooming' speaks to the dynamic polyrhythmic energy found in the Caribbean. It highlights the many cultural influences on the Caribbean, while reflecting on the negotiations of space between the dominant European presence and the all-pervasive African presence. The dance therefore is a conversation in identity politics and symbolically presents movement vocabulary and movement structures and patterns to represent how the different nations of the world have forged a culture that is a beautiful hybrid flower.`,
  companyPremiere: 'Little Theatre (CDT 2010 Season)',
  worldPremiere: 'Little Theatre (CDT 2010 Season)',
  duration: '10:20',
  costumeDesign: 'Tony Wilson',
  lightingDesign: 'Nadia Roxburgh',
  status: 'active',
  category: 'jamaican',
  stylePeriod: [
    { _type: 'string', _key: 'contemporary', value: 'contemporary' },
    { _type: 'string', _key: 'traditional', value: 'traditional' }
  ],
  genre: [
    { _type: 'string', _key: 'contemporary', value: 'contemporary' },
    { _type: 'string', _key: 'folk', value: 'folk' }
  ],
  style: 'contemporary',
  difficulty: 'intermediate',
  isFeatured: true,
  notes: 'A significant work exploring Caribbean cultural identity through dance.'
}

async function createCreoleBlooming() {
  try {
    console.log('Creating Creole Blooming entry...')

    // Check if entry already exists
    const existing = await client.fetch('*[_type == "repertoireItem" && title == "Creole Blooming"][0]')

    if (existing) {
      console.log('Creole Blooming already exists. Updating...')
      const updated = await client.patch(existing._id).set(creoleBloomingData).commit()
      console.log('✅ Updated successfully:', updated._id)
    } else {
      console.log('Creating new Creole Blooming entry...')
      const created = await client.create(creoleBloomingData)
      console.log('✅ Created successfully:', created._id)
    }

    console.log('🎉 Creole Blooming has been added to your Sanity CMS!')
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

// Run the function
createCreoleBlooming()
