import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  FaBold, FaItalic, FaStrikethrough, FaCode,
  FaListUl, FaListOl, FaQuoteLeft, FaUndo, FaRedo
} from 'react-icons/fa';

const RichTextEditor = ({ content, onChange, placeholder = 'Start writing...' }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const MenuButton = ({ onClick, active, children, title }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2.5 rounded-xl transition-all duration-200 ${active
          ? 'bg-electric-blue text-white shadow-lg shadow-electric-blue/20 scale-105'
          : 'text-slate-400 hover:text-white hover:bg-white/10'
        }`}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className="glass-card !bg-white/5 !rounded-2xl border-white/5 overflow-hidden focus-within:border-electric-blue/30 transition-all">
      {/* Toolbar */}
      <div className="bg-white/5 border-b border-white/5 p-3 flex flex-wrap gap-2">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <FaBold />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <FaItalic />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Strikethrough"
        >
          <FaStrikethrough />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          title="Code"
        >
          <FaCode />
        </MenuButton>

        <div className="w-px bg-white/10 mx-1 h-8 self-center" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <FaListUl />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <FaListOl />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Quote"
        >
          <FaQuoteLeft />
        </MenuButton>

        <div className="w-px bg-white/10 mx-1 h-8 self-center" />

        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <FaUndo />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <FaRedo />
        </MenuButton>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="prose prose-invert max-w-none p-6 min-h-[400px] focus:outline-none text-slate-200"
      />
    </div>
  );
};

export default RichTextEditor;