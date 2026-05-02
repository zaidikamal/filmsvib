"use server"

import { createClient } from "@/utils/supabase/server"
import DOMPurify from "isomorphic-dompurify"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

export async function submitArticle(formData: {
  title: string
  content: string
  category: string
  imageUrl?: string
}) {
  const supabase = await createClient()
  
  // 1. Auth & Atomic Rate Limiting
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error("يجب تسجيل الدخول أولاً")

  // Fetch current profile to check rate limit
  const { data: profile } = await supabase
    .from("profiles")
    .select("last_submission_at")
    .eq("id", user.id)
    .single()

  const now = new Date()
  if (profile?.last_submission_at) {
    const lastSub = new Date(profile.last_submission_at).getTime()
    const diff = (now.getTime() - lastSub) / 1000
    
    if (diff < 60) {
       throw new Error(`يرجى الانتظار ${Math.ceil(60 - diff)} ثانية قبل إرسال مقال آخر`)
    }
  }

  // 2. Server-Side Sanitization & Slug Generation with Collision Retry
  const cleanContent = DOMPurify.sanitize(formData.content)
  
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
      category: formData.category,
      image_url: formData.imageUrl || null,
      author_id: user.id,
      status: 'pending'
    }])

    if (!insertError) {
      success = true
    } else if (insertError.code === '23505') { // Unique violation
      attempts++
    } else {
      throw new Error(insertError.message)
    }
  }

  if (!success) {
    console.error({ 
      action: "submit_article_failed", 
      user: user.id, 
      title: formData.title,
      attempts 
    })
    throw new Error("فشل توليد رابط فريد للمقال، يرجى تغيير العنوان قليلاً")
  }

  // Update last_submission_at
  await supabase
    .from("profiles")
    .update({ last_submission_at: now.toISOString() })
    .eq("id", user.id)

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
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("غير مصرح لك")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
     throw new Error("صلاحيات غير كافية")
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

  if (updateError) throw new Error(updateError.message)

  // Fetch article info for notification
  const { data: article } = await supabase
    .from("articles")
    .select("title, author_id, slug")
    .eq("id", articleId)
    .single()

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
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("يجب تسجيل الدخول")

  // Check if owner or admin
  const { data: article } = await supabase
    .from("articles")
    .select("author_id")
    .eq("id", articleId)
    .single()

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  const isOwner = article?.author_id === user.id
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'

  if (!isOwner && !isAdmin) throw new Error("غير مصرح لك بحذف هذا المقال")

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
    throw new Error(error.message)
  }

  revalidatePath("/admin/articles")
  revalidatePath("/news")
  revalidatePath("/news/my-articles")
  return { success: true }
}

export async function incrementArticleViews(articleId: string) {
  const supabase = await createClient()
  
  // Try to get user ID if logged in
  const { data: { user } } = await supabase.auth.getUser()
  
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
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("غير مصرح لك")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
     throw new Error("صلاحيات غير كافية")
  }

  const cleanContent = DOMPurify.sanitize(formData.content)
  const slug = formData.title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0600-\u06FF-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "") + "-" + Math.random().toString(36).substring(2, 7)

  const { error } = await supabase.from("articles").insert([{
    title: formData.title,
    slug,
    content: cleanContent,
    category: formData.category,
    image_url: formData.imageUrl || null,
    author_id: user.id,
    is_breaking: formData.isBreaking,
    is_published: formData.isPublished,
    status: formData.isPublished ? 'published' : 'draft',
    approved_by: user.id,
    published_at: formData.isPublished ? new Date().toISOString() : null
  }])

  if (error) throw new Error(error.message)

  revalidatePath("/admin/articles")
  revalidatePath("/news")
  return { success: true }
}
