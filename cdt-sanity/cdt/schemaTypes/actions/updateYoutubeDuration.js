import {defineField, defineType} from 'sanity'
import axios from 'axios'

// Format duration from YouTube's ISO 8601 format to MM:SS
function formatDuration(isoDuration) {
  const match = isoDuration.match(/PT(?:\d+H)?(\d+M)?(\d+S)?/)
  if (!match) return ''
  
  const hours = (isoDuration.match(/(\d+)H/) || [])[1] || 0
  const minutes = (isoDuration.match(/(\d+)M/) || [])[1] || 0
  const seconds = (isoDuration.match(/(\d+)S/) || [])[1] || 0
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

// Fetch duration from YouTube API
async function fetchYoutubeDuration(youtubeId) {
  if (!youtubeId) return null
  
  const YOUTUBE_API_KEY = process.env.SANITY_STUDIO_YOUTUBE_API_KEY
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key is not set in environment variables')
    return null
  }

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos`,
      {
        params: {
          id: youtubeId,
          part: 'contentDetails',
          key: YOUTUBE_API_KEY
        }
      }
    )

    if (response.data.items && response.data.items.length > 0) {
      return formatDuration(response.data.items[0].contentDetails.duration)
    }
    return null
  } catch (error) {
    console.error('Error fetching YouTube duration:', error.message)
    return null
  }
}

// Sanity document action to update YouTube duration
export const updateYoutubeDuration = (props) => {
  const {draft, published, onComplete} = props
  const doc = draft || published
  
  if (!doc || !doc.youtubeId) {
    return null
  }

  return {
    label: 'Update YouTube Duration',
    onHandle: async () => {
      const duration = await fetchYoutubeDuration(doc.youtubeId)
      if (duration) {
        // Update the document with the new duration
        props.patch({
          set: {
            duration: duration
          }
        }).commit()
      }
      onComplete()
    }
  }
}

// Sanity plugin to automatically update duration on document publish
export const youtubeDurationAutoUpdate = (prev) => {
  return {
    ...prev,
    document: {
      ...prev.document,
      onPublish: async ({ published, draft }) => {
        const doc = draft || published
        if (doc && doc.youtubeId && (!doc.duration || doc.youtubeId !== doc._originalYoutubeId)) {
          const duration = await fetchYoutubeDuration(doc.youtubeId)
          if (duration) {
            return {
              ...doc,
              duration: duration,
              _originalYoutubeId: doc.youtubeId // Store the YouTube ID to avoid repeated updates
            }
          }
        }
        return doc
      }
    }
  }
}
