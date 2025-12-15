'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import './TiptapEditor.css';

interface ContentInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  label?: string;
}

export default function ContentInput({
  value,
  onChange,
  placeholder = "Write the content here...",
  required = true,
  rows = 12,
  label = "Content"
}: ContentInputProps) {
  const hasContent = value.trim().length > 0;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[240px] p-4',
      },
    },
    immediatelyRender: false,
  });

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  const handleBold = () => editor?.chain().focus().toggleBold().run();
  const handleItalic = () => editor?.chain().focus().toggleItalic().run();
  const handleStrike = () => editor?.chain().focus().toggleStrike().run();
  const handleHeading1 = () => editor?.chain().focus().toggleHeading({ level: 1 }).run();
  const handleHeading2 = () => editor?.chain().focus().toggleHeading({ level: 2 }).run();
  const handleHeading3 = () => editor?.chain().focus().toggleHeading({ level: 3 }).run();
  const handleBulletList = () => editor?.chain().focus().toggleBulletList().run();
  const handleOrderedList = () => editor?.chain().focus().toggleOrderedList().run();
  const handleLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };
  const handleClearFormat = () => editor?.chain().focus().clearNodes().unsetAllMarks().run();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            handleBold();
            break;
          case 'i':
            e.preventDefault();
            handleItalic();
            break;
          case 'u':
            e.preventDefault();
            handleStrike();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!editor) {
    return <div className="h-48 bg-gray-50 rounded border animate-pulse"></div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {hasContent && (
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-md mb-2">
        <button
          type="button"
          onClick={handleBold}
          className={`px-2 py-1 text-xs font-medium rounded ${
            editor.isActive('bold') ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          title="Bold (Ctrl+B)"
        >
          B
        </button>
        <button
          type="button"
          onClick={handleItalic}
          className={`px-2 py-1 text-xs font-medium rounded ${
            editor.isActive('italic') ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          title="Italic (Ctrl+I)"
        >
          I
        </button>
        <button
          type="button"
          onClick={handleStrike}
          className={`px-2 py-1 text-xs font-medium rounded ${
            editor.isActive('strike') ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          title="Strikethrough"
        >
          S
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={handleHeading1}
          className={`px-2 py-1 text-xs font-medium rounded ${
            editor.isActive('heading', { level: 1 }) ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={handleHeading2}
          className={`px-2 py-1 text-xs font-medium rounded ${
            editor.isActive('heading', { level: 2 }) ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={handleHeading3}
          className={`px-2 py-1 text-xs font-medium rounded ${
            editor.isActive('heading', { level: 3 }) ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          title="Heading 3"
        >
          H3
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={handleBulletList}
          className={`px-2 py-1 text-xs font-medium rounded ${
            editor.isActive('bulletList') ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          title="Bullet List"
        >
          •
        </button>
        <button
          type="button"
          onClick={handleOrderedList}
          className={`px-2 py-1 text-xs font-medium rounded ${
            editor.isActive('orderedList') ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          title="Numbered List"
        >
          1.
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={handleLink}
          className={`px-2 py-1 text-xs font-medium rounded ${
            editor.isActive('link') ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          title="Insert Link"
        >
          🔗
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={handleClearFormat}
          className="px-2 py-1 text-xs font-medium rounded bg-white text-gray-700 hover:bg-gray-100"
          title="Clear Formatting"
        >
          ⌫
        </button>
      </div>

      {/* Editor */}
      <div className="border border-t-0 rounded-b-md bg-white">
        <EditorContent
          editor={editor}
          className="min-h-[240px] focus-within:outline-none"
        />
      </div>

      
    </div>
  );
}