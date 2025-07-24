// src/components/ui/rich-text-editor.tsx
'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignCenter,
  AlignLeft,
  AlignRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { FontSize } from '@/lib/tiptap-extensions/font-size';
import { ParagraphGap } from '@/lib/tiptap-extensions/paragraph-gap';

const RichTextEditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const handleFontSizeChange = (value: string) => {
    if (value === 'default') {
      editor.chain().focus().unsetFontSize().run();
    } else {
      editor.chain().focus().setFontSize(value).run();
    }
  };
  
  const currentFontSize = editor.getAttributes('textStyle').fontSize || 'default';

  const handleParagraphGapChange = (value: string) => {
    if (value === 'default') {
      editor.chain().focus().setParagraphGap(null).run();
    } else {
      editor.chain().focus().setParagraphGap(value).run();
    }
  };
  
  const currentParagraphGap = editor.getAttributes('paragraph').paragraphGap || 'default';

  return (
    <div className="border border-input rounded-md p-1 flex flex-wrap items-center gap-1">
      <Select value={currentFontSize} onValueChange={handleFontSizeChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Font size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="12px">12px</SelectItem>
          <SelectItem value="14px">14px</SelectItem>
          <SelectItem value="16px">16px</SelectItem>
          <SelectItem value="18px">18px</SelectItem>
          <SelectItem value="20px">20px</SelectItem>
          <SelectItem value="24px">24px</SelectItem>
        </SelectContent>
      </Select>
      <Select value={currentParagraphGap} onValueChange={handleParagraphGapChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Paragraph Gap" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default Gap</SelectItem>
          <SelectItem value="small">Small</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="large">Large</SelectItem>
        </SelectContent>
      </Select>
       <input
        type="color"
        onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
        value={editor.getAttributes('textStyle').color || '#000000'}
        className="w-8 h-8 p-1 border rounded-md"
        title="Font Color"
      />
      <Button
        type="button"
        size="icon"
        variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>
       <Button
        type="button"
        size="icon"
        variant={editor.isActive('paragraph') ? 'secondary' : 'ghost'}
        onClick={() => editor.chain().focus().setParagraph().run()}
        title="Paragraph"
      >
        <Pilcrow className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant={editor.isActive('heading', { level: 1 }) ? 'secondary' : 'ghost'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        title="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
       <Button
        type="button"
        size="icon"
        variant={editor.isActive('heading', { level: 2 }) ? 'secondary' : 'ghost'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
       <Button
        type="button"
        size="icon"
        variant={editor.isActive('heading', { level: 3 }) ? 'secondary' : 'ghost'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        title="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </Button>
        <Button
        type="button"
        size="icon"
        variant={editor.isActive('heading', { level: 4 }) ? 'secondary' : 'ghost'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        title="Heading 4"
      >
        <Heading4 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant={editor.isActive('heading', { level: 5 }) ? 'secondary' : 'ghost'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        title="Heading 5"
      >
        <Heading5 className="h-4 w-4" />
      </Button>
        <Button
        type="button"
        size="icon"
        variant={editor.isActive('heading', { level: 6 }) ? 'secondary' : 'ghost'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        title="Heading 6"
      >
        <Heading6 className="h-4 w-4" />
      </Button>
       <Button
        type="button"
        size="icon"
        variant={editor.isActive({ textAlign: 'left' }) ? 'secondary' : 'ghost'}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        title="Align Left"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
       <Button
        type="button"
        size="icon"
        variant={editor.isActive({ textAlign: 'center' }) ? 'secondary' : 'ghost'}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        title="Align Center"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
       <Button
        type="button"
        size="icon"
        variant={editor.isActive({ textAlign: 'right' }) ? 'secondary' : 'ghost'}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        title="Align Right"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Ordered List"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
            levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
            HTMLAttributes: {
                class: 'list-disc pl-5',
            },
        },
        orderedList: {
            HTMLAttributes: {
                class: 'list-decimal pl-5',
            }
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      FontSize,
      ParagraphGap,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl max-w-none m-5 focus:outline-none min-h-[150px] border border-input rounded-md p-4',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <RichTextEditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
