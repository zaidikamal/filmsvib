"use client"
import { useEffect } from "react"
import { createClient } from "@/utils/supabase/client"

export default function ArticleViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    async function trackView() {
      const timer = setTimeout(async () => {
        try {
          const supabase = createClient()
          await supabase.rpc('increment_article_view', { article_slug: slug })
        } catch (err) {
          console.warn("View tracking failed:", err)
        }
      }, 5000);
      return () => clearTimeout(timer)
    }
    
    trackView()
  }, [slug])

  return null // Invisible tracker component
}
