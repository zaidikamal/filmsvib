import { NextResponse } from 'next/server'
import { getMovieById } from '@/lib/tmdb'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const data = await getMovieById(id)
    if (!data) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 })
    }
    return NextResponse.json(data)
  } catch (error) {
    console.error('TMDB Get Movie Error:', error)
    return NextResponse.json({ error: 'Failed to fetch movie' }, { status: 500 })
  }
}
