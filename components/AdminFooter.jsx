'use client';

import Image from 'next/image';

export default function AdminFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 border-t border-yellow-300/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden ring-2 ring-yellow-300/70">
              <Image
                src="/logo.png"
                alt="Proverhuis Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold text-white">Proverhuis</p>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>

          {/* Copyright and Links */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="text-xs sm:text-sm text-gray-400 text-center">
              © {currentYear} Proverhuis. All rights reserved.
            </div>
            <div className="flex space-x-4 text-xs sm:text-sm">
              <a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors">
                Help
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-300 transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
