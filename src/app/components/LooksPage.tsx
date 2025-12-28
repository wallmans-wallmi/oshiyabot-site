import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, X, Calendar } from 'lucide-react';
import { Look } from '../App';

interface LooksPageProps {
  onBack: () => void;
  looks: Look[];
  onLookClick?: (lookId: number) => void;
  onNavigateToChat?: () => void;
  isDesktop?: boolean;
}

export function LooksPage({ 
  onBack, 
  looks = [],
  onLookClick,
  onNavigateToChat,
  isDesktop = false
}: LooksPageProps) {
  const [selectedLookId, setSelectedLookId] = useState<number | null>(null);

  const selectedLook = selectedLookId ? looks.find(l => l.id === selectedLookId) : null;

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return 'היום';
    } else if (d.toDateString() === yesterday.toDateString()) {
      return 'אתמול';
    } else {
      return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
    }
  };

  const renderLookCard = (look: Look) => (
    <div 
      key={look.id}
      onClick={() => {
        onLookClick?.(look.id);
        setSelectedLookId(look.id);
      }}
      className="bg-white rounded-2xl p-5 hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="flex items-start gap-4">
        {look.previewImage ? (
          <Image
            src={look.previewImage}
            alt={look.title}
            width={64}
            height={64}
            className="w-16 h-16 rounded-lg object-cover"
            unoptimized
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1 truncate">
            {look.title}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(look.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Detail view - inline version
  if (selectedLook) {
    return (
      <div className="space-y-4" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">הלוק שלי</h2>
          <button
            onClick={() => setSelectedLookId(null)}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            aria-label="חזרה לרשימה"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Content */}
        <div>
          <div className="bg-white rounded-2xl p-6 space-y-6">
            {selectedLook.previewImage && (
              <Image
                src={selectedLook.previewImage}
                alt={selectedLook.title}
                width={800}
                height={600}
                className="w-full rounded-xl object-cover"
                unoptimized
              />
            )}
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedLook.title}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(selectedLook.createdAt)}</span>
              </div>
            </div>

            {selectedLook.items && selectedLook.items.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">פריטים בלוק:</h3>
                <ul className="space-y-2">
                  {selectedLook.items.map((item, index) => (
                    <li key={index} className="text-gray-700">• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setSelectedLookId(null)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200"
              >
                חזרה לרשימה
              </button>
              {onNavigateToChat && (
                <button
                  onClick={onNavigateToChat}
                  className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-xl hover:bg-purple-700 transition-all duration-200"
                >
                  חזרה לצ'אט
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view - inline version (no header, for tab view)
  return (
    <div className="space-y-4" dir="rtl">
      {/* Content */}
      <div>
        <div className="space-y-6">
          {/* Looks list */}
          {looks.length > 0 && (
            <div className="space-y-3">
              {looks.map(renderLookCard)}
            </div>
          )}

          {/* Empty state */}
          {looks.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">עדיין אין לוקים שמורים</h3>
              <p className="text-gray-600 mb-6">
                כשתשמרי לוק מהצ'אט, הוא יופיע כאן! ✨
              </p>
              {onNavigateToChat && (
                <button
                  onClick={onNavigateToChat}
                  className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-all duration-200 hover:scale-105 shadow-md inline-flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>חזרה לצ'אט</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
