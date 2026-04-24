const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const OPTS = (ttl = 3600) => ({ next: { revalidate: ttl } });
const HEADERS = { Authorization: `Bearer ${TMDB_API_KEY}`, accept: 'application/json' };

async function tmdbFetch(path: string, ttl = 3600) {
  const res = await fetch(
    `${TMDB_BASE_URL}${path}&language=ar-SA`,
    { headers: HEADERS, next: { revalidate: ttl } }
  );
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`TMDB ${res.status}: ${path}`);
  }
  return res.json();
}

export async function getTrendingMovies() {
  return tmdbFetch('/trending/movie/week?api_key=' + TMDB_API_KEY);
}

export async function searchMovies(query: string) {
  if (!query) return { results: [] };
  return tmdbFetch(`/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`, 600);
}

export async function getMovieById(id: string | number) {
  return tmdbFetch(`/movie/${id}?api_key=${TMDB_API_KEY}`);
}

// Cast for a movie
export async function getMovieCredits(id: string | number) {
  return tmdbFetch(`/movie/${id}/credits?api_key=${TMDB_API_KEY}`);
}

// Person (actor/director) detail
export async function getPersonById(id: string | number) {
  return tmdbFetch(`/person/${id}?api_key=${TMDB_API_KEY}`);
}

// Movies for a person
export async function getPersonMovies(id: string | number) {
  return tmdbFetch(`/person/${id}/movie_credits?api_key=${TMDB_API_KEY}`);
}
