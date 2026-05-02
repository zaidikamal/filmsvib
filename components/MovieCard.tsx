"use client"
import { motion } from "framer-motion"
import Link from "next/link"

interface MovieCardProps {
  movie: {
    id: number
    title: string
    poster_path: string
    vote_average: number
    release_date: string
  }
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="royal-card-item group relative"
    >
      <Link href={`/movie/${movie.id}`}>
        <div className="relative aspect-[2/3] overflow-hidden">
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
          
          {/* ── PLAY BUTTON OVERLAY ── */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-30 scale-75 group-hover:scale-100">
            <div className="w-14 h-14 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center backdrop-blur-md shadow-[0_0_25px_rgba(212,175,55,0.4)]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#d4af37] ml-1 drop-shadow-md">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* ── RATING BADGE ── */}
          <div className="absolute top-4 right-4 bg-[#d4af37] text-black text-[10px] font-black px-2 py-1 rounded shadow-lg shadow-[#d4af37]/20">
            {movie.vote_average.toFixed(1)}
          </div>
        </div>

        <div className="p-5" dir="rtl">
          <h3 className="text-white font-bold text-sm mb-1 truncate group-hover:text-[#d4af37] transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-white/40 text-[10px] font-medium tracking-wider">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'قريباً'}
            </span>
            <span className="text-[#d4af37] text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              عرض التفاصيل &larr;
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
