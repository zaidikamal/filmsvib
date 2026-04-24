import Image from "next/image"
import Link from "next/link"

export default function Hero({ movie }: { movie: any }) {
  if (!movie) return null;

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : `/placeholder-hero.jpg`;

  return (
    <div className="relative h-[70vh] min-h-[500px] w-full mt-16 flex items-center">
      <div className="absolute inset-0">
        <Image
          src={backdropUrl}
          alt={movie.title || "Cinema News"}
          fill
          priority
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/50 to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10 animate-fade-in-up">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
              <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold animate-pulse">خبر عاجل</span>
              <span className="text-yellow-400 font-bold border border-yellow-400/30 px-3 py-1 rounded-full text-sm">
                ⭐ {Number(movie.vote_average).toFixed(1)}
              </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              {movie.title}
            </span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed line-clamp-3">
            {movie.overview}
          </p>
          <div className="flex flex-wrap gap-4">
             <Link href={`/movie/${movie.id}`} className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 px-8 py-3 rounded-full font-bold transition-all shadow-lg flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
               شاهد الإعلان
             </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
