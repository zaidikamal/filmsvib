"use client"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AuthButton({ user }: { user: any }) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push("/")
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400 hidden md:inline-block">متصل كـ {user.email?.split("@")[0]}</span>
        <button 
          onClick={handleLogout}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-bold transition-all border border-white/5"
        >
          خروج
        </button>
      </div>
    )
  }

  return (
    <Link href="/auth" className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 px-6 py-2 rounded-full text-sm font-bold transition-all shadow-lg text-white whitespace-nowrap">
      دخول
    </Link>
  )
}
