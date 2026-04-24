"use client"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

const ROLE_LABELS: Record<string, string> = {
  user: "عضو عادي",
  author: "كاتب",
  admin: "مدير"
}

const ROLE_COLORS: Record<string, string> = {
  user: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  author: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  admin: "bg-purple-500/20 text-purple-400 border-purple-500/30"
}

export default function RoleChanger({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [role, setRole] = useState(currentRole)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleChange = async (newRole: string) => {
    if (newRole === role) { setOpen(false); return }
    setLoading(true)
    setOpen(false)
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId)
    if (!error) {
      setRole(newRole)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${ROLE_COLORS[role] || ROLE_COLORS.user} hover:scale-105 active:scale-95`}
      >
        {loading ? "..." : (ROLE_LABELS[role] || role)}
        <span className="mr-1 opacity-60">▾</span>
      </button>

      {open && (
        <div className="absolute left-0 mt-1 w-32 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
          {Object.entries(ROLE_LABELS).map(([val, label]) => (
            <button
              key={val}
              onClick={() => handleChange(val)}
              className={`w-full text-right px-4 py-2 text-sm hover:bg-white/10 transition-colors ${role === val ? "text-purple-400 font-bold" : "text-gray-300"}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
