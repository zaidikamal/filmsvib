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
          className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-red-500 transition-colors"
        >
          إنهـاء الجلسـة
        </button>
      </div>
    )
  }

  return (
    <Link href="/auth" className="relative group">
      <div className="absolute -inset-0.5 bg-gold-dark blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
      <button className="relative bg-white text-black px-10 py-3 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gold-light transition-all shadow-xl">
        دخول المركز
      </button>
    </Link>
  )
}
