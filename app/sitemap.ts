import { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  
  // جلب كافة المقالات المنشورة
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, created_at')
    .eq('status', 'published')

  const articleEntries: MetadataRoute.Sitemap = (articles || []).map((art) => ({
    url: `https://filmsvib.com/news/${art.slug}`,
    lastModified: new Date(art.created_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: 'https://filmsvib.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://filmsvib.com/news',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...articleEntries,
  ]
}
