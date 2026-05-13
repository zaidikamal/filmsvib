"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { analyzeMovie, analyzeCharacters, getSimilarMovieRecs } from "@/lib/ai"

export async function getAnalyzedMovieData(movieTitle: string) {
    return await analyzeMovie(movieTitle)
}

export async function getCharacterAnalysisAction(movieTitle: string) {
    return await analyzeCharacters(movieTitle)
}

export async function getSimilarMoviesAction(movieTitle: string) {
    return await getSimilarMovieRecs(movieTitle)
}

import { awardPoints } from "./user"

/**
 * Toggle a movie in the user's watchlist
 */
export async function toggleWatchlist(movie: any) {
  const movieId = movie.id
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  const user = authData?.user

  if (!user) {
    return { error: "يجب تسجيل الدخول للإضافة إلى المفضلة" }
  }

  // Check if it exists
  const { data: existing } = await supabase
    .from("watchlist")
    .select("id")
    .eq("user_id", user.id)
    .eq("movie_id", movieId)
    .maybeSingle()

  if (existing) {
    // Remove
    const { error } = await supabase
      .from("watchlist")
      .delete()
      .eq("id", existing.id)

    if (error) return { error: error.message }
    revalidatePath(`/movie/${movie.id}`)
    return { success: true, action: "removed" }
  } else {
    // Add
    const { error } = await supabase
      .from("watchlist")
      .insert({
        user_id: user.id,
        movie_id: movie.id,
        movie_title: movie.title || movie.name,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average
      })

    if (error) return { error: error.message }
    
    // Award Points
    await awardPoints(5, "إضافة فيلم للمفضلة")
    
    revalidatePath(`/movie/${movie.id}`)
    return { success: true, action: "added" }
  }
}

/**
 * Rate a movie
 */
export async function rateMovie(movieId: number, rating: number) {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  const user = authData?.user

  if (!user) {
    return { error: "يجب تسجيل الدخول للتقييم" }
  }

  if (rating < 1 || rating > 10) {
    return { error: "التقييم يجب أن يكون بين 1 و 10" }
  }

  const { error } = await supabase
    .from("ratings")
    .upsert({
      user_id: user.id,
      movie_id: movieId,
      rating: rating
    }, { onConflict: "user_id, movie_id" })

  if (error) return { error: error.message }
  
  // Award Points
  await awardPoints(10, "تقييم فيلم")
  
  revalidatePath(`/movie/${movieId}`)
  return { success: true }
}

/**
 * Get average rating and user's rating for a movie
 */
export async function getMovieStats(movieId: number) {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  const user = authData?.user

  const { data: ratings } = await supabase
    .from("ratings")
    .select("rating")
    .eq("movie_id", movieId)

  const count = ratings?.length || 0
  const avg = count > 0 
    ? (ratings?.reduce((acc, r) => acc + r.rating, 0) || 0) / count 
    : 0

  let userRating = null
  let inWatchlist = false

  if (user) {
    const { data: r } = await supabase
      .from("ratings")
      .select("rating")
      .eq("user_id", user.id)
      .eq("movie_id", movieId)
      .maybeSingle()
    userRating = r?.rating || null

    const { data: w } = await supabase
      .from("watchlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("movie_id", movieId)
      .maybeSingle()
    inWatchlist = !!w
  }

  return {
    averageRating: avg,
    totalRatings: count,
    userRating,
    inWatchlist
  }
}

import { getAIRecommendations } from "@/lib/recommendations"

export async function getPersonalizedRecommendations() {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  const user = authData?.user

  if (!user) return []

  // 1. Get Watchlist
  const { data: watchlist } = await supabase
    .from("watchlist")
    .select("movie_title")
    .eq("user_id", user.id)
    .limit(10)

  // 2. Get Ratings
  const { data: ratings } = await supabase
    .from("ratings")
    .select("rating, movie_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  // We need titles for ratings too, let's fetch them from cached_movies if available
  const ratedMovieIds = ratings?.map(r => r.movie_id) || []
  const { data: cachedMovies } = await supabase
    .from("cached_movies")
    .select("id, title")
    .in("id", ratedMovieIds)

  const ratedMoviesWithTitles = ratings?.map(r => {
    const movie = cachedMovies?.find(m => m.id === r.movie_id)
    return { title: movie?.title || "Unknown", rating: r.rating }
  }) || []

  // 3. Get Recommendations
  const preferences = {
    favoriteMovies: watchlist?.map(w => w.movie_title) || [],
    recentRatings: ratedMoviesWithTitles,
    genres: [] // We could extract genres from cached_movies later
  }

  return await getAIRecommendations(preferences)
}
