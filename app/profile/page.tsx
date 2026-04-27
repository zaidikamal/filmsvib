"use client"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [watchlists, setWatchlists] = useState<any[]>([])
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [mounted, setMounted] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function loadProfileData() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/auth")
        return
      }

      setUser(user)

      // Get Profile details
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      setProfile(profileData)

      // Get Watchlists
      const { data: watchData } = await supabase
        .from('watchlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (watchData) setWatchlists(watchData)

      // Get Bookmarked Articles
      const { data: bookmarkData } = await supabase
        .from('article_bookmarks')
        .select(`
          id, created_at,
          articles:article_id (id, title, slug, cover_image)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (bookmarkData) setBookmarks(bookmarkData)

      setLoading(false)
    }

    setMounted(true)
    loadProfileData()
  }, [supabase, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen pt-32 pb-16 bg-[#0a0a0f]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Header */}
        <div className="bg-[#12121a] rounded-3xl p-8 border border-white/5 shadow-2xl mb-8 flex flex-col md:flex-row items-center gap-8 text-center md:text-right relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-purple-800/30 to-red-800/30 blur-3xl rounded-full mix-blend-screen opacity-50"></div>
          
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-red-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30 z-10">
            <span className="text-white text-5xl font-bold">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          
          <div className="flex-1 z-10">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                 <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                   {user?.email?.split('@')[0] || 'المستخدم الذهبي'}
                 </h1>
                 <p className="text-gray-400 mb-2">{user?.email}</p>
                 <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                   <span className="bg-white/5 border border-white/10 px-4 py-1 rounded-full text-sm font-bold text-gray-300">
                     المستوى: <span className="text-purple-400">{profile?.role === 'admin' ? 'مدير' : 'عضو فضي'}</span>
                   </span>
                   <span className="bg-white/5 border border-white/10 px-4 py-1 rounded-full text-sm font-bold text-gray-300">
                     تاريخ الانضمام: {mounted ? new Date(user?.created_at).getFullYear() : '...'}
                   </span>
                 </div>
              </div>
              <button onClick={handleSignOut} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-6 py-2 rounded-full font-bold transition-all text-sm flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs & Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-64 shrink-0">
             <div className="bg-[#12121a] rounded-3xl p-4 border border-white/5 flex flex-row lg:flex-col gap-2 overflow-x-auto">
                <button onClick={() => setActiveTab('overview')} className={`flex items-center justify-start gap-3 px-6 py-4 rounded-2xl font-bold transition-all whitespace-nowrap ${activeTab === 'overview' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                  <span>📊</span> نظرة عامة
                </button>
                <button onClick={() => setActiveTab('watchlists')} className={`flex items-center justify-start gap-3 px-6 py-4 rounded-2xl font-bold transition-all whitespace-nowrap ${activeTab === 'watchlists' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                  <span>🍿</span> المفضلة ({watchlists.length})
                </button>
                <button onClick={() => setActiveTab('bookmarks')} className={`flex items-center justify-start gap-3 px-6 py-4 rounded-2xl font-bold transition-all whitespace-nowrap ${activeTab === 'bookmarks' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                  <span>🔖</span> المقالات المحفوظة ({bookmarks.length})
                </button>
                {(profile?.role?.toLowerCase() === 'admin' || user?.email === 'fr.capsules20@gmail.com') && (
                  <Link href="/admin/articles/create" className="flex items-center justify-start gap-3 px-6 py-4 rounded-2xl font-bold transition-all whitespace-nowrap text-gray-400 hover:bg-white/5 hover:text-white mt-auto pt-8 border-t border-white/5">
                    <span>✍️</span> كتابة مقال (إدارة)
                  </Link>
                )}
             </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {activeTab === 'overview' && (
               <div className="space-y-8 animate-fade-in-up">
                 <h2 className="text-2xl font-bold text-white mb-6">إحصائيات حسابك</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="bg-gradient-to-br from-indigo-900/40 to-[#12121a] p-8 rounded-3xl border border-indigo-500/20 text-center">
                     <span className="text-5xl block mb-4">🍿</span>
                     <h3 className="text-4xl font-black text-white mb-2">{watchlists.length}</h3>
                     <p className="text-indigo-300 font-bold">أفلام في المفضلة</p>
                   </div>
                   <div className="bg-gradient-to-br from-emerald-900/40 to-[#12121a] p-8 rounded-3xl border border-emerald-500/20 text-center">
                     <span className="text-5xl block mb-4">🔖</span>
                     <h3 className="text-4xl font-black text-white mb-2">{bookmarks.length}</h3>
                     <p className="text-emerald-300 font-bold">مقالات محفوظة</p>
                   </div>
                   <div className="bg-gradient-to-br from-amber-900/40 to-[#12121a] p-8 rounded-3xl border border-amber-500/20 text-center">
                     <span className="text-5xl block mb-4">⭐</span>
                     <h3 className="text-4xl font-black text-white mb-2">0</h3>
                     <p className="text-amber-300 font-bold">تقييمات كتبتها</p>
                   </div>
                 </div>
               </div>
            )}

            {activeTab === 'watchlists' && (
               <div className="animate-fade-in-up">
                 <div className="flex justify-between items-center mb-6">
                   <h2 className="text-2xl font-bold text-white">الأفلام المفضلة</h2>
                   <Link href="/watchlist" className="text-purple-400 hover:text-purple-300 text-sm font-bold flex items-center gap-1">
                     إدارة المفضلة
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                     </svg>
                   </Link>
                 </div>
                 {watchlists.length === 0 ? (
                   <div className="text-center py-16 bg-[#12121a] rounded-3xl border border-white/5">
                     <p className="text-gray-400 mb-4">لم تقم بإضافة أي أفلام للمفضلة بعد.</p>
                     <Link href="/" className="text-purple-400 font-bold hover:underline">استكشف الأفلام</Link>
                   </div>
                 ) : (
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                     {watchlists.slice(0, 8).map((item) => (
                       <Link href={`/movie/${item.movie_id}`} key={item.id} className="group relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/10">
                         <Image 
                           src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/placeholder-image.jpg'}
                           alt={item.movie_title}
                           fill
                           className="object-cover group-hover:scale-110 transition-transform duration-500"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                           <span className="text-white font-bold text-sm line-clamp-2">{item.movie_title}</span>
                         </div>
                       </Link>
                     ))}
                   </div>
                 )}
               </div>
            )}

            {activeTab === 'bookmarks' && (
               <div className="animate-fade-in-up">
                 <h2 className="text-2xl font-bold text-white mb-6">المقالات المحفوظة للرجوع إليها</h2>
                 {bookmarks.length === 0 ? (
                   <div className="text-center py-16 bg-[#12121a] rounded-3xl border border-white/5">
                     <p className="text-gray-400 mb-4">ليس لديك أي مقالات محفوظة.</p>
                     <Link href="/news" className="text-purple-400 font-bold hover:underline">تصفح أحدث الأخبار والمقالات</Link>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {bookmarks.map((bookmark) => {
                       const article = bookmark.articles;
                       return (
                         <Link href={`/news/${article.slug}`} key={bookmark.id} className="group bg-[#12121a] rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/50 transition-all flex shadow-lg h-32">
                           <div className="relative w-32 h-full bg-black shrink-0">
                             <Image 
                               src={article.cover_image || "/placeholder-hero.jpg"}
                               alt={article.title}
                               fill
                               className="object-cover"
                             />
                           </div>
                            <div className="p-4 flex flex-col justify-center">
                              <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                                {article.title}
                              </h3>
                              <p className="text-xs text-gray-500">
                                تم الحفظ في: {mounted ? new Date(bookmark.created_at).toLocaleDateString("ar-SA") : '...'}
                              </p>
                            </div>
                         </Link>
                       )
                     })}
                   </div>
                 )}
               </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
