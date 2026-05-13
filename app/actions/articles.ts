"use server"

import { createClient } from "@/utils/supabase/server"
import DOMPurify from "isomorphic-dompurify"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { generateArticleSummary } from "@/lib/ai"
import { awardPoints } from "./user"

export async function submitArticle(formData: {
  title: string
  content: string
  category: string
  imageUrl?: string
  movieId?: number | null
}) {
  const supabase = await createClient()
  
  // 1. Auth & Atomic Rate Limiting
  const { data: authData, error: authError } = await supabase.auth.getUser()
  const user = authData?.user
  if (authError || !user) return { error: "يجب تسجيل الدخول أولاً" }

  // Fetch current profile to check rate limit and ensure profile exists
  let { data: profile } = await supabase
    .from("profiles")
    .select("id, last_submission_at")
    .eq("id", user.id)
    .maybeSingle()

  // Ensure profile exists (Auto-create if missing to avoid foreign key errors)
  if (!profile) {
    const { data: newProfile, error: profileError } = await supabase
      .from("profiles")
      .insert([{ id: user.id, email: user.email, points: 0, level: 1 }])
      .select()
      .maybeSingle()
    
    if (profileError) {
      console.error("Auto-profile creation failed:", profileError)
    } else {
      profile = newProfile
    }
  }

  const now = new Date()
  if (profile?.last_submission_at) {
    const lastSub = new Date(profile.last_submission_at).getTime()
    const diff = (now.getTime() - lastSub) / 1000
    
    if (diff < 60) {
       return { error: `يرجى الانتظار ${Math.ceil(60 - diff)} ثانية قبل إرسال مقال آخر` }
    }
  }

    // 2. Server-Side Sanitization & Validation
    if (formData.movieId && isNaN(Number(formData.movieId))) {
      return { error: "معرف الفيلم غير صحيح" }
    }

    const cleanContent = DOMPurify.sanitize(formData.content)
    const excerpt = await generateArticleSummary(cleanContent)
    
    let slug = ""
    let attempts = 0
    let success = false
  
    while (attempts < 3 && !success) {
      slug = formData.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s\u0600-\u06FF-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "") + "-" + Math.random().toString(36).substring(2, 7)
  
      const { error: insertError } = await supabase.from("articles").insert([{
        title: formData.title,
        slug,
        content: cleanContent,
        excerpt,
        category: formData.category,
        image_url: formData.imageUrl || null,
        movie_id: formData.movieId ? Number(formData.movieId) : null,
        author_id: user.id,
        status: 'pending'
      }])

    if (!insertError) {
      success = true
    } else if (insertError.code === '23505') { // Unique violation
      attempts++
    } else {
      return { error: insertError.message }
    }
  }

  if (!success) {
    console.error({ 
      action: "submit_article_failed", 
      user: user.id, 
      title: formData.title,
      attempts 
    })
    return { error: "فشل توليد رابط فريد للمقال، يرجى تغيير العنوان قليلاً" }
  }

  // Update last_submission_at
  await supabase
    .from("profiles")
    .update({ last_submission_at: now.toISOString() })
    .eq("id", user.id)

  // Award Points (Non-blocking for article submission success)
  try {
    await awardPoints(50, "نشر مقال سينمائي")
  } catch (e) {
    console.error("Failed to award points:", e)
  }

  // 4. Notify interested users
  if (formData.movieId) {
    const { data: interestedUsers } = await supabase
        .from("watchlist")
        .select("user_id")
        .eq("movie_id", formData.movieId)
    
    if (interestedUsers && interestedUsers.length > 0) {
        const notifications = interestedUsers.map(u => ({
            user_id: u.user_id,
            title: "مقال جديد عن فيلم تتابعه! 🎬",
            message: `تم نشر مقال جديد: ${formData.title}`,
            type: "article_alert",
            link: `/news/${slug}`
        }))
        try {
          await supabase.from("notifications").insert(notifications)
        } catch (e) {
          console.error("Failed to send notifications:", e)
        }
    }
  }

  revalidatePath("/news")
  revalidatePath("/news/my-articles")
  return { success: true }
}

export async function moderateArticle(
  articleId: string, 
  action: 'publish' | 'reject', 
  reason?: string
) {
  const supabase = await createClient()
  
  const { data: authData } = await supabase.auth.getUser()
  const user = authData?.user
  if (!user) return { error: "غير مصرح لك" }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
    return { error: "صلاحيات غير كافية" }
  }

  const updates: any = {
    status: action === 'publish' ? 'published' : 'rejected',
    rejection_reason: action === 'reject' ? reason : null,
    [action === 'publish' ? 'approved_by' : 'rejected_by']: user.id,
    published_at: action === 'publish' ? new Date().toISOString() : null,
    is_published: action === 'publish'
  }

  const { error: updateError } = await supabase
    .from("articles")
    .update(updates)
    .eq("id", articleId)
    .is("deleted_at", null)

  if (updateError) return { error: updateError.message }

  // Fetch article info for notification
  const { data: article } = await supabase
    .from("articles")
    .select("title, author_id, slug")
    .eq("id", articleId)
    .maybeSingle()

  if (article) {
    const notificationTitle = action === 'publish' ? 'تم قبول مقالك 🎉' : 'تم رفض مقالك ⚠️'
    const notificationMessage = action === 'publish' 
      ? `تمت الموافقة على مقالك "${article.title}" وهو متاح الآن للقراء.`
      : `للأسف تم رفض مقالك "${article.title}". السبب: ${reason || 'لا يوجد سبب محدد'}`
    
    await supabase.from("notifications").insert({
      user_id: article.author_id,
      title: notificationTitle,
      message: notificationMessage,
      type: action === 'publish' ? 'article_published' : 'article_rejected',
      link: action === 'publish' ? `/news/${article.slug}` : '/news/my-articles'
    })
  }

  revalidatePath("/admin/articles")
  revalidatePath("/news")
  revalidatePath("/news/my-articles")
  return { success: true }
}

