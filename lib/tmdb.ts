const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function tmdbFetch(endpoint: string, ttl = 3600) {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    console.error("TMDB API Key is missing!");
    return null;
  }

  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${TMDB_BASE_URL}${endpoint}${separator}api_key=${apiKey}&language=ar-SA`;

  try {
    const res = await fetch(url, { next: { revalidate: ttl } });
    if (!res.ok) {
      console.error(`TMDB Error ${res.status}: ${endpoint}`);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("TMDB Fetch Exception:", error);
    return null;
  }
}

export async function getTrendingMovies() {
  return tmdbFetch('/trending/movie/week');
}

export async function searchMovies(query: string) {
  if (!query) return { results: [] };
  return tmdbFetch(`/search/movie?query=${encodeURIComponent(query)}`, 600);
}

export async function getMovieById(id: string | number) {
  return tmdbFetch(`/movie/${id}`);
}

// Cast for a movie
export async function getMovieCredits(id: string | number) {
  return tmdbFetch(`/movie/${id}/credits`);
}

// Person (actor/director) detail
export async function getPersonById(id: string | number) {
  return tmdbFetch(`/person/${id}`);
}

// Movies for a person
export async function getPersonMovies(id: string | number) {
  return tmdbFetch(`/person/${id}/movie_credits`);
}

export async function getNowPlayingMovies() {
  return tmdbFetch('/movie/now_playing');
}

export async function getUpcomingMovies() {
  return tmdbFetch('/movie/upcoming');
}
