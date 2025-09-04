/**
 * Parses a duration string into seconds
 * @param {string|number} duration - The duration to parse (e.g., "3:45", "3.75", "PT3M45S")
 * @returns {number} Duration in seconds
 */
export const parseDuration = (duration) => {
  if (!duration && duration !== 0) return 0;
  
  // Convert to string and trim whitespace
  const durationStr = String(duration).trim();
  
  // Handle empty strings or string "null"
  if (!durationStr || durationStr === "null") return 0;

  // 1. Handle MM:SS format (e.g., 3:45)
  const mmssMatch = durationStr.match(/^(\d+):([0-5]?\d)$/);
  if (mmssMatch) {
    const minutes = parseInt(mmssMatch[1], 10);
    const seconds = parseInt(mmssMatch[2], 10);
    return (minutes * 60) + seconds;
  }

  // 2. Handle decimal minutes (e.g., 3.75 for 3 minutes 45 seconds)
  const decimalMatch = durationStr.match(/^(\d+(?:\.\d+)?)$/);
  if (decimalMatch) {
    const minutes = parseFloat(decimalMatch[1]);
    return Math.round(minutes * 60);
  }

  // 3. Handle ISO 8601 format (e.g., PT1H2M3S, PT5M30S, PT30S)
  const isoMatch = durationStr.match(/^PT(?:([0-9]+(?:\.[0-9]+)?)H)?(?:([0-9]+(?:\.[0-9]+)?)M)?(?:([0-9]+(?:\.[0-9]+)?)S)?$/i);
  if (isoMatch) {
    const hours = parseFloat(isoMatch[1] || '0');
    const minutes = parseFloat(isoMatch[2] || '0');
    const seconds = parseFloat(isoMatch[3] || '0');
    return Math.round(hours * 3600 + minutes * 60 + seconds);
  }

  // 4. Handle simple minutes format (e.g., "5min", "5.5 minutes")
  const minutesMatch = durationStr.match(/^(\d+(?:\.\d+)?)\s*(?:mins?|minutes?)$/i);
  if (minutesMatch) {
    return Math.round(parseFloat(minutesMatch[1]) * 60);
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.warn(`Unrecognized duration format: ${durationStr}`);
  }
  return 0;
};

/**
 * Formats a duration in seconds into a human-readable string (MM:SS or H:MM:SS)
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string (e.g., "3:45", "1:23:45")
 */
export const formatDuration = (seconds) => {
  if (!seconds && seconds !== 0) return '';
  
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  
  return `${mins}:${String(secs).padStart(2, '0')}`;
};
