import React, { useState, useRef, DragEvent, ChangeEvent, ClipboardEvent } from 'react';
import { Upload, Image as ImageIcon, X, Paperclip } from 'lucide-react';

interface ImageUploaderBoxProps {
  onImageUpload?: (file: File, preview: string) => void;
  onImageRemove?: () => void;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  disabled?: boolean;
  initialPreview?: string;
}

export function ImageUploaderBox({
  onImageUpload,
  onImageRemove,
  maxSizeMB = 10,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/gif'],
  disabled = false,
  initialPreview,
}: ImageUploaderBoxProps) {
  const [preview, setPreview] = useState<string | null>(initialPreview || null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setError(null);

    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      setError('סוג קובץ לא נתמך. אנא העלו JPG, PNG או GIF');
      return false;
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`הקובץ גדול מדי. גודל מקסימלי: ${maxSizeMB}MB`);
      return false;
    }

    return true;
  };

  const handleFile = (file: File) => {
    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      onImageUpload?.(file, result);
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    if (disabled || preview) return;
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !preview) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled || preview) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    if (disabled || preview) return;

    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          handleFile(file);
          e.preventDefault();
        }
      }
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setError(null);
    onImageRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full" dir="rtl">
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onPaste={handlePaste}
        tabIndex={disabled ? -1 : 0}
        className={`
          relative w-full h-[200px] rounded-xl border-2 border-dashed transition-all duration-200
          ${preview ? 'border-solid border-purple-300 bg-white p-2' : 'border-gray-300 bg-gray-50 p-6'}
          ${!disabled && !preview ? 'cursor-pointer hover:bg-gray-100 hover:border-gray-400' : ''}
          ${isDragging ? 'bg-purple-50 border-purple-500 border-solid' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        role="button"
        aria-label="העלאת תמונה"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />

        {/* Empty State */}
        {!preview && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-right">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100">
              <ImageIcon className="w-6 h-6 text-purple-600" />
            </div>
            
            <div className="space-y-1 text-center">
              <p className="font-bold text-gray-800">
                📸 העלאת תמונה או הדבקה
              </p>
              <div className="text-sm text-gray-600 space-y-0.5">
                <p>🖼 גררו תמונה לכאן</p>
                <p className="text-gray-500">או</p>
                <p>📁 לחצו להעלאה</p>
                <p className="text-gray-500">או</p>
                <p>📋 הדביקו תמונה מהלוח</p>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center">
              סוגי קבצים נתמכים: JPG, PNG, GIF | עד {maxSizeMB}MB
            </p>
          </div>
        )}

        {/* Dragging State */}
        {isDragging && !preview && (
          <div className="absolute inset-0 flex items-center justify-center bg-purple-100/80 rounded-xl border-2 border-purple-500 border-dashed">
            <div className="text-center">
              <Upload className="w-12 h-12 text-purple-600 mx-auto mb-2 animate-bounce" />
              <p className="font-bold text-purple-700">שחררו כאן! 📸</p>
            </div>
          </div>
        )}

        {/* Preview State */}
        {preview && (
          <div className="relative h-full w-full rounded-lg overflow-hidden group">
            <img
              src={preview}
              alt="תצוגה מקדימה"
              className="w-full h-full object-contain rounded-lg"
            />
            
            {/* Remove button */}
            {!disabled && (
              <button
                onClick={handleRemove}
                className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="הסר תמונה"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Preview overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 rounded-lg pointer-events-none"></div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
