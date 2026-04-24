import { MetadataRoute } from 'next';
import { getTrendingMovies } from '@/lib/tmdb';

export const revalidate = 86400; // Update sitemap once a day

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://filmsvib.vercel.app'; // Replace with actual URL if known

  try {
    const data = await getTrendingMovies();
    const movies = data.results || [];

    const movieUrls = movies.map((movie: any) => ({
      url: `${baseUrl}/movie/${movie.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      ...movieUrls,
    ];
  } catch (error) {
    // Fallback if TMDB is down
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}
