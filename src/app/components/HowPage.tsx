import React from 'react';
import Image from 'next/image';
import { Sparkles, X } from 'lucide-react';
const howImage = "/assets/9da14f689d0aad6e5536fd64386b0685a4bf8bb0.png";

interface HowPageProps {
  onBack: () => void;
  isDesktop?: boolean;
}

export function HowPage({ onBack, isDesktop = false }: HowPageProps) {
  return (
    <div className={`${isDesktop ? 'h-full' : 'fixed inset-0 z-50'} bg-gradient-to-br from-purple-50 to-pink-50 overflow-y-auto`} dir="rtl">
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
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Avatar section */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Image
              src={howImage}
              alt="איך אושייה עובדת"
              width={160}
              height={160}
              className="w-40 h-40 rounded-full object-cover border-4 border-purple-300"
            />
            <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-4 border-white flex items-center justify-center">
              <span className="text-white text-xl">✨</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 text-right mb-4">איך אני עובדת</h1>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">שלב 1 – מתחילות מסטייל</h2>
            <p className="text-gray-700 leading-relaxed">
              את זורקת לי וייב:<br />
              מה את מחפשת, לאיזה סיטואציה, מה הסגנון שלך, מה התקציב.<br />
              אפשר גם תמונה, השראה מהפינטרסט, או &quot;אין לי מושג, אבל בא לי משהו מיוחד&quot;.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">שלב 2 – בונות לוק</h2>
            <p className="text-gray-700 leading-relaxed">
              אני עוזרת לך לדייק את הסגנון – מה בא לך לשדר, מה נוח לך, מה ירגיש לך הכי את.<br />
              כמו סטייליסטית שהיא גם חברה שלך – לא מישהי שמנסה להלביש אותך בתחפושת.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">שלב 3 – מוצאות את הפריטים</h2>
            <p className="text-gray-700 leading-relaxed">
              אני מחפשת פריטים אונליין שמתאימים ללוק שבנינו –<br />
              גם לפי מה שמתאים לך, וגם לפי התקציב.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">שלב 4 – את בוחרת את הקצב</h2>
            <p className="text-gray-700 leading-relaxed">
              אם יש לך אירוע דחוף – נרכיב סל וקונים.<br />
              אם לא בוער – נכניס את הפריטים למעקב.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">שלב 5 – כשיש ירידת מחיר אמיתית, את מקבלת התראה</h2>
            <p className="text-gray-700 leading-relaxed">
              בלי ספאם. בלי &quot;החגיגות החלו&quot;.<br />
              רק כשזה באמת מרגיש שווה.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">שלב 6 – את מחליטה</h2>
            <p className="text-gray-700 leading-relaxed">
              אני לא דוחפת. לא מלחיצה. לא יוצרת FOMO.<br />
              רק שולחת את מה שבאמת משתלם – ואת בוחרת אם בא לך או לא.
            </p>
          </section>

          {/* Call to action */}
          <div className="pt-6 mt-6 border-t-2 border-gray-100">
            <button
              onClick={onBack}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
            >
              בואי נתחיל »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}