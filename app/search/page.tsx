import { searchMovies } from "@/lib/tmdb"
import MovieCard from "@/components/MovieCard"

export default async function SearchPage({ searchParams }: { searchParams: { q: string } }) {
  const query = searchParams.q || "";
  if (!query) {
    return (
      <div className="container mx-auto px-4 mt-32 min-h-[50vh] flex items-center justify-center">
        <h1 className="text-2xl text-gray-400">الرجاء إدخال كلمة للبحث</h1>
      </div>
    );
  }

  const data = await searchMovies(query)

  return (
    <div className="container mx-auto px-4 mt-32 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">
        نتائج البحث عن: <span className="text-purple-500">{query}</span>
      </h1>
      
      {data.results && data.results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {data.results.map((movie: any) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-16 bg-white/5 rounded-2xl border border-white/10">
           <span className="text-5xl mb-4">🎥</span>
           <p className="text-xl text-gray-300">لم نتمكن من العثور على أية أفلام تتطابق مع بحثك.</p>
        </div>
      )}
    </div>
  )
}
