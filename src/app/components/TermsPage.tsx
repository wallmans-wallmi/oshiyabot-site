import React from 'react';
import { X, Scale } from 'lucide-react';

interface TermsPageProps {
  onClose: () => void;
  isDesktop?: boolean;
}

export function TermsPage({ onClose, isDesktop = false }: TermsPageProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 overflow-y-auto" dir="rtl" style={{ minHeight: '100dvh', height: '100dvh' }}>{/* Outer wrapper */}
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-br from-purple-50 to-pink-50 px-4 py-3 z-10">{/* Header container */}
        <div className="max-w-3xl mx-auto flex items-center justify-between">{/* Header flex content */}
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-600" />
            <h2 className="font-bold text-gray-900">תנאי שימוש</h2>
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
      <div className="max-w-3xl mx-auto px-4 py-8">
        
        <div className={isDesktop ? "bg-white rounded-3xl p-6 md:p-8 space-y-8" : "space-y-8"}>
        {/* Opening */}
        <section className="space-y-4">
          <p className="text-gray-800 leading-relaxed text-lg font-medium">
            ברוכים הבאים!
          </p>
          <p className="text-gray-800 leading-relaxed">
            השימוש בשירות הזה (בין אם באתר, באפליקציה או דרך התכתבות) כפוף לתנאים הבאים.
          </p>
          <p className="text-gray-800 leading-relaxed">
            ברגע שאתם משתמשים בשירות – אתם מאשרים שקראתם והסכמתם לתנאים.
          </p>
          <p className="text-gray-800 leading-relaxed">
            לא מסכימים? לא נורא – פשוט לא להשתמש
          </p>
        </section>

        {/* Divider */}
        <div className="border-t-2 border-purple-100"></div>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="font-bold text-gray-900 text-xl">1. מה זה השירות הזה?</h2>
          <p className="text-gray-800 leading-relaxed">
            השירות מספק מידע, ייעוץ צרכני ומעקב מחירים על מוצרים לפי בקשת המשתמש.
          </p>
          <p className="text-gray-800 leading-relaxed">
            המעקב מתבצע על מחירים פומביים באינטרנט בלבד, באתרים נבחרים.
          </p>
          <p className="text-gray-800 leading-relaxed">
            השירות לא מבטיח את המחיר הכי נמוך בשוק, ולא כולל מחירים מסניפים פיזיים או דילים פרטיים.
          </p>
        </section>

        {/* Divider */}
        <div className="border-t-2 border-purple-100"></div>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="font-bold text-gray-900 text-xl">2. אין התחייבות</h2>
          <p className="text-gray-800 leading-relaxed">
            השירות ניתן כמו שהוא (&quot;As is&quot;) – בלי אחריות על זמינות, תקלות או טעויות במחירים.
          </p>
          <p className="text-gray-800 leading-relaxed">
            אנחנו עושים מאמץ לתת מידע מדויק ועדכני, אבל יכולות לקרות טעויות, שינויים פתאומיים במחיר, או הבדל בין ההמלצה לבין מה שקורה בפועל באתר החנות.
          </p>
        </section>

        {/* Divider */}
        <div className="border-t-2 border-purple-100"></div>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="font-bold text-gray-900 text-xl">3. שימוש אישי בלבד</h2>
          <p className="text-gray-800 leading-relaxed">
            השירות מיועד לשימוש אישי ולא מסחרי.
          </p>
          <p className="text-gray-800 leading-relaxed">
            אין להעתיק, למכור, או להשתמש במידע באופן שמפר את החוק או את התנאים האלה.
          </p>
        </section>

        {/* Divider */}
        <div className="border-t-2 border-purple-100"></div>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="font-bold text-gray-900 text-xl">4. פרטיות</h2>
          <p className="text-gray-800 leading-relaxed">
            אם השארתם פרטים אישיים (כמו מייל לצורך קבלת התראות) – הם ישמשו רק למטרה הזאת.
          </p>
          <p className="text-gray-800 leading-relaxed">
            לא נעביר את הפרטים שלכם לגורמים אחרים בלי הסכמה.
          </p>
        </section>

        {/* Divider */}
        <div className="border-t-2 border-purple-100"></div>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="font-bold text-gray-900 text-xl">5. שינויים בתנאים</h2>
          <p className="text-gray-800 leading-relaxed">
            התנאים יכולים להתעדכן מדי פעם. נפרסם עדכון עם תאריך, ואם יש שינוי מהותי – נודיע מראש.
          </p>
          <p className="text-gray-800 leading-relaxed">
            המשך שימוש בשירות אומר שהסכמתם גם לתנאים המעודכנים.
          </p>
        </section>

        {/* Divider */}
        <div className="border-t-2 border-purple-100"></div>

        {/* Section 6 */}
        <section className="space-y-4">
          <h2 className="font-bold text-gray-900 text-xl">6. צור קשר</h2>
          <p className="text-gray-800 leading-relaxed">
            שאלות? בעיות? דברו איתנו בכיף
          </p>
          <div className="mr-4 space-y-2">
            <p className="text-gray-800 leading-relaxed">
              <a href="mailto:contact@oshiya.co" className="text-purple-600 hover:text-purple-700 underline">contact@oshiya.co</a>
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