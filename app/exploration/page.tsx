import { getTrendingMovies, getNowPlayingMovies, getUpcomingMovies } from "@/lib/tmdb"
import ExplorationClient from "@/components/ExplorationClient"

export default async function ExplorationPage() {
  const [trending, nowPlaying, upcoming] = await Promise.all([
    getTrendingMovies(),
    getNowPlayingMovies(),
    getUpcomingMovies()
  ])

  const allMovies = [
    ...(trending?.results || []),
    ...(nowPlaying?.results || []),
    ...(upcoming?.results || [])
  ]

  // Remove duplicates based on ID
  const uniqueMovies = Array.from(new Map(allMovies.map(m => [m.id, m])).values())

  return <ExplorationClient movies={uniqueMovies} />
}
