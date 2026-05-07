"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // If the error is a redirect, we shouldn't catch it
    if (error.message?.includes("NEXT_REDIRECT")) {
      window.location.href = error.message.replace("NEXT_REDIRECT;replace;", "").replace("NEXT_REDIRECT;push;", "");
      return;
    }
    // سجل الخطأ في وحدة التحكم أو خدمة مراقبة
    console.error("Critical Server Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-center items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1a1a1a] border border-purple-500/20 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2 font-arabic">عذراً، حدث خطأ غير متوقع</h1>
        <p className="text-gray-400 mb-6 font-arabic">
          نواجه مشكلة في عرض هذه الصفحة حالياً. فريقنا التقني يعمل على حلها.
        </p>

        {error.digest && (
          <div className="bg-black/40 rounded-lg p-3 mb-4 text-xs text-purple-400 font-mono break-all">
            Error ID: {error.digest}
          </div>
        )}

        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 text-left overflow-auto max-h-40">
          <p className="text-red-400 text-xs font-mono break-all">
            {error.message || "No specific error message available"}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            إعادة المحاولة
          </button>
          <Link
            href="/"
            className="text-gray-500 hover:text-white text-sm transition-colors duration-300"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
