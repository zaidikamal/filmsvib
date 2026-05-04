"use client"

import dynamic from "next/dynamic"

const EditArticleForm = dynamic(() => import("./EditArticleForm"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse h-[600px] w-full bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center">
        <div className="text-gray-500 font-royal">جاري تحميل بيانات المقال...</div>
    </div>
  ),
})

export default function EditArticleClient({ article, userId }: { article: any, userId: string }) {
  return <EditArticleForm article={article} userId={userId} />
}
