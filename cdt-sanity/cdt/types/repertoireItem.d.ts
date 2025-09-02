import { PreviewConfig } from 'sanity'

declare module 'sanity' {
  interface PreviewProps {
    title?: string
    composer?: string
    category?: string
    media?: any
  }
  
  interface DocumentDefinition {
    preview?: PreviewConfig<PreviewProps, PreviewProps>
  }
}
