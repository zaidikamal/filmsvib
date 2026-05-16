"use client"
import { useState, Suspense } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  
  const redirectTo = searchParams.get("redirect") || "/"

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          setError(error.message)
        } else {
          router.push(redirectTo)
          router.refresh()
        }
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          }
        })
        if (error) {
          setError(error.message)
        } else {
          setSuccess("تم إنشاء الحساب بنجاح! يرجى مراجعة بريدك الإلكتروني (قد تجد الرسالة في الـ Junk).")
          setIsLogin(true)
        }
      }
    } catch (err) {
      setError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-10 md:p-16 rounded-[3rem] w-full max-w-xl shadow-2xl relative overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#4c1d95]/20 rounded-full blur-[100px] group-hover:bg-[#4c1d95]/30 transition-all duration-700" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-[100px] group-hover:bg-[#d4af37]/20 transition-all duration-700" />
      
      <div className="text-center mb-12">
        <Link href="/" className="inline-block mb-8">
           <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4c1d95] to-black flex items-center justify-center border border-[#d4af37]/30 shadow-xl mx-auto">
              <span className="text-[#d4af37] font-black text-2xl">F</span>
           </div>
        </Link>
        <h2 className="text-4xl font-black text-white mb-4 font-royal tracking-tight">
          {isLogin ? "تسجيل الدخول" : "انضم لـ Filmsvib"}
        </h2>
        <p className="text-gray-500 font-medium">
          {isLogin ? "مرحباً بعودتك لعالم السينما الفاخر" : "ابدأ رحلتك في أكبر مجتمع سينمائي عربي"}
        </p>
      </div>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-6 text-sm flex items-center gap-3 animate-shake">
          <span>⚠️</span> {error}
        </div>
      )}
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-2xl mb-6 text-sm flex items-center gap-3">
          <span>✅</span> {success}
        </div>
      )}

      <form onSubmit={handleAuth} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-gray-400 text-xs font-black uppercase tracking-widest mr-2">البريد الإلكتروني</label>
          <input
            type="email"
            required
            placeholder="example@filmsvib.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white rounded-2xl p-4 focus:outline-none focus:border-[#d4af37]/50 focus:bg-white/10 transition-all placeholder:text-gray-700"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-gray-400 text-xs font-black uppercase tracking-widest mr-2">كلمة المرور</label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white rounded-2xl p-4 focus:outline-none focus:border-[#d4af37]/50 focus:bg-white/10 transition-all placeholder:text-gray-700"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-royal-gold py-5 rounded-2xl mt-4 flex justify-center items-center gap-3 shadow-[0_10px_30px_rgba(212,175,55,0.1)]"
        >
          {loading ? (
            <span className="w-6 h-6 border-3 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              <span className="text-lg">{isLogin ? "دخول" : "إنشاء حساب"}</span>
              <span className="opacity-50">⚡</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-gray-500 text-sm font-medium">
          {isLogin ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#d4af37] font-black hover:underline ml-1"
          >
            {isLogin ? "سجل الآن مجاناً" : "سجل الدخول لحسابك"}
          </button>
        </p>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4 bg-[#0a0a0f] relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#4c1d95] blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#d4af37] blur-[150px] rounded-full animate-pulse-slow" />
      </div>

      <Suspense fallback={<div className="text-white">جاري التحميل...</div>}>
        <AuthForm />
      </Suspense>
    </div>
  )
}
