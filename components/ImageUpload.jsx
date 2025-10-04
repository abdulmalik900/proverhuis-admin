'use client';

import { useState, useEffect, useRef } from 'react';

export default function ImageUpload({ value, onChange, onFileSelect, label = "Image" }) {
  const [preview, setPreview] = useState(value || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setPreview(value || '');
  }, [value]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    // Store file for later upload
    setSelectedFile(file);

    // Show immediate preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Pass file to parent component
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview('');
    setSelectedFile(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {/* Show preview if exists */}
      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="max-w-full h-48 object-cover rounded-lg border-2 border-gray-300 shadow-sm"
          />
          
          {/* Badge showing if new image or existing */}
          {selectedFile && (
            <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
              New image selected
            </span>
          )}

          {/* Delete button */}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
            title="Remove image"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ) : (
        /* Upload Button */
        <label className="cursor-pointer block">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <span className="text-sm font-medium text-gray-700">Click to upload image</span>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF, WebP (Max 5MB)</p>
              </div>
            </div>
          </div>
        </label>
      )}

      {/* Status message */}
      {selectedFile && (
        <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
          ✓ Image selected. It will be uploaded when you click Create/Update.
        </p>
      )}
      
      {/* URL display for existing images */}
      {preview && !selectedFile && value && (
        <p className="text-xs text-gray-500 truncate bg-gray-50 p-2 rounded border border-gray-200">
          <span className="font-semibold">Current URL:</span> {value}
        </p>
      )}
    </div>
  );
}