export async function softDeleteArticle(articleId: string) {
  const supabase = await createClient()
  
  const { data: authData } = await supabase.auth.getUser()
  const user = authData?.user
  if (!user) return { error: "يجب تسجيل الدخول" }

  // Check if owner or admin
  const { data: article } = await supabase
    .from("articles")
    .select("author_id")
    .eq("id", articleId)
    .maybeSingle()

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  const isOwner = article?.author_id === user.id
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'

  if (!isOwner && !isAdmin) return { error: "غير مصرح لك بحذف هذا المقال" }

  const { error } = await supabase
    .from("articles")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", articleId)

  if (error) {
    console.error({
      action: "soft_delete_failed",
      user: user.id,
      articleId,
      error: error.message
    })
    return { error: error.message }
  }

  revalidatePath("/admin/articles")
  revalidatePath("/news")
  revalidatePath("/news/my-articles")
  return { success: true }
}

export async function incrementArticleViews(articleId: string) {
  const supabase = await createClient()
  
  // Try to get user ID if logged in
  const { data: authData } = await supabase.auth.getUser()
  const user = authData?.user
  
  // For IP, in a real Next.js environment we would get it from headers
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'

  // Use the unique tracking RPC
  await supabase.rpc('increment_article_views_unique', { 
    p_article_id: articleId,
    p_user_id: user?.id || null,
    p_ip: ip
  })
}
export async function createAdminArticle(formData: {
  title: string
  content: string
  category: string
  imageUrl?: string
  isBreaking: boolean
  isPublished: boolean
  slug?: string
  movieId?: number | null
  isAiGenerated?: boolean
  aiConfidenceScore?: number
}) {
  const supabase = await createClient()
  
  const { data: authData } = await supabase.auth.getUser()
  const user = authData?.user
  if (!user) return { error: "غير مصرح لك" }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
     return { error: "صلاحيات غير كافية" }
  }

  // 2. Validation & Sanitization
  if (formData.movieId && isNaN(Number(formData.movieId))) {
    return { error: "معرف الفيلم غير صحيح" }
  }

  const cleanContent = DOMPurify.sanitize(formData.content)
  const excerpt = await generateArticleSummary(cleanContent)
  
  const finalSlug = formData.slug || (formData.title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0600-\u06FF-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "") + "-" + Math.random().toString(36).substring(2, 7))

  const { error } = await supabase.from("articles").insert([{
    title: formData.title,
    slug: finalSlug,
    content: cleanContent,
    excerpt,
    category: formData.category,
    image_url: formData.imageUrl || null,
    movie_id: formData.movieId ? Number(formData.movieId) : null,
    author_id: user.id,
    isBreaking: formData.isBreaking,
    is_published: formData.isPublished,
    status: formData.isPublished ? 'published' : 'draft',
    approved_by: user.id,
    published_at: formData.isPublished ? new Date().toISOString() : null,
    is_ai_generated: formData.isAiGenerated || false,
    ai_confidence_score: formData.aiConfidenceScore || 0
  }])

  if (error) return { error: error.message }

  revalidatePath("/admin/articles")
  revalidatePath("/news")
  return { success: true }
}

/**
 * AI Content Engine: Generates full article content for a movie
 */
export async function generateAIArticleContent(movieTitle: string) {
    const supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()
    if (!authData?.user) return { error: "غير مصرح لك" }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .maybeSingle()

    if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
        return { error: "صلاحيات غير كافية" }
    }

    const { generateFullMovieArticle } = await import("@/lib/ai")
    return await generateFullMovieArticle(movieTitle)
}

/**
 * Hybrid Content: Saves an external article link
 */
export async function addExternalArticle(data: {
    title: string
    sourceName: string
    sourceUrl: string
    imageUrl?: string
    movieId: number
    excerpt?: string
    expertCommentary?: string
}) {
    const supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()
    if (!authData?.user) return { error: "غير مصرح لك" }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .maybeSingle()

    if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
        return { error: "صلاحيات غير كافية" }
    }

    const { error } = await supabase.from("external_articles").insert([{
        title: data.title,
        source_name: data.sourceName,
        source_url: data.sourceUrl,
        image_url: data.imageUrl,
        movie_id: data.movieId,
        excerpt: data.excerpt,
        expert_commentary: data.expertCommentary
    }])

    if (error) return { error: error.message }

    revalidatePath(`/movie/${data.movieId}`)
    return { success: true }
}
