"use client"

import dynamic from "next/dynamic"

const CreateArticleForm = dynamic(() => import("./CreateArticleForm"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse h-[600px] w-full bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center">
        <div className="text-gray-500 font-royal">جاري تحميل المحرر السينمائي...</div>
    </div>
  ),
})

export default function CreateArticleClient({ userId }: { userId: string }) {
  return <CreateArticleForm userId={userId} />
}
