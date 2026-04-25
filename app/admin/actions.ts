"use server"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

/**
 * Server Action to delete an article.
 * Includes security checks for admin role.
 */
export async function deleteArticle(id: string) {
  const supabase = await createClient()
  
  // 1. Verify User Session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("يجب تسجيل الدخول أولاً")

  // 2. Verify Admin Role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
    
  if (profile?.role !== "admin") {
    throw new Error("غير مصرح لك بحذف المقالات")
  }

  // 3. Perform Deletion
  const { error } = await supabase
    .from("articles")
    .delete()
    .eq("id", id)

  if (error) throw error

  // 4. Revalidate
  revalidatePath("/admin/articles")
  revalidatePath("/news")
  
  return { success: true }
}
