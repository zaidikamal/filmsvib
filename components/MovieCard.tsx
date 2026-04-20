import Image from "next/image"

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
    <div className="bg-[#12121a] rounded-2xl overflow-hidden shadow-lg border border-white/5 hover:border-purple-500/50 transition-all group">
      <div className="relative aspect-[2/3] w-full">
        <Image 
          src={imageUrl} 
          alt={movie.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-white text-xs font-bold">{movie.vote_average.toFixed(1)}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-white line-clamp-1">{movie.title}</h3>
      </div>
    </div>
  )
}
