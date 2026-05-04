import { NextResponse } from 'next/server'
import { searchMovies } from '@/lib/tmdb'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  try {
    const data = await searchMovies(query)
    return NextResponse.json(data)
  } catch (error) {
    console.error('TMDB Search Error:', error)
    return NextResponse.json({ error: 'Failed to search movies' }, { status: 500 })
  }
}
