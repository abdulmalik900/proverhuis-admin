'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  useEffect(() => {
    const storedUsername = sessionStorage.getItem('adminUsername');
    setUsername(storedUsername || 'Admin');
  }, []);

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem('isAdminLoggedIn');
    sessionStorage.removeItem('adminUsername');
    sessionStorage.removeItem('loginTime');
    
    // Redirect to login page
    router.push('/');
  };
  
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: '🏠' },
    { name: 'Authors', path: '/admin/authors', icon: '👥' },
    { name: 'Posts', path: '/admin/posts', icon: '📝' }
  ];

  return (
    <nav className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 border-b border-yellow-300/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-auto">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 sm:space-x-3 py-3">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-2 ring-yellow-300/70 shadow-lg flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Proverhuis Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-yellow-300">Proverhuis</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-4 xl:px-6 py-4 font-medium transition-all border-b-2 text-sm xl:text-base ${
                    isActive
                      ? 'text-yellow-300 border-yellow-300'
                      : 'text-gray-300 border-transparent hover:text-white hover:border-yellow-300/50'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}

            {/* Desktop User Menu */}
            <div className="relative ml-6">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg bg-yellow-300/10 hover:bg-yellow-300/20 border border-yellow-300/30 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-amber-400 flex items-center justify-center text-gray-800 font-bold text-sm">
                  {username.charAt(0).toUpperCase()}
                </div>
                <span className="text-white text-sm font-medium hidden xl:inline">{username}</span>
                <svg className={`w-4 h-4 text-yellow-300 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Desktop Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-800">{username}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            {/* Mobile User Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-amber-400 flex items-center justify-center text-gray-800 font-bold text-sm">
              {username.charAt(0).toUpperCase()}
            </div>
            
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-gray-300 hover:text-white p-2"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden pb-4 border-t border-yellow-300/20 mt-2 pt-2">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-yellow-300/20 text-yellow-300'
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    }`}
                  >
                    <span className="mr-3 text-xl">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobile User Info */}
              <div className="px-4 py-3 bg-gray-700/50 rounded-lg mt-4">
                <p className="text-xs text-gray-400">Signed in as</p>
                <p className="text-sm font-semibold text-white">{username}</p>
              </div>

              {/* Mobile Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
