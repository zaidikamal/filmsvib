const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function tmdbFetch(path: string, ttl = 3600) {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    console.error("TMDB API Key is missing!");
    return null;
  }

  const headers = { 
    Authorization: `Bearer ${apiKey}`, 
    accept: 'application/json' 
  };

  try {
    const res = await fetch(
      `${TMDB_BASE_URL}${path}${path.includes('?') ? '&' : '?'}language=ar-SA`,
      { headers, next: { revalidate: ttl } }
    );
    if (!res.ok) {
      console.error(`TMDB Error ${res.status}: ${path}`);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("TMDB Fetch Exception:", error);
    return null;
  }
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
