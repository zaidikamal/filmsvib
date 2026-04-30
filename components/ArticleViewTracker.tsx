"use client"
import { useEffect } from "react"
import { incrementArticleViews } from "@/app/actions/articles"

export default function ArticleViewTracker({ articleId }: { articleId: string }) {
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        await incrementArticleViews(articleId)
      } catch (err) {
        console.warn("View tracking failed:", err)
      }
    }, 5000);
    
    return () => clearTimeout(timer)
  }, [articleId])

  return null
}
