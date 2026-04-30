export default function AdminLoading() {
  return (
    <div className="space-y-10 animate-pulse pb-12">
      <div className="flex justify-between items-center">
        <div className="space-y-3">
          <div className="h-10 bg-white/5 rounded-2xl w-64" />
          <div className="h-4 bg-white/5 rounded-full w-96" />
        </div>
        <div className="h-12 bg-white/5 rounded-2xl w-40" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-44 bg-[#12121a] border border-white/5 rounded-[2.5rem]" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-[600px] bg-[#12121a] border border-white/5 rounded-[2.5rem]" />
        <div className="h-[600px] bg-[#12121a] border border-white/5 rounded-[2.5rem]" />
      </div>
    </div>
  )
}
