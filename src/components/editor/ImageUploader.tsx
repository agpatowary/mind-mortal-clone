
import React from 'react';
import ReactQuill from 'react-quill';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  quillRef: React.RefObject<ReactQuill>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ fileInputRef, quillRef }) => {
  const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('content_media')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase
        .storage
        .from('content_media')
        .getPublicUrl(filePath);

      // Insert the image into the editor
      if (quillRef.current) {
        const quill = quillRef.current.getEditor();
        // Get the current selection or default to the end of the document
        const range = quill.getSelection() || { index: quill.getLength(), length: 0 };
        quill.insertEmbed(range.index, 'image', publicUrl);
        quill.setSelection(range.index + 1, 0);
        
        toast({
          title: "Image uploaded",
          description: "Your image has been uploaded successfully.",
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image.",
        variant: "destructive"
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        handleImageUpload(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <>
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </>
  );
};

export default ImageUploader;
