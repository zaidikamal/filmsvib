import Image from "next/image"
import Link from "next/link"

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

export default function MovieCard({ movie }: { movie: Movie }) {
  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : `/placeholder-image.jpg`;

  return (
    <Link href={`/movie/${movie.id}`} className="group relative block">
      {/* GLOW EFFECT BACKGROUND */}
      <div className="absolute -inset-0.5 bg-gradient-to-t from-purple-600/20 to-transparent rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-700"></div>
      
      <div className="relative bg-[#0a0a0f] rounded-[2rem] overflow-hidden border border-white/5 transition-all duration-500 group-hover:border-white/20 group-hover:-translate-y-2 shadow-2xl">
        <div className="relative aspect-[2/3] w-full overflow-hidden">
          <Image 
            src={imageUrl} 
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
          />
          
          {/* OVERLAY ON HOVER */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-500" />
          
          {/* RATING BADGE */}
          <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-2xl border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2 transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
            <span className="text-yellow-500 text-[10px]">★</span>
            <span className="text-white text-[10px] font-black">{movie.vote_average?.toFixed(1)}</span>
          </div>

          {/* ACTION BUTTON ON HOVER */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%] transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-200">
             <div className="py-3 bg-white text-black text-[10px] font-black rounded-xl text-center uppercase tracking-widest shadow-xl">
               View Details
             </div>
          </div>
        </div>
      </div>

      <div className="mt-4 px-2">
        <h3 className="font-black text-sm text-gray-400 group-hover:text-white transition-colors line-clamp-1 tracking-tight">
          {movie.title}
        </h3>
      </div>
    </Link>
  )
}
