'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminNav from '@/components/AdminNav';
import AdminFooter from '@/components/AdminFooter';

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalAuthors: 0,
    activeAuthors: 0,
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0
  });
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isAdminLoggedIn');
    if (isLoggedIn !== 'true') {
      router.push('/');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch authors
      const authorsRes = await fetch('/api/authors');
      const authorsData = await authorsRes.json();
      
      // Fetch posts
      const postsRes = await fetch('/api/posts');
      const postsData = await postsRes.json();
      
      if (authorsData.success && postsData.success) {
        const authors = authorsData.data;
        const posts = postsData.data;
        
        setStats({
          totalAuthors: authors.length,
          activeAuthors: authors.filter(a => a.isActive).length,
          totalPosts: posts.length,
          publishedPosts: posts.filter(p => p.status === 'published').length,
          draftPosts: posts.filter(p => p.status === 'draft').length
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Total Authors',
      value: stats.totalAuthors,
      subtitle: `${stats.activeAuthors} active`,
      icon: '👥',
      gradient: 'from-yellow-400 via-amber-400 to-yellow-300',
      bgLight: 'bg-yellow-50',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-amber-500',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200',
      link: '/admin/authors'
    },
    {
      title: 'Total Posts',
      value: stats.totalPosts,
      subtitle: 'All blog posts',
      icon: '📝',
      gradient: 'from-amber-400 via-orange-400 to-amber-300',
      bgLight: 'bg-amber-50',
      iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200',
      link: '/admin/posts'
    },
    {
      title: 'Published',
      value: stats.publishedPosts,
      subtitle: 'Live posts',
      icon: '✅',
      gradient: 'from-green-400 via-emerald-400 to-green-300',
      bgLight: 'bg-green-50',
      iconBg: 'bg-gradient-to-br from-green-400 to-emerald-500',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      link: '/admin/posts'
    },
    {
      title: 'Drafts',
      value: stats.draftPosts,
      subtitle: 'Unpublished',
      icon: '📄',
      gradient: 'from-orange-400 via-red-400 to-orange-300',
      bgLight: 'bg-orange-50',
      iconBg: 'bg-gradient-to-br from-orange-400 to-red-500',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
      link: '/admin/posts'
    }
  ];

  // Don't render until authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Checking authentication...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <AdminNav />
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-200 via-amber-200 to-yellow-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-700">Welcome to your blog management system</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 w-full">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {loading ? (
            <div className="col-span-4 flex justify-center items-center py-12">
              <div className="text-gray-500">Loading stats...</div>
            </div>
          ) : (
            cards.map((card, index) => (
              <Link
                key={index}
                href={card.link}
                className="group"
              >
                <div className={`${card.bgLight} rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 border-2 ${card.borderColor} hover:scale-105 cursor-pointer relative overflow-hidden min-h-[160px] sm:min-h-[180px] w-full`}>
                  {/* Gradient Overlay on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className={`${card.iconBg} w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        {card.icon}
                      </div>
                      <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                        <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${card.textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-1 sm:space-y-2">
                      <h3 className={`${card.textColor} text-xs sm:text-sm font-semibold uppercase tracking-wide`}>
                        {card.title}
                      </h3>
                      <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 group-hover:scale-105 transition-transform duration-300">
                        {card.value}
                      </p>
                      <div className="flex items-center space-x-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${card.iconBg}`}></div>
                        <p className="text-gray-600 text-xs sm:text-sm font-medium">
                          {card.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <Link
              href="/admin/authors"
              className="flex items-center p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-all group"
            >
              <div className="bg-yellow-100 group-hover:bg-yellow-200 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mr-3 sm:mr-4 transition-colors flex-shrink-0">
                <span className="text-xl sm:text-2xl">👥</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors text-sm sm:text-base">
                  Manage Authors
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">Add, edit, or delete authors</p>
              </div>
            </Link>

            <Link
              href="/admin/posts"
              className="flex items-center p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-all group"
            >
              <div className="bg-yellow-100 group-hover:bg-yellow-200 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mr-3 sm:mr-4 transition-colors flex-shrink-0">
                <span className="text-xl sm:text-2xl">📝</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors text-sm sm:text-base">
                  Manage Blog Posts
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">Create and manage blog posts</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <AdminFooter />
    </div>
  );
}
