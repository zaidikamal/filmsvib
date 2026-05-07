"use client";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050507] flex flex-col items-center justify-center">
      <div className="w-16 h-1 border-gray-800 bg-gray-800 rounded-full overflow-hidden relative">
        <div className="absolute inset-0 bg-[#d4af37] animate-loading-bar" />
      </div>
      <p className="mt-6 text-gray-500 font-bold text-xs uppercase tracking-widest animate-pulse font-arabic">
        جاري جلب أحدث التقارير...
      </p>
      <style jsx>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
