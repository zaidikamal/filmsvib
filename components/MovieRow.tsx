"use client"
import { motion } from "framer-motion"
import MovieCard from "./MovieCard"
import { useRef } from "react"

interface MovieRowProps {
  title: string
  movies: any[]
}

export default function MovieRow({ title, movies }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" })
    }
  }

  return (
    <div className="mb-20" dir="rtl">
      <div className="flex items-center justify-between mb-8 px-4">
        <div className="flex items-center gap-4">
          <div className="h-8 w-1.5 bg-[#d4af37] rounded-full shadow-[0_0_15px_#d4af37]"></div>
          <h2 className="text-3xl font-black text-white">{title}</h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll("left")}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#d4af37] hover:text-black transition-all"
          >
            &rarr;
          </button>
          <button 
            onClick={() => scroll("right")}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#d4af37] hover:text-black transition-all"
          >
            &larr;
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-10 px-4 no-scrollbar scroll-smooth"
      >
        {movies.map((movie) => (
          <div key={movie.id} className="min-w-[280px] md:min-w-[320px]">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  )
}
