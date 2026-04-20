const TMDB_API_KEY = '89247d9fb7c53ca3db276c24c43499cf';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function getTrendingMovies() {
  const url = `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=ar-SA`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return res.json();
}

export async function searchMovies(query: string) {
  if (!query) return { results: [] };
  const res = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=ar-SA&query=${encodeURIComponent(query)}`
  );
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

