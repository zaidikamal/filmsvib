"use client"

import { useEffect, useState } from "react"
import { getUserProfile } from "@/app/actions/user"

export default function UserLevel() {
    const [profile, setProfile] = useState<any>(null)

    useEffect(() => {
        async function fetchProfile() {
            const data = await getUserProfile()
            setProfile(data)
        }
        fetchProfile()
    }, [])

    if (!profile) return null

    return (
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
            <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-500 font-black uppercase">Level</span>
                <span className="text-sm font-black text-white">{profile.level}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#fef3c7] flex items-center justify-center text-black font-black text-xs shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                {profile.points}
            </div>
        </div>
    )
}
