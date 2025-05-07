
import React, { useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import EditorToolbar from './EditorToolbar';
import ImageUploader from './ImageUploader';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  content, 
  onChange,
  placeholder = 'Start writing...'
}) => {
  const imageUploaderRef = useRef<HTMLInputElement>(null);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        validate: href => /^https?:\/\//.test(href),
      }),
      Image.configure({
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl focus:outline-none w-full max-w-none min-h-[200px] p-4',
      },
    },
  });

  const triggerImageUpload = () => {
    imageUploaderRef.current?.click();
  };

  return (
    <div className="border border-border rounded-md overflow-hidden bg-background">
      <EditorToolbar 
        editor={editor} 
        onImageUploadClick={triggerImageUpload} 
      />
      <EditorContent editor={editor} className="min-h-[300px]" />
      <ImageUploader editor={editor} />
    </div>
  );
};

export default RichTextEditor;
