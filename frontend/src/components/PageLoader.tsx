import React from "react";
import { useLoading } from "../context/LoadingContext";

const PageLoader: React.FC = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none">
      {/* Top progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 origin-left animate-pulse" 
           style={{
             animation: "slideInOut 0.6s ease-in-out"
           }} />
      
      {/* Optional: Loading overlay with fade */}
      <div className="absolute inset-0 bg-white/30 dark:bg-gray-950/10 backdrop-blur-sm animate-fadeIn">
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-4">
            {/* Spinner */}
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-gray-200 dark:border-gray-700"></div>
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-600 dark:border-t-indigo-400 animate-spin"></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
              Loading...
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInOut {
          0% {
            transform: scaleX(0);
          }
          50% {
            transform: scaleX(1);
          }
          100% {
            transform: scaleX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PageLoader;
