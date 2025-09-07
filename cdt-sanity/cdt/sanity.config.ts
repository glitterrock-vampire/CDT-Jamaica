// @ts-nocheck
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import repertoireItem from './schemaTypes/repertoireItem.jsx'
import siteSettings from './schemaTypes/siteSettings'

export default defineConfig({
  name: 'default',
  title: 'CDT',
  projectId: 'sbvvl9vs',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: process.env.NODE_ENV === 'production',

  plugins: [
    structureTool(),
    visionTool()
  ],

  schema: {
    types: [repertoireItem, siteSettings],
  },

  // CORS settings
  server: {
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:3333',
        'https://cdt-jamaica.vercel.app',
        'https://cdt-jamaica-*.vercel.app' // Wildcard for preview deployments
      ],
      credentials: true,
    },
  },
})
