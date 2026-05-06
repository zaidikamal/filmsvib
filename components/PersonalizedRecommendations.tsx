"use client"

import { useEffect, useState } from "react"
import { getPersonalizedRecommendations } from "@/app/actions/movies"
import MovieCard from "./MovieCard"
import Image from "next/image"
import Link from "next/link"

export default function PersonalizedRecommendations() {
    const [movies, setMovies] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchRecs() {
            const data = await getPersonalizedRecommendations()
            setMovies(data)
            setIsLoading(false)
        }
        fetchRecs()
    }, [])

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 animate-pulse">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="aspect-[2/3] bg-white/5 rounded-3xl" />
                ))}
            </div>
        )
    }

    if (movies.length === 0) return null

    return (
        <section className="mb-20">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black text-white flex items-center gap-4">
                    <span className="w-2 h-10 bg-indigo-500 shadow-[0_0_15px_#6366f1] rounded-full"></span>
                    مقترحات خصيصاً لك ✨
                </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                {movies.map((movie) => (
                    <div key={movie.id} className="relative group">
                        <MovieCard movie={movie} />
                        {movie.ai_reason && (
                            <div className="absolute -bottom-4 left-4 right-4 bg-indigo-600 text-white text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 text-center shadow-xl border border-indigo-400/30">
                                {movie.ai_reason}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    )
}
