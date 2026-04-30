"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  link: string
  is_read: boolean
  created_at: string
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [hasNew, setHasNew] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // 1. جلب الإشعارات القديمة غير المقروءة
    const fetchNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (data) {
        setNotifications(data)
        setHasNew(data.some(n => !n.is_read))
      }
    }

    fetchNotifications()

    // 2. الاشتراك في التنبيهات اللحظية (Realtime)
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          const newNotif = payload.new as Notification
          setNotifications(prev => [newNotif, ...prev.slice(0, 9)])
          setHasNew(true)
          
          // تشغيل صوت تنبيه بسيط (اختياري)
          if (typeof window !== 'undefined') {
            const audio = new Audio('/notification-sound.mp3')
            audio.play().catch(() => {}) // منع الخطأ إذا لم يتفاعل المستخدم مع الصفحة بعد
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const markAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)

    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setHasNew(false)
  }

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button 
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen && hasNew) markAsRead()
        }}
        className="relative p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
      >
        <span className="text-xl group-hover:rotate-12 transition-transform block">🔔</span>
        {hasNew && (
          <span className="absolute top-2 right-2 w-3 h-3 bg-red-600 rounded-full border-2 border-[#0a0a0f] animate-pulse"></span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-0 mt-4 w-80 md:w-96 bg-[#12121a] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden z-[100] backdrop-blur-xl"
          >
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
              <h3 className="font-bold text-white font-cairo">التنبيهات</h3>
              <span className="text-[10px] bg-white/10 px-2 py-1 rounded-full text-gray-400">
                {notifications.length} إشعار
              </span>
            </div>

            <div className="max-h-[400px] overflow-y-auto no-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-12 text-center text-gray-600 italic">
                  <div className="text-4xl mb-2 opacity-20">📭</div>
                  لا توجد تنبيهات جديدة
                </div>
              ) : (
                notifications.map((notif) => (
                  <Link 
                    key={notif.id}
                    href={notif.link || '#'}
                    onClick={() => setIsOpen(false)}
                    className={`block p-6 border-b border-white/5 hover:bg-white/[0.03] transition-colors ${!notif.is_read ? 'bg-purple-500/[0.03]' : ''}`}
                  >
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center ${
                        notif.type === 'success' ? 'bg-green-500/20 text-green-500' : 
                        notif.type === 'warning' ? 'bg-orange-500/20 text-orange-500' : 
                        'bg-blue-500/20 text-blue-500'
                      }`}>
                        {notif.type === 'success' ? '✅' : notif.type === 'warning' ? '⚠️' : 'ℹ️'}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white font-cairo">{notif.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{notif.message}</p>
                        <span className="text-[9px] text-gray-700 block pt-1">
                          {new Date(notif.created_at).toLocaleTimeString("ar-SA", { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            <div className="p-4 text-center bg-white/[0.01]">
              <button className="text-xs text-gray-500 hover:text-white transition-colors font-bold">
                مشاهدة جميع الإشعارات
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
