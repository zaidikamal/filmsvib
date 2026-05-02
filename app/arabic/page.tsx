import { getArabicMovies } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";

export default async function ArabicCinemaPage() {
  const data = await getArabicMovies();
  const movies = data?.results || [];

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white pt-32 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12" dir="rtl">
          <div className="h-10 w-2 bg-[#d4af37] rounded-full shadow-[0_0_20px_#d4af37]"></div>
          <h1 className="text-4xl font-black gold-text-glow">السينما العربية 🇸🇦</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {movies.map((movie: any) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {movies.length === 0 && (
          <div className="text-center py-20 opacity-50">
            لا توجد أفلام عربية حالياً
          </div>
        )}
      </div>
    </main>
  );
}
