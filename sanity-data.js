// Simple script to add performance data - copy and paste this into Sanity Studio console
// Or run this in the browser console when Sanity Studio is open

const performances = [
  {
    _type: 'performance',
    title: 'Jamaica Dance Umbrella',
    company: 'CDT Senior Company',
    date: '2026-03-01',
    time: '6:00 PM',
    venue: 'Phillip Sherlock Center',
    location: 'Kingston, Jamaica',
    description: 'A celebration of Jamaican dance featuring contemporary and traditional works from across the island.',
    category: 'Main Stage',
    isUpcoming: true
  },
  {
    _type: 'performance',
    title: 'Caribbean Rhythms International',
    company: 'CDT Senior Company',
    date: '2026-03-14',
    time: '8:00 PM',
    venue: 'Miramar Cultural Center',
    location: 'Florida, USA',
    description: 'An electrifying showcase of Caribbean dance traditions bringing the vibrant culture of Jamaica to international audiences.',
    category: 'International',
    isUpcoming: true
  },
  {
    _type: 'performance',
    title: 'Spring Season Premiere - Night 1',
    company: 'CDT All Companies',
    date: '2026-04-17',
    time: '7:30 PM',
    venue: 'Phillip Sherlock Center',
    location: 'Kingston, Jamaica',
    description: 'Three-night celebration featuring new choreographic works and beloved repertoire pieces from all CDT companies.',
    category: 'Showcase',
    isUpcoming: true
  },
  {
    _type: 'performance',
    title: 'Spring Season Premiere - Night 2',
    company: 'CDT All Companies',
    date: '2026-04-18',
    time: '7:30 PM',
    venue: 'Phillip Sherlock Center',
    location: 'Kingston, Jamaica',
    description: 'Second night of our spring season showcase with different programming and special guest performances.',
    category: 'Showcase',
    isUpcoming: true
  },
  {
    _type: 'performance',
    title: 'Spring Season Premiere - Night 3',
    company: 'CDT All Companies',
    date: '2026-04-19',
    time: '7:30 PM',
    venue: 'Phillip Sherlock Center',
    location: 'Kingston, Jamaica',
    description: 'Final night of our spring season featuring the best of CDT\'s repertoire and world premieres.',
    category: 'Showcase',
    isUpcoming: true
  },
  {
    _type: 'performance',
    title: 'UK Dance Exchange',
    company: 'CDT Senior Company',
    date: '2026-05-06',
    time: '7:00 PM',
    venue: 'Lester',
    location: 'Lester, UK',
    description: 'Cultural exchange performance bringing Jamaican dance heritage to UK audiences in collaboration with local dance companies.',
    category: 'International',
    isUpcoming: true
  },
  {
    _type: 'performance',
    title: 'Annual Gala Performance',
    company: 'CDT Senior & Junior Companies',
    date: '2026-06-13',
    time: '7:30 PM',
    venue: 'Courtleigh Auditorium',
    location: 'Kingston, Jamaica',
    description: 'Our annual gala celebration featuring the best works of the season and special guest artists.',
    category: 'Main Stage',
    isUpcoming: true
  }
];

// Copy this array and paste it into Sanity Studio to create the documents
console.log('Performance data ready to add to Sanity:', performances);
