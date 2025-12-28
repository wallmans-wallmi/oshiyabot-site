import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ImageUploaderBox } from './ImageUploaderBox';

interface ImageUploaderDemoProps {
  onClose: () => void;
}

export function ImageUploaderDemo({ onClose }: ImageUploaderDemoProps) {
  const [uploadedImages, setUploadedImages] = useState<Array<{ file: File; preview: string }>>([]);

  const handleImageUpload = (file: File, preview: string) => {
    setUploadedImages(prev => [...prev, { file, preview }]);
    console.log('תמונה הועלתה:', file.name, file.size, 'bytes');
  };

  const handleImageRemove = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-50 to-pink-50 overflow-y-auto" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-purple-100 px-4 py-3 shadow-sm z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h2 className="font-bold text-gray-900">📸 העלאת תמונות - דמו</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
            aria-label="סגור"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        
        {/* Description */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100">
          <h3 className="font-bold text-gray-900 mb-3">איך להשתמש?</h3>
          <div className="space-y-2 text-gray-700 text-sm">
            <p>✅ לחצו על התיבה כדי לבחור קובץ</p>
            <p>✅ גררו תמונה ישירות לתוך התיבה</p>
            <p>✅ העתיקו תמונה והדביקו בתוך התיבה (Ctrl+V / Cmd+V)</p>
            <p>✅ לחצו על ה-X כדי להסיר תמונה</p>
          </div>
        </div>

        {/* Single Upload Example */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100">
          <h3 className="font-bold text-gray-900 mb-4">דוגמה 1: העלאה בסיסית</h3>
          <ImageUploaderBox
            onImageUpload={handleImageUpload}
            onImageRemove={() => console.log('תמונה הוסרה')}
          />
        </div>

        {/* Multiple Upload Example */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100">
          <h3 className="font-bold text-gray-900 mb-4">דוגמה 2: העלאת מספר תמונות</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUploaderBox
              onImageUpload={handleImageUpload}
              onImageRemove={() => console.log('תמונה 1 הוסרה')}
            />
            <ImageUploaderBox
              onImageUpload={handleImageUpload}
              onImageRemove={() => console.log('תמונה 2 הוסרה')}
            />
          </div>

          {uploadedImages.length > 0 && (
            <div className="mt-6 pt-6 border-t-2 border-purple-100">
              <h4 className="font-bold text-gray-800 mb-3">תמונות שהועלו ({uploadedImages.length}):</h4>
              <div className="space-y-2">
                {uploadedImages.map((img, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-purple-50 px-4 py-3 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={img.preview}
                        alt={img.file.name}
                        className="w-12 h-12 object-cover rounded-lg border-2 border-purple-200"
                      />
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{img.file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(img.file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleImageRemove(index)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Disabled State Example */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100">
          <h3 className="font-bold text-gray-900 mb-4">דוגמה 3: מצב מושבת</h3>
          <ImageUploaderBox disabled={true} />
        </div>

        {/* Custom Settings Example */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100">
          <h3 className="font-bold text-gray-900 mb-4">דוגמה 4: הגדרות מותאמות (עד 5MB בלבד)</h3>
          <ImageUploaderBox
            maxSizeMB={5}
            onImageUpload={handleImageUpload}
            onImageRemove={() => console.log('תמונה הוסרה')}
          />
        </div>

        {/* Technical Details */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border-2 border-purple-200">
          <h3 className="font-bold text-gray-900 mb-4">📋 פרטים טכניים</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <span className="font-medium min-w-[120px]">תכונות:</span>
              <span>Drag & Drop, Paste, Click to Upload</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium min-w-[120px]">סוגי קבצים:</span>
              <span>JPG, PNG, GIF</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium min-w-[120px]">גודל מקסימלי:</span>
              <span>10MB (ניתן לשינוי)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium min-w-[120px]">תצוגה:</span>
              <span>Preview עם אפשרות הסרה</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium min-w-[120px]">נגישות:</span>
              <span>RTL, Keyboard Support, ARIA Labels</span>
            </div>
          </div>
        </div>

        {/* Usage Example Code */}
        <div className="bg-gray-900 rounded-2xl shadow-lg p-6 border-2 border-gray-700">
          <h3 className="font-bold text-white mb-4">💻 דוגמת שימוש בקוד</h3>
          <pre className="text-green-400 text-xs overflow-x-auto" dir="ltr">
{`import { ImageUploaderBox } from './components/ImageUploaderBox';

function MyComponent() {
  const handleUpload = (file: File, preview: string) => {
    console.log('File uploaded:', file.name);
    // Do something with the file...
  };

  return (
    <ImageUploaderBox
      onImageUpload={handleUpload}
      onImageRemove={() => console.log('Removed')}
      maxSizeMB={10}
    />
  );
}`}
          </pre>
        </div>

      </div>
    </div>
  );
}
