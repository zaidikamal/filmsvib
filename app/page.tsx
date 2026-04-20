import { getTrendingMovies } from "@/lib/tmdb"
import MovieCard from "@/components/MovieCard"
import Hero from "@/components/Hero"

export default async function Home() {
  const data = await getTrendingMovies()
  const heroMovie = data.results[0]
  const movies = data.results.slice(1) // Show rest in the grid

  return (
    <main className="min-h-screen">
      <Hero movie={heroMovie} />
      
      <section className="container mx-auto px-4 mt-16">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">الأكثر مشاهدة</span>
          <span className="text-red-500 text-sm animate-pulse">🔥</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie: any) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </main>
  )
}

