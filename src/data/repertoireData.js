// Helper function to generate a simple ID from title
const generateId = (title) => 
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const repertoireData = {
  classical: [
    {
      id: 'symphony-no-5',
      title: "Symphony No. 5",
      composer: "Ludwig van Beethoven",
      duration: "30 min",
      year: "1808",
      youtubeId: "WNCl-69POro",
      description: "Iconic classical piece featuring the famous four-note motif.",
      instruments: ["Full Orchestra"],
      style: "Classical Period",
      notableRecordings: [
        "Berlin Philharmonic, Herbert von Karajan (1963)",
        "Vienna Philharmonic, Carlos Kleiber (1974)"
      ]
    },
    {
      id: 'the-four-seasons',
      title: "The Four Seasons",
      composer: "Antonio Vivaldi",
      duration: "40 min",
      year: "1723",
      youtubeId: "GRxofEmo3HA",
      description: "Set of four violin concertos, each representing a different season. Each concerto is in three movements, with a slow movement between two faster ones.",
      instruments: ["Solo Violin", "String Orchestra", "Basso Continuo"],
      style: "Baroque",
      notableRecordings: [
        "I Musici (1982)",
        "Academy of Ancient Music, Christopher Hogwood (1982)"
      ]
    },
  ],
  contemporary: [
    {
      id: 'short-ride-in-a-fast-machine',
      title: "Short Ride in a Fast Machine",
      composer: "John Adams",
      duration: "4 min",
      year: "1986",
      youtubeId: "k4CJbP7WZjI",
      description: "Minimalist orchestral fanfare with driving rhythms. Commissioned for the opening of the Great Woods Festival in Massachusetts.",
      instruments: ["Orchestra"],
      style: "Minimalism",
      premieredBy: "Pittsburgh Symphony Orchestra, Michael Tilson Thomas"
    },
    {
      id: 'the-chairman-dances',
      title: "The Chairman Dances",
      composer: "John Adams",
      duration: "12 min",
      year: "1985",
      youtubeId: "5xH9p4W0a2A",
      description: "Foxtrot for orchestra, originally part of the opera 'Nixon in China'. The piece depicts a foxtrot danced by Madame Mao (Jiang Qing) during the opera.",
      instruments: ["Orchestra"],
      style: "Minimalism/Postminimalism",
      movements: [
        "Foxtrot for Orchestra (The Chairman Dances)"
      ]
    },
  ],
  jamaican: [
    {
      id: 'jamaican-rumba',
      title: "Jamaican Rumba",
      composer: "Arthur Benjamin",
      duration: "2 min",
      year: "1938",
      youtubeId: "8dY1g3y6Lk8",
      description: "Virtuosic solo piano piece with Caribbean rhythms. One of Benjamin's most popular works, inspired by Jamaican folk music.",
      instruments: ["Piano"],
      style: "20th Century Classical",
      dedicatedTo: "The composer's students at the Royal College of Music"
    },
    {
      title: "Jamaican Folk Suite",
      composer: "Oswald Russell",
      duration: "15 min",
      year: "1962",
      youtubeId: "eHxWqJ7G5Jk",
      description: "Orchestral work based on traditional Jamaican folk songs. The suite weaves together several folk melodies in a classical orchestral setting.",
      instruments: ["Orchestra"],
      style: "Nationalist/Neo-Romantic",
      movements: [
        "Morning in the Hills",
        "Market Day",
        "Dance Under the Moon"
      ]
    },
  ]
};

export default repertoireData;
