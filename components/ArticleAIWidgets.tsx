"use client"

import { useState } from "react"
import { getCharacterAnalysisAction, getSimilarMoviesAction } from "@/app/actions/movies"

export default function ArticleAIWidgets({ movieTitle, excerpt }: { movieTitle?: string, excerpt?: string }) {
    const [activeTab, setActiveTab] = useState<string | null>(null)
    const [data, setData] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleAction = async (type: string) => {
        if (!movieTitle) return
        setIsLoading(true)
        setActiveTab(type)
        let result = ""
        if (type === 'characters') {
            result = await getCharacterAnalysisAction(movieTitle)
        } else if (type === 'similar') {
            result = await getSimilarMoviesAction(movieTitle)
        }
        setData(result)
        setIsLoading(false)
    }

    return (
        <div className="mt-12 border-t border-white/5 pt-12">
            <div className="flex flex-wrap gap-4 mb-8">
                {excerpt && (
                    <div className="w-full bg-white/5 rounded-3xl p-6 border border-white/5 mb-4">
                        <h4 className="text-[#d4af37] font-black text-xs uppercase tracking-widest mb-3">ملخص سريع (AI) ✨</h4>
                        <p className="text-gray-300 italic">"{excerpt}"</p>
                    </div>
                )}
                
                {movieTitle && (
                    <>
                        <button 
                            onClick={() => handleAction('characters')}
                            className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${activeTab === 'characters' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                        >
                            <span>🎭</span> تحليل الشخصيات
                        </button>
                        <button 
                            onClick={() => handleAction('similar')}
                            className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${activeTab === 'similar' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                        >
                            <span>🎬</span> أفلام مشابهة
                        </button>
                    </>
                )}
            </div>

            {activeTab && movieTitle && (
                <div className="bg-[#12121a] rounded-3xl p-8 border border-white/10 animate-fade-in">
                    {isLoading ? (
                        <div className="flex items-center gap-4 animate-pulse">
                            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-indigo-300">جاري الاستنتاج...</span>
                        </div>
                    ) : (
                        <div className="prose prose-invert max-w-none">
                            <p className="whitespace-pre-wrap leading-loose text-gray-300">{data}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
