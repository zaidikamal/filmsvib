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
  const { data: authData } = await supabase.auth.getUser()
  const user = authData?.user
  if (!user) return { error: "يجب تسجيل الدخول أولاً" }

  // 2. Verify Admin Role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()
    
  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    return { error: "غير مصرح لك بحذف المقالات" }
  }

  // 3. Perform Deletion
  const { error } = await supabase
    .from("articles")
    .delete()
    .eq("id", id)

  if (error) return { error: error.message }

  // 4. Revalidate
  revalidatePath("/admin/articles")
  revalidatePath("/news")
  
  return { success: true }
}
