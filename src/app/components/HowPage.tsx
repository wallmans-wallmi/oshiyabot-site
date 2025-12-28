import React from 'react';
import { ArrowRight, Sparkles, X } from 'lucide-react';
const howImage = "/assets/9da14f689d0aad6e5536fd64386b0685a4bf8bb0.png";

interface HowPageProps {
  onBack: () => void;
  isDesktop?: boolean;
}

export function HowPage({ onBack, isDesktop = false }: HowPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50" dir="rtl">
      {/* Header */}
      {!isDesktop && (
        <div className="sticky top-0 bg-gradient-to-br from-purple-50 to-pink-50 px-4 py-3 z-10">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h2 className="font-bold text-gray-900">איך אני עובדת</h2>
            </div>
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="סגור"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Avatar section */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <img
              src={howImage}
              alt="איך אושייה עובדת"
              className="w-40 h-40 rounded-full object-cover border-4 border-purple-300"
            />
            <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-4 border-white flex items-center justify-center">
              <span className="text-white text-xl">✨</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 text-right mb-4">איך אני עובדת</h1>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. את זורקת לי מה את רוצה</h2>
            <p className="text-gray-700 leading-relaxed">
              זה יכול להיות דגם, לינק, תמונה מהאינסטה – מה שנוח לך. העיקר שאני אבין בדיוק על מה את מדברת, כדי שלא אתחיל לעקוב אחרי משהו ש"בערך דומה".
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. אני שמה עליו עין</h2>
            <p className="text-gray-700 leading-relaxed">
              מאותו רגע אני בעסק – חופרת באתרי קניות מוכרים (לא איזה חור נידח), משווה מחירים, ובודקת אם מישהו במקרה הוריד מחיר. בקיצור, אני בודקת בשבילך כדי שלא תצטרכי לעשות רפרש 20 פעם ביום.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. אני לא מציקה – רק מודיעה כשיש קטע</h2>
            <p className="text-gray-700 leading-relaxed">
              אם יש ירידת מחיר שבאמת שווה – תקבלי פינג בוואטסאפ. לא ספאם, לא "החגיגות החלו!" של איזה אתר. רק כשזה באמת מרגיש כמו "טוב, שווה לעצור רגע ולחשוב אם לקנות".
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. ההחלטה שלך</h2>
            <p className="text-gray-700 leading-relaxed">
              אני לא בקטע של לדחוף. את לא הולכת לשמוע ממני "עוד רגע נגמר המלאי!!!". את מחליטה אם לקנות או לא, בקצב שלך, בלי לחץ, בלי רגשות אשם ובלי מבצעים שנגמרים עוד 3... 2... 1...
            </p>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-600 text-center">
              כי בשביל מה יש אושייה אם לא בשביל העבודה השחורה?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}