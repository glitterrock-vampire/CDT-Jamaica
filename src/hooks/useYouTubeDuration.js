import { useState, useEffect } from 'react';
import { fetchVideoDuration, formatDuration } from '../lib/youtube';

export const useYouTubeDuration = (youtubeId, fallbackDuration) => {
  const [duration, setDuration] = useState(fallbackDuration);

  useEffect(() => {
    const fetchDuration = async () => {
      if (!youtubeId) return;
      
      try {
        const durationISO = await fetchVideoDuration(youtubeId);
        if (durationISO) {
          setDuration(formatDuration(durationISO));
        }
      } catch (error) {
        console.error('Error fetching YouTube duration:', error);
      }
    };

    fetchDuration();
  }, [youtubeId]);

  return duration || fallbackDuration || '';
};
