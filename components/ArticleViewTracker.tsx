"use client"
import { useEffect } from "react"
import { createClient } from "@/utils/supabase/client"

export default function ArticleViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    async function trackView() {
      // Small delay to ensure it's a real view, not just a bot skimming
      const timer = setTimeout(async () => {
         const supabase = createClient()
         // Ignore potential errors as tracking shouldn't break the UI
         await supabase.rpc('increment_article_view', { article_slug: slug })
      }, 5000); // 5 seconds

      return () => clearTimeout(timer)
    }
    
    trackView()
  }, [slug])

  return null // Invisible tracker component
}
