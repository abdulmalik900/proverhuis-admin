'use client';

import { useState, useEffect } from 'react';

export default function TagInput({ value = [], onChange }) {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // Initialize tags from value prop
  useEffect(() => {
    if (Array.isArray(value)) {
      setTags(value);
    } else if (typeof value === 'string') {
      // Handle comma-separated string
      const tagArray = value.split(',').map(t => t.trim()).filter(t => t !== '');
      setTags(tagArray);
    }
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Check if user typed comma or pressed enter
    if (newValue.includes(',')) {
      const newTags = newValue
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '' && !tags.includes(tag));
      
      if (newTags.length > 0) {
        const updatedTags = [...tags, ...newTags];
        setTags(updatedTags);
        onChange(updatedTags);
        setInputValue('');
      } else {
        setInputValue('');
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = inputValue.trim();
      if (tag && !tags.includes(tag)) {
        const updatedTags = [...tags, tag];
        setTags(updatedTags);
        onChange(updatedTags);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      // Remove last tag on backspace when input is empty
      const updatedTags = tags.slice(0, -1);
      setTags(updatedTags);
      onChange(updatedTags);
    }
  };

  const removeTag = (indexToRemove) => {
    const updatedTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(updatedTags);
    onChange(updatedTags);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Tags
      </label>

      {/* Tags Container */}
      <div className="min-h-[42px] w-full px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-yellow-300 focus-within:border-transparent bg-white">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Display Tags */}
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-200 to-amber-200 text-gray-800 rounded-full text-sm font-medium animate-fadeIn border border-yellow-300/50"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="hover:bg-yellow-300 rounded-full p-0.5 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}

          {/* Input Field */}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? "Type and press comma or enter..." : "Add more..."}
            className="flex-1 min-w-[150px] outline-none border-none p-0 text-sm"
          />
        </div>
      </div>

      {/* Helper Text */}
      <p className="text-xs text-gray-500">
        Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Enter</kbd> or 
        <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs mx-1">,</kbd> 
        to add tags. Click × to remove.
      </p>

      {/* Preview */}
      {tags.length > 0 && (
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
          <span className="font-semibold">Tags array:</span> [{tags.join(', ')}]
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
