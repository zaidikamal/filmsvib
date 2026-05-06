"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function ContinueReading() {
    const [recentArticles, setRecentArticles] = useState<any[]>([])

    useEffect(() => {
        // In a real app, we'd fetch this from Supabase 'article_history'
        // For now, let's use localStorage to simulate it
        const history = JSON.parse(localStorage.getItem("article_history") || "[]")
        setRecentArticles(history.slice(0, 4))
    }, [])

    if (recentArticles.length === 0) return null

    return (
        <section className="mb-24">
            <div className="flex items-center gap-4 mb-10">
                <div className="h-10 w-1.5 bg-[#d4af37] rounded-full shadow-[0_0_15px_#d4af37]"></div>
                <h2 className="text-3xl font-black text-white font-royal tracking-tight">أكمل القراءة 📖</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {recentArticles.map((article) => (
                    <Link 
                        key={article.id} 
                        href={`/news/${article.slug}`} 
                        className="group flex gap-4 p-4 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all items-center"
                    >
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                            <Image 
                                src={article.image_url || "/placeholder-hero.jpg"} 
                                alt={article.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="text-white font-bold text-sm line-clamp-2 leading-snug group-hover:text-[#d4af37] transition-colors">
                                {article.title}
                            </h3>
                            <span className="text-[10px] text-gray-500 mt-2 block">
                                آخر زيارة: {new Date(article.timestamp).toLocaleDateString("ar-SA")}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}
