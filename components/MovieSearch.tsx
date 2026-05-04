"use client"
import { useState, useEffect, useCallback } from "react"
import Image from "next/image"

interface Movie {
  id: number
  title: string
  poster_path: string | null
  release_date: string
}

interface MovieSearchProps {
  onSelect: (movieId: number | null) => void
  initialMovieId?: number | null
}

export default function MovieSearch({ onSelect, initialMovieId }: MovieSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  // Fetch initial movie if ID is provided
  useEffect(() => {
    async function fetchInitialMovie() {
      if (initialMovieId && !selectedMovie) {
        try {
          const res = await fetch(`/api/movies/${initialMovieId}`)
          if (res.ok) {
            const data = await res.json()
            setSelectedMovie(data)
          }
        } catch (error) {
          console.error("Error fetching initial movie:", error)
        }
      }
    }
    fetchInitialMovie()
  }, [initialMovieId])

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/movies/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.results?.slice(0, 5) || [])
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) search(query)
    }, 500)
    return () => clearTimeout(timer)
  }, [query, search])

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie)
    onSelect(movie.id)
    setIsOpen(false)
    setQuery("")
  }

  const removeSelection = () => {
    setSelectedMovie(null)
    onSelect(null)
  }

  return (
    <div className="relative w-full">
      <label className="block text-sm font-bold text-gray-400 mb-2 mr-1">اربط المقال بفيلم (اختياري) 🎬</label>
      
      {selectedMovie ? (
        <div className="flex items-center justify-between p-4 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
              <Image 
                src={selectedMovie.poster_path ? `https://image.tmdb.org/t/p/w92${selectedMovie.poster_path}` : "/placeholder-poster.jpg"}
                alt={selectedMovie.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="font-bold text-white leading-tight">{selectedMovie.title}</h4>
              <p className="text-xs text-gray-500 mt-1">{selectedMovie.release_date?.split('-')[0] || "—"}</p>
            </div>
          </div>
          <button 
            onClick={removeSelection}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-red-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(true)
            }}
            placeholder="ابحث عن اسم الفيلم..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37]/50 outline-none transition-all text-white"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500">
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>

          {isOpen && results.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-[#1a1a24] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
              {results.map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => handleSelect(movie)}
                  className="w-full flex items-center gap-4 p-3 hover:bg-white/5 transition-colors text-right border-b border-white/5 last:border-0"
                >
                  <div className="relative w-10 h-14 rounded overflow-hidden flex-shrink-0 border border-white/10 bg-black">
                    {movie.poster_path && (
                      <Image 
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white text-sm">{movie.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{movie.release_date?.split('-')[0] || "—"}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
