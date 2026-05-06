"use client"

import { useState, useTransition } from "react"
import { toggleWatchlist } from "@/app/actions/movies"
import { useRouter } from "next/navigation"

export default function WatchlistButton({ 
  movie, 
  initialIsSaved = false 
}: { 
  movie: any, 
  initialIsSaved?: boolean 
}) {
  const [isSaved, setIsSaved] = useState(initialIsSaved)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleToggle = async () => {
    // Optimistic UI
    setIsSaved(!isSaved)

    startTransition(async () => {
      const result = await toggleWatchlist(movie)
      if (result.error) {
        setIsSaved(isSaved) // Revert on error
        alert(result.error)
      } else {
        router.refresh()
      }
    })
  }

  return (
    <button 
      onClick={handleToggle}
      disabled={isPending}
      className={`group relative flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black transition-all active:scale-95 overflow-hidden
        ${isSaved 
          ? "bg-white/10 text-white border border-white/20 hover:bg-white/20" 
          : "bg-white text-black hover:bg-gray-100 shadow-xl"
        }`}
    >
      {/* Background glow effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
        ${isSaved ? "bg-purple-500/10" : "bg-black/5"}`} 
      />

      {isPending ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <span className="text-2xl transition-transform group-hover:scale-125 duration-300">
          {isSaved ? "❤️" : "🤍"}
        </span>
      )}
      
      <span className="relative z-10">
        {isSaved ? "في مفضلتك" : "أضف للمفضلة"}
      </span>
    </button>
  )
}
