'use server';

import { movies, Movie } from '@/data/movies';

/**
 * Searches the movie database based on a query string.
 * The query is matched against titles, descriptions, and themes.
 * @param query The string to search for.
 * @returns A promise that resolves to an array of matching movies.
 */
export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query) {
    return [];
  }
  
  const lowerCaseQuery = query.toLowerCase();
  
  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(lowerCaseQuery) ||
    movie.description.toLowerCase().includes(lowerCaseQuery) ||
    movie.themes.some(theme => theme.toLowerCase().includes(lowerCaseQuery))
  );

  return filteredMovies;
}
