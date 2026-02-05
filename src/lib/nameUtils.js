/**
 * Utility functions for name formatting and sorting
 */

/**
 * Convert a name to camel case (first letter capitalized, rest lowercase)
 * @param {string} name - The name to format
 * @returns {string} - The formatted name in camel case
 */
export const toCamelCase = (name) => {
  if (!name || typeof name !== 'string') return name;
  
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Extract last name from a full name
 * @param {string} name - The full name
 * @returns {string} - The last name
 */
export const getLastName = (name) => {
  if (!name || typeof name !== 'string') return name;
  
  const parts = name.trim().split(' ');
  return parts[parts.length - 1];
};

/**
 * Sort an array of objects by last name alphabetically
 * @param {Array} items - Array of objects with name property
 * @returns {Array} - Sorted array
 */
export const sortByLastName = (items) => {
  if (!Array.isArray(items)) return items;
  
  return [...items].sort((a, b) => {
    const lastNameA = getLastName(a.name || '').toLowerCase();
    const lastNameB = getLastName(b.name || '').toLowerCase();
    
    if (lastNameA < lastNameB) return -1;
    if (lastNameA > lastNameB) return 1;
    
    // If last names are the same, sort by first name
    const firstNameA = (a.name || '').split(' ')[0].toLowerCase();
    const firstNameB = (b.name || '').split(' ')[0].toLowerCase();
    
    if (firstNameA < firstNameB) return -1;
    if (firstNameB < firstNameB) return 1;
    
    return 0;
  });
};

/**
 * Format names in an array of objects to camel case
 * @param {Array} items - Array of objects with name property
 * @returns {Array} - Array with formatted names
 */
export const formatNamesToCamelCase = (items) => {
  if (!Array.isArray(items)) return items;
  
  return items.map(item => ({
    ...item,
    name: toCamelCase(item.name)
  }));
};

/**
 * Process an array of items: sort by last name and format names to camel case
 * @param {Array} items - Array of objects with name property
 * @returns {Array} - Processed array
 */
export const processNames = (items) => {
  if (!Array.isArray(items)) return items;
  
  return formatNamesToCamelCase(sortByLastName(items));
};
