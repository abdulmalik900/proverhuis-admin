'use client';

import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm sm:max-w-md',
    md: 'max-w-lg sm:max-w-xl lg:max-w-2xl',
    lg: 'max-w-xl sm:max-w-3xl lg:max-w-4xl',
    xl: 'max-w-2xl sm:max-w-4xl lg:max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      ></div>

      {/* Modal Container */}
      <div className="flex items-center justify-center min-h-screen p-2 sm:p-4" style={{ position: 'relative', zIndex: 10000 }}>
        <div
          className={`relative bg-white rounded-lg shadow-2xl w-full ${sizeClasses[size]} mx-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-white px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors p-1"
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-4 sm:px-6 py-4 max-h-[calc(100vh-120px)] sm:max-h-[calc(100vh-200px)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
