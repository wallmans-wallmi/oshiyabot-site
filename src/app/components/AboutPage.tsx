import React from 'react';
import { ArrowLeft, Sparkles, Target, Heart, Info, X } from 'lucide-react';
const oshiyaAvatar = "/assets/8987b8bb591c6b85bd934a46b81596f6b40dd7d7.png";

interface AboutPageProps {
  onClose?: () => void;
  onNavigateToWhat: () => void;
  isDesktop?: boolean;
}

export function AboutPage({ onClose, onNavigateToWhat, isDesktop = false }: AboutPageProps) {
  return (
    <div className={`${isDesktop ? 'h-full' : 'fixed inset-0 z-50'} bg-gradient-to-br from-purple-50 to-pink-50 overflow-y-auto`} dir="rtl">
      {/* Header - only show close button on mobile */}
      {!isDesktop && onClose && (
        <div className="sticky top-0 bg-gradient-to-br from-purple-50 to-pink-50 px-4 py-3 z-10">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-purple-600" />
              <h2 className="font-bold text-gray-900">מי אני</h2>
            </div>
            <button
              onClick={onClose}
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
            <img
              src={oshiyaAvatar}
              alt="רעות - מייסדת Oshiya"
              className="w-40 h-40 rounded-full object-cover border-4 border-purple-300"
            />
            <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-4 border-white flex items-center justify-center">
              <span className="text-white text-xl">✨</span>
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="bg-white rounded-3xl p-6 md:p-8 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 text-right mb-4">מי אני</h1>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              היי! אני רעות, מכורה לקניות ורודפת מבצעים.<br />
              כשאני לא במרדף, אני עובדת אצל שני המנהלים שלי – בני 3 ו־5.<br />
              מצד אחד זה לא פשוט, מצד שני זה מרחיב משמעותית את מעגל השופינג. כבר יתרון.
            </p>

            <p>
              המשפט שאני הכי אוהבת?<br />
              <span className="text-xl">"אמא, תקני לי."</span>
            </p>

            <p>
              אחרי המון שנים של בזבוז יתר (ולא מעט רגשות אשמה), הבנתי שתזמון זה הכול בשופינג.<br />
              אין תחושת תסכול גדולה יותר מלקנות משהו – ואז לגלות יום אחר כך שהוא ב־50% הנחה.
            </p>

            <p>
              אז התחלתי בשיטת המעמיסה עגלות בכל אתר אפשרי.<br />
              וכל בוקר עם הקפה – בודקת איפה ירד המחיר.
            </p>

            <p>
              אני לא שלמנית יותר!<br />
              בואי תבזבזי חצי יום בחיפושים, העיקר לא להיות שלמנית. 💪
            </p>

            <p>
              אחרי הרבה שנים בהייטק, כמנהלת מחלקות עיצוב מוצר, החלטתי להקים משהו משלי.<br />
              עברתי כמה ניסיונות וכיוונים, ובסוף – בלי יותר מדי כסף (כי ביטוח לאומי לא בדיוק לארג'ץ) – הבנתי שיש פה בעיה אישית שצריך לפתור.
            </p>

            <p>
              מצד אחד – הכסף מנהל אותי.<br />
              מצד שני  צריך לחסוך בעלויות (בכל זאת, תקופת אבטלה).
            </p>

            <p className="font-medium text-gray-800">
              אז יש שתי אפשרויות:
            </p>

            <div className="space-y-3 mr-4">
              <p>ללכת ליועץ פיננסי שיסדר את הכסף שאין לי</p>
              <p>או פשוט להתחיל לעשות שופינג חכם</p>
            </div>

            <p className="text-purple-700 font-medium">
              נחשו במה בחרתי? 😉<br />
              וככה הקמתי את אושייה.
            </p>

            <p>
              כמובן שבאישור שני המנהלים שלי, שתמכו וחיזקו את המהלך –<br />
              אבל שזה לא יבוא על חשבון הגדרת התפקיד שהם נתנו לי כאמא בחברה שלהם
            </p>
          </div>

          {/* Call to action */}
          <div className="pt-6 mt-6 border-t-2 border-gray-100">
            <p className="text-center text-gray-800">
              אז זאת אני<br />
              <span className="font-medium">רוצים להכיר את אושייה?</span>
            </p>
            <p className="text-center mt-4">
              יאללה, בואו ל
              <button
                onClick={onNavigateToWhat}
                className="text-purple-600 hover:text-purple-700 font-medium underline mx-1"
              >
                מה אני
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}