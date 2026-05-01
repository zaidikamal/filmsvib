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
      whileHover={{ y: -10 }}
      className="royal-card-item group"
    >
      <Link href={`/movie/${movie.id}`}>
        <div className="relative aspect-[2/3] overflow-hidden">
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
          
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
            <span className="text-white/40 text-[10px] font-medium">
              {new Date(movie.release_date).getFullYear()}
            </span>
            <span className="text-[#d4af37] text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              عرض التفاصيل ←
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
