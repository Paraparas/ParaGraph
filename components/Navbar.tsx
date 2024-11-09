"use client";

import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  
  return (
    <nav className="mb-4 px-4 py-3 bg-gradient-to-r from-blue-900 to-slate-900 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🧠</span>
          <span className="text-xl font-semibold text-white">Para Research Navigator</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <a 
            className={`px-3 py-1 rounded-md transition-colors duration-200 ${
              pathname === "/" 
                ? "bg-blue-700 text-white" 
                : "text-blue-200 hover:bg-blue-800"
            }`} 
            href="/"
          >
            💬 Chat
          </a>
          <a 
            className={`px-3 py-1 rounded-md transition-colors duration-200 ${
              pathname === "/timeline" 
                ? "bg-blue-700 text-white" 
                : "text-blue-200 hover:bg-blue-800"
            }`} 
            href="/timeline"
          >
            📊 Research Timeline
          </a>
          <a 
            className={`px-3 py-1 rounded-md transition-colors duration-200 ${
              pathname === "/about" 
                ? "bg-blue-700 text-white" 
                : "text-blue-200 hover:bg-blue-800"
            }`} 
            href="/about"
          >
            ℹ️ About
          </a>
        </div>
      </div>
    </nav>
  );
}