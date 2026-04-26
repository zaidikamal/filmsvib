import { cache } from 'react'
import { createClient } from './server'

/**
 * جلب بيانات البروفايل مع التخزين المؤقت (Memoization)
 * هذا يضمن عدم تكرار طلب قاعدة البيانات في نفس الـ Request
 */
export const getProfile = cache(async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
    
  return profile
})
