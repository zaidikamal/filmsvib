"use client"
import { useState, useEffect, useRef } from "react"
import { getNotifications, markAsRead, markAllAsRead } from "@/app/actions/notifications"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.is_read).length

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await getNotifications()
      setNotifications(data)
    }
    fetchNotifications()

    // Refresh every 30 seconds for simplicity (real-time would be better but let's start here)
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleMarkRead = async (id: string) => {
    await markAsRead(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  const handleMarkAllRead = async () => {
    await markAllAsRead()
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0a0a0f] animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 mt-4 w-80 bg-[#12121a]/95 backdrop-blur-xl border border-white/10 rounded-[1.5rem] shadow-2xl overflow-hidden z-[100]"
          >
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
              <span className="text-sm font-bold text-white">الإشعارات 📩</span>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllRead}
                  className="text-[10px] text-[#d4af37] hover:underline font-bold"
                >
                  تحديد الكل كمقروء
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-10 text-center text-gray-500 italic text-sm">
                  لا توجد إشعارات حالياً
                </div>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer relative ${!n.is_read ? 'bg-[#d4af37]/5' : ''}`}
                    onClick={() => handleMarkRead(n.id)}
                  >
                    {!n.is_read && (
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#d4af37] rounded-full shadow-[0_0_5px_#d4af37]" />
                    )}
                    <h4 className={`text-xs font-black mb-1 ${!n.is_read ? 'text-[#d4af37]' : 'text-gray-300'}`}>
                      {n.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed mb-2">
                      {n.message}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-gray-600 font-mono">
                        {new Date(n.created_at).toLocaleTimeString("ar-SA", { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {n.link && (
                        <Link 
                          href={n.link} 
                          className="text-[9px] font-black text-[#d4af37] hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkRead(n.id);
                            setShowDropdown(false);
                          }}
                        >
                          عرض التفاصيل ←
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <Link 
              href="/profile/notifications" 
              className="block p-3 text-center text-[10px] font-bold text-gray-500 hover:text-white bg-white/5 transition-colors"
              onClick={() => setShowDropdown(false)}
            >
              عرض كل الإشعارات
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
