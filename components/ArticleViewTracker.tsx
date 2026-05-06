"use client"
import { useEffect } from "react"
import { incrementArticleViews } from "@/app/actions/articles"

export default function ArticleViewTracker({ article }: { article: any }) {
  useEffect(() => {
    // 1. Increment views on server
    const timer = setTimeout(async () => {
      try {
        await incrementArticleViews(article.id)
      } catch (err) {
        console.warn("View tracking failed:", err)
      }
    }, 5000);
    
    // 2. Save to local history for "Continue Reading"
    const history = JSON.parse(localStorage.getItem("article_history") || "[]")
    const newEntry = {
        id: article.id,
        title: article.title,
        slug: article.slug,
        image_url: article.image_url,
        timestamp: new Date().getTime()
    }
    
    // Remove duplicate and add to top
    const filtered = history.filter((h: any) => h.id !== article.id)
    localStorage.setItem("article_history", JSON.stringify([newEntry, ...filtered].slice(0, 10)))

    return () => clearTimeout(timer)
  }, [article.id])

  return null
}
