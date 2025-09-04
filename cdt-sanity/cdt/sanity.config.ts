// @ts-nocheck
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import repertoireItem from './schemaTypes/repertoireItem'

export default defineConfig({
  name: 'default',
  title: 'CDT',
  projectId: process.env.SANITY_PROJECT_ID || 'sbvvl9vs',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2023-05-03',
  useCdn: process.env.NODE_ENV === 'production',

  plugins: [
    structureTool(),
    visionTool()
  ],

  schema: {
    types: [repertoireItem as any],
  },

  // CORS settings for development and production
  server: {
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:3333',
        'https://cdt-jamaica.vercel.app',  // Add your Vercel production URL
        'https://*.vercel.app'             // Allow all Vercel preview deployments
      ],
      credentials: true,
    },
  },
})
