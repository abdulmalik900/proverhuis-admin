'use client';

import { useRef, useEffect } from 'react';

export default function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const toolbarButtons = [
    { icon: 'B', command: 'bold', title: 'Bold', style: 'font-bold' },
    { icon: 'I', command: 'italic', title: 'Italic', style: 'italic' },
    { icon: 'U', command: 'underline', title: 'Underline', style: 'underline' },
    { icon: '≡', command: 'justifyLeft', title: 'Align Left' },
    { icon: '≣', command: 'justifyCenter', title: 'Align Center' },
    { icon: '•', command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: '1.', command: 'insertOrderedList', title: 'Numbered List' },
  ];

  return (
    <div className="rich-text-editor border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-300">
        {/* Format Dropdown */}
        <select
          onChange={(e) => execCommand('formatBlock', e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
          defaultValue=""
        >
          <option value="">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="h5">Heading 5</option>
          <option value="h6">Heading 6</option>
          <option value="p">Paragraph</option>
        </select>

        <div className="w-px bg-gray-300 mx-1"></div>

        {/* Text Formatting */}
        {toolbarButtons.map((btn, index) => (
          <button
            key={index}
            type="button"
            onClick={() => execCommand(btn.command)}
            className={`px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm ${btn.style || ''}`}
            title={btn.title}
          >
            {btn.icon}
          </button>
        ))}

        <div className="w-px bg-gray-300 mx-1"></div>

        {/* Link & Image */}
        <button
          type="button"
          onClick={insertLink}
          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
          title="Insert Link"
        >
          🔗
        </button>
        <button
          type="button"
          onClick={insertImage}
          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
          title="Insert Image"
        >
          🖼️
        </button>

        <div className="w-px bg-gray-300 mx-1"></div>

        {/* Text Color */}
        <input
          type="color"
          onChange={(e) => execCommand('foreColor', e.target.value)}
          className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
          title="Text Color"
        />

        {/* Clear Formatting */}
        <button
          type="button"
          onClick={() => execCommand('removeFormat')}
          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
          title="Clear Formatting"
        >
          ✕
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[300px] p-4 focus:outline-none prose max-w-none"
        style={{ 
          maxHeight: '500px', 
          overflowY: 'auto',
          fontSize: '16px',
          lineHeight: '1.6'
        }}
      />

      <style jsx global>{`
        .rich-text-editor [contenteditable] {
          word-wrap: break-word;
        }
        .rich-text-editor [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        .rich-text-editor [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        .rich-text-editor [contenteditable] h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }
        .rich-text-editor [contenteditable] h4,
        .rich-text-editor [contenteditable] h5,
        .rich-text-editor [contenteditable] h6 {
          font-weight: bold;
          margin: 1em 0;
        }
        .rich-text-editor [contenteditable] p {
          margin: 1em 0;
        }
        .rich-text-editor [contenteditable] ul,
        .rich-text-editor [contenteditable] ol {
          margin: 1em 0;
          padding-left: 2em;
        }
        .rich-text-editor [contenteditable] li {
          margin: 0.5em 0;
        }
        .rich-text-editor [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }
        .rich-text-editor [contenteditable] img {
          max-width: 100%;
          height: auto;
          margin: 1em 0;
        }
        .rich-text-editor [contenteditable]:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}
