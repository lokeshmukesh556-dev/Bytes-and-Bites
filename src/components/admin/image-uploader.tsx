
'use client';
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { UploadCloud, X } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface ImageUploaderProps {
  onFileChange: (file: File | null) => void;
  onUrlChange: (url: string) => void;
  currentImageUrl?: string;
}

export function ImageUploader({
  onFileChange,
  onUrlChange,
  currentImageUrl,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [url, setUrl] = useState(currentImageUrl || '');

  useEffect(() => {
    setPreview(currentImageUrl || null);
    setUrl(currentImageUrl || '');
  }, [currentImageUrl]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
          onFileChange(file);
          setUrl(''); // Clear URL if file is chosen
          onUrlChange('');
        };
        reader.readAsDataURL(file);
      }
    },
    [onFileChange, onUrlChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setPreview(newUrl);
    onUrlChange(newUrl);
    onFileChange(null); // Clear file if URL is typed
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setUrl('');
    onFileChange(null);
    onUrlChange('');
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative group w-full h-48 rounded-md overflow-hidden">
          <Image
            src={preview}
            alt="Image preview"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              variant="destructive"
              size="icon"
              onClick={handleRemoveImage}
              type='button'
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove image</span>
            </Button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`w-full h-48 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/10' : 'border-input'
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="w-12 h-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            Drag & drop an image, or click to select
          </p>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Or paste an image URL"
          value={url}
          onChange={handleUrlChange}
        />
      </div>
    </div>
  );
}
