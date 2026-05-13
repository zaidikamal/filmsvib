import { cache } from 'react'
import { createClient } from './server'

/**
 * جلب بيانات البروفايل مع التخزين المؤقت (Memoization)
 * هذا يضمن عدم تكرار طلب قاعدة البيانات في نفس الـ Request
 */
export const getProfile = cache(async () => {
  try {
    const supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()
    const user = authData?.user
    
    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
      
    return profile
  } catch (e) {
    return null
  }
})
