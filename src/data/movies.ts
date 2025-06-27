export type Movie = {
  id: number;
  title: string;
  description: string;
  themes: string[];
  streamingAvailability: string;
  themeColor: string;
  mainActors: string[];
};

export const movies: Movie[] = [
  {
    id: 1,
    title: 'Inception',
    description:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    themes: ['sci-fi', 'heist', 'mind-bending'],
    streamingAvailability: 'Netflix',
    themeColor: '220 80% 50%',
    mainActors: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
  },
  {
    id: 2,
    title: 'The Matrix',
    description:
      'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    themes: ['sci-fi', 'action', 'dystopian'],
    streamingAvailability: 'HBO Max',
    themeColor: '140 80% 40%',
    mainActors: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
  },
  {
    id: 3,
    title: 'Parasite',
    description:
      'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    themes: ['thriller', 'dark comedy', 'social commentary'],
    streamingAvailability: 'Hulu',
    themeColor: '120 5% 30%',
    mainActors: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
  },
  {
    id: 4,
    title: 'The Godfather',
    description:
      'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    themes: ['crime', 'drama', 'mafia'],
    streamingAvailability: 'Paramount+',
    themeColor: '15 60% 35%',
    mainActors: ['Marlon Brando', 'Al Pacino', 'James Caan'],
  },
  {
    id: 5,
    title: 'Pulp Fiction',
    description:
      'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    themes: ['crime', 'nonlinear narrative', 'dark comedy'],
    streamingAvailability: 'HBO Max',
    themeColor: '350 80% 50%',
    mainActors: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'],
  },
  {
    id: 6,
    title: 'Spirited Away',
    description:
      "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
    themes: ['anime', 'fantasy', 'coming-of-age'],
    streamingAvailability: 'HBO Max',
    themeColor: '320 70% 60%',
    mainActors: ['Rumi Hiiragi', 'Miyu Irino', 'Mari Natsuki'],
  },
  {
    id: 7,
    title: 'Blade Runner 2049',
    description:
      "A young Blade Runner's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who's been missing for 30 years.",
    themes: ['sci-fi', 'neo-noir', 'dystopian'],
    streamingAvailability: 'Netflix',
    themeColor: '25 90% 55%',
    mainActors: ['Ryan Gosling', 'Harrison Ford', 'Ana de Armas'],
  },
  {
    id: 8,
    title: 'Mad Max: Fury Road',
    description:
      'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the help of a group of female prisoners, a psychotic worshiper, and a drifter named Max.',
    themes: ['action', 'post-apocalyptic', 'high-octane'],
    streamingAvailability: 'HBO Max',
    themeColor: '30 95% 50%',
    mainActors: ['Tom Hardy', 'Charlize Theron', 'Nicholas Hoult'],
  },
  {
    id: 9,
    title: 'Knives Out',
    description:
      'A detective investigates the death of a patriarch of an eccentric, combative family.',
    themes: ['mystery', 'whodunnit', 'comedy'],
    streamingAvailability: 'Amazon Prime',
    themeColor: '45 30% 50%',
    mainActors: ['Daniel Craig', 'Chris Evans', 'Ana de Armas'],
  },
  {
    id: 10,
    title: 'Coco',
    description:
      "Aspiring musician Miguel, confronted with his family's ancestral ban on music, enters the Land of the Dead to find his great-great-grandfather, a legendary singer.",
    themes: ['animation', 'family', 'music'],
    streamingAvailability: 'Disney+',
    themeColor: '200 90% 60%',
    mainActors: ['Anthony Gonzalez', 'Gael García Bernal', 'Benjamin Bratt'],
  },
  {
    id: 11,
    title: 'Get Out',
    description:
      "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.",
    themes: ['horror', 'thriller', 'social commentary'],
    streamingAvailability: 'Hulu',
    themeColor: '0 0% 10%',
    mainActors: ['Daniel Kaluuya', 'Allison Williams', 'Bradley Whitford'],
  },
  {
    id: 12,
    title: 'Everything Everywhere All at Once',
    description:
      'An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives she could have led.',
    themes: ['sci-fi', 'action', 'absurdist comedy'],
    streamingAvailability: 'Showtime',
    themeColor: '0 0% 90%',
    mainActors: ['Michelle Yeoh', 'Stephanie Hsu', 'Ke Huy Quan'],
  },
];
