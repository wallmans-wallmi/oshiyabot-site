import React from 'react';
import { X, Eye } from 'lucide-react';

interface AccessibilityPageProps {
  onClose: () => void;
  isDesktop?: boolean;
}

export function AccessibilityPage({ onClose, isDesktop = false }: AccessibilityPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 overflow-y-auto" dir="rtl">
      {/* Header */}
      <div className={`sticky top-0 bg-gradient-to-br from-purple-50 to-pink-50 px-4 py-3 z-10 ${!isDesktop ? 'border-b border-purple-100' : ''}`}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-600" />
            <h2 className="font-bold text-gray-900">נגישות</h2>
          </div>
          {!isDesktop && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            aria-label="סגור"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">{/* Remove old header and min-h-screen structure */}
        <div className={isDesktop ? "bg-white rounded-3xl p-6 md:p-8 space-y-8" : "space-y-8"}>
          {/* Intro */}
          <section className="space-y-4">
            <p className="text-gray-800 leading-relaxed text-lg">
              האתר של אושייה שואף להיות נגיש לכלל המשתמשים, כולל אנשים עם מוגבלויות.
            </p>
            <p className="text-gray-800 leading-relaxed">
              אנו פועלים בהתאם להנחיות הנגישות המקובלות וממשיכים לשפר את חוויית השימוש באתר.
            </p>
          </section>

          {/* Divider */}
          <div className="border-t-2 border-purple-100"></div>

          {/* Accessibility Features */}
          <section className="space-y-4">
            <h2 className="font-bold text-gray-900 text-xl">תכונות נגישות באתר</h2>
            <p className="text-gray-800 leading-relaxed">
              האתר מותאם לגלישה בדפדפנים נפוצים
            </p>
            <p className="text-gray-800 leading-relaxed">
              ניתן להשתמש באתר באמצעות מקלדת
            </p>
            <p className="text-gray-800 leading-relaxed">
              האתר מותאם לטכנולוגיות מסייעות
            </p>
            <p className="text-gray-800 leading-relaxed">
              ניתן להגדיל טקסט באמצעות הגדרות הדפדפן
            </p>
            <p className="text-gray-800 leading-relaxed">
              נעשה מאמץ לשמור על ניגודיות צבעים תקינה
            </p>
          </section>

          {/* Divider */}
          <div className="border-t-2 border-purple-100"></div>

          {/* Limitations */}
          <section className="space-y-4">
            <h2 className="font-bold text-gray-900 text-xl">מגבלות ידועות</h2>
            <p className="text-gray-800 leading-relaxed">
              ייתכן שחלקים מסוימים באתר עדיין אינם מונגשים במלואם.
            </p>
            <p className="text-gray-800 leading-relaxed">
              אם נתקלתם בבעיה – נשמח שתעדכנו אותנו.
            </p>
          </section>

          {/* Divider */}
          <div className="border-t-2 border-purple-100"></div>

          {/* Contact */}
          <section className="space-y-4">
            <h2 className="font-bold text-gray-900 text-xl">פניות בנושא נגישות</h2>
            <p className="text-gray-800 leading-relaxed">
              אם נתקלתם בקושי או בתקלה בנושא נגישות, ניתן לפנות אלינו ואנו נעשה את מירב המאמצים לטפל בכך.
            </p>
            <div className="mr-4">
              <p className="text-gray-800 leading-relaxed">
                <a 
                  href="mailto:support@oshiya.co.il" 
                  className="text-purple-600 hover:text-purple-700 underline"
                >
                  support@oshiya.co.il
                </a>
              </p>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t-2 border-purple-100"></div>

          {/* Last Updated */}
          <section className="pb-8">
            <p className="text-gray-600 text-sm">
              עדכון אחרון: דצמבר 2024
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}