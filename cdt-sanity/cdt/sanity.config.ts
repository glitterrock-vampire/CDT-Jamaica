// @ts-nocheck
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import repertoireItem from './schemaTypes/repertoireItem'

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
    types: [repertoireItem as any],
  },

  // CORS settings for development
  server: {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3333'],
      credentials: true,
    },
  },
})
