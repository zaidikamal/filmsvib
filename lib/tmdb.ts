const TMDB_API_KEY = process.env.TMDB_API_KEY;
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

export async function getMovieById(id: string | number) {
  const url = `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=ar-SA`;
  // Add caching to prevent hitting Vercel serverless function limits / Next.js SSG
  const res = await fetch(url, { next: { revalidate: 3600 } });
  
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch movie');
  }
  
  return res.json();
}

