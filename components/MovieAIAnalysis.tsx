"use client"

import { useState } from "react"
import { getAnalyzedMovieData } from "@/app/actions/movies"

export default function MovieAIAnalysis({ movieTitle }: { movieTitle: string }) {
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleAnalyze = async () => {
    setIsLoading(true)
    setIsOpen(true)
    const result = await getAnalyzedMovieData(movieTitle)
    setAnalysis(result)
    setIsLoading(false)
  }

  return (
    <div className="mt-8">
      {!isOpen ? (
        <button
          onClick={handleAnalyze}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black transition-all hover:scale-105 shadow-lg shadow-indigo-500/20"
        >
          <span className="text-xl">🧠</span>
          تحليل الفيلم بالذكاء الاصطناعي
        </button>
      ) : (
        <div className="bg-[#12121a] border border-indigo-500/30 rounded-[2.5rem] p-10 relative overflow-hidden animate-fade-in">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -z-10"></div>
          
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-white flex items-center gap-3">
              <span className="text-indigo-400">✨</span> تحليل Gemini للفيلم
            </h3>
            <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-white transition-colors"
            >
                إغلاق
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
               <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-indigo-300 font-bold animate-pulse">جاري فحص الأبعاد الدرامية والسينمائية...</p>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none prose-p:leading-loose prose-p:text-gray-300 prose-strong:text-indigo-400">
               <p className="whitespace-pre-wrap text-lg leading-relaxed">{analysis}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
