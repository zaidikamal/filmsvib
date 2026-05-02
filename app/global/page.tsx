import { getPopularMovies } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";

export default async function GlobalCinemaPage() {
  const data = await getPopularMovies();
  const movies = data?.results || [];

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white pt-32 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12" dir="rtl">
          <div className="h-10 w-2 bg-[#d4af37] rounded-full shadow-[0_0_20px_#d4af37]"></div>
          <h1 className="text-4xl font-black gold-text-glow">السينما العالمية 🌍</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {movies.map((movie: any) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </main>
  );
}
