"use server"

import { createClient } from "@/utils/supabase/server"
import DOMPurify from "isomorphic-dompurify"
import { revalidatePath } from "next/cache"

export async function submitArticle(formData: {
  title: string
  content: string
  category: string
  imageUrl?: string
}) {
  const supabase = await createClient()
  
  // 1. Auth & Rate Limiting Check
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error("يجب تسجيل الدخول أولاً")

  // Rate Limiting: Fetch last submission
  const { data: profile } = await supabase
    .from("profiles")
    .select("last_submission_at")
    .eq("id", user.id)
    .single()

  if (profile?.last_submission_at) {
    const lastSub = new Date(profile.last_submission_at).getTime()
    const now = new Date().getTime()
    const diff = (now - lastSub) / 1000 // seconds
    
    if (diff < 60) { // 60 seconds rate limit
       throw new Error(`يرجى الانتظار ${Math.ceil(60 - diff)} ثانية قبل إرسال مقال آخر`)
    }
  }

  // 2. Server-Side Sanitization
  const cleanContent = DOMPurify.sanitize(formData.content)
  const slug = formData.title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0600-\u06FF-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "") + "-" + Date.now()

  // 3. Database Insertion
  const { error: insertError } = await supabase.from("articles").insert([{
    title: formData.title,
    slug,
    content: cleanContent,
    category: formData.category,
    image_url: formData.imageUrl || null,
    author_id: user.id,
    status: 'pending'
  }])

  if (insertError) throw new Error(insertError.message)

  // 4. Update last submission time in profile
  await supabase
    .from("profiles")
    .update({ last_submission_at: new Date().toISOString() })
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
  
  // 1. Admin Auth Check
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

  // 2. Perform Action with Audit Trail
  const updates: any = {
    status: action === 'publish' ? 'published' : 'rejected',
    rejection_reason: action === 'reject' ? reason : null,
    [action === 'publish' ? 'approved_by' : 'rejected_by']: user.id,
    published_at: action === 'publish' ? new Date().toISOString() : null,
    is_published: action === 'publish' // For backward compatibility if needed
  }

  const { error } = await supabase
    .from("articles")
    .update(updates)
    .eq("id", articleId)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/articles")
  revalidatePath("/news")
  return { success: true }
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
  
  // 1. Admin Auth Check
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

  // 2. Server-Side Sanitization
  const cleanContent = DOMPurify.sanitize(formData.content)
  const slug = formData.title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0600-\u06FF-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "") + "-" + Date.now()

  // 3. Database Insertion
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
