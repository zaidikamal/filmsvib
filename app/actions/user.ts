"use server"

import { createClient } from "@/utils/supabase/server"

export async function awardPoints(points: number, reason: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    // Increment points
    const { data: profile } = await supabase
        .from("profiles")
        .select("points, level")
        .eq("id", user.id)
        .maybeSingle()

    if (!profile) return

    const newPoints = (profile.points || 0) + points
    const newLevel = Math.floor(newPoints / 100) + 1

    await supabase
        .from("profiles")
        .update({ 
            points: newPoints, 
            level: newLevel,
            updated_at: new Date().toISOString()
        })
        .eq("id", user.id)
}

export async function getUserProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()
    
    return data
}
