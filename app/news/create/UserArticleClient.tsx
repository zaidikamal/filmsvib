"use client"

import dynamic from "next/dynamic"

const UserArticleForm = dynamic(() => import("./UserArticleForm"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse h-[600px] w-full bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center">
        <div className="text-gray-500 font-royal">جاري تجهيز محرر المقالات...</div>
    </div>
  ),
})

export default function UserArticleClient({ userId }: { userId: string }) {
  return <UserArticleForm userId={userId} />
}
