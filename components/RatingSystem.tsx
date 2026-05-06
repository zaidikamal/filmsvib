"use client"

import { useState, useTransition } from "react"
import { rateMovie } from "@/app/actions/movies"
import { useRouter } from "next/navigation"

export default function RatingSystem({ 
  movieId, 
  initialRating = null 
}: { 
  movieId: number, 
  initialRating?: number | null 
}) {
  const [hoverRating, setHoverRating] = useState(0)
  const [currentRating, setCurrentRating] = useState(initialRating)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleRate = (val: number) => {
    setCurrentRating(val)
    startTransition(async () => {
      const result = await rateMovie(movieId, val)
      if (result.error) {
        setCurrentRating(initialRating)
        alert(result.error)
      } else {
        router.refresh()
      }
    })
  }

  return (
    <div className="flex flex-col gap-3 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-black text-gray-400 uppercase tracking-widest">قيم هذا العمل</span>
        {currentRating && (
          <span className="text-xs font-bold text-[#d4af37] bg-[#d4af37]/10 px-2 py-1 rounded-lg">
            تقييمك: {currentRating}/10
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5" onMouseLeave={() => setHoverRating(0)}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <button
            key={star}
            disabled={isPending}
            onMouseEnter={() => setHoverRating(star)}
            onClick={() => handleRate(star)}
            className={`transition-all duration-200 transform ${
              star <= (hoverRating || currentRating || 0) 
                ? "scale-125 text-[#d4af37]" 
                : "scale-100 text-gray-700 hover:text-gray-500"
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-6 h-6"
            >
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
          </button>
        ))}
      </div>
      
      {isPending && (
          <p className="text-[10px] text-gray-500 animate-pulse mt-2 text-center font-bold">جاري حفظ تقييمك العادل...</p>
      )}
    </div>
  )
}
