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
        <button 
          onClick={handleLogout}
          className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-red-500 transition-colors"
        >
          Termination
        </button>
      </div>
    )
  }

  return (
    <Link href="/auth" className="bg-white text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl">
      Access Hub
    </Link>
  )
}
