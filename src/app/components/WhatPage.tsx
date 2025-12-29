import React from 'react';
import Image from 'next/image';
import { X, Sparkles } from 'lucide-react';
const oshiyaAvatar = "/assets/ea9d3f873ca76c584ffa18ac5550589db242a0e0.png";

interface WhatPageProps {
  onClose?: () => void;
  isDesktop?: boolean;
}

export function WhatPage({ onClose, isDesktop = false }: WhatPageProps) {
  return (
    <div className={`${isDesktop ? 'h-full' : 'fixed inset-0 z-50'} bg-gradient-to-br from-purple-50 to-pink-50 overflow-y-auto`} dir="rtl">
      {/* Header - only show close button on mobile */}
      {!isDesktop && onClose && (
        <div className="sticky top-0 bg-gradient-to-br from-purple-50 to-pink-50 px-4 py-3 z-10">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h2 className="font-bold text-gray-900">מה אני</h2>
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
            <Image
              src={oshiyaAvatar}
              alt="אושייה"
              width={160}
              height={160}
              className="w-40 h-40 rounded-full object-cover object-center border-4 border-purple-300 shadow-lg"
              priority
            />
            <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-4 border-white flex items-center justify-center">
              <span className="text-white text-xl">🛍️</span>
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="bg-white rounded-3xl p-6 md:p-8 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 text-right mb-4">מה אני</h1>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p className="font-medium text-gray-800 text-lg">
              אז מה הקטע של אושייה?
            </p>

            <p>
              פשוט:<br />
              אני פה כדי לעזור לך לדייק את הלוק,<br />
              למצוא את הפיסים הנכונים,<br />
              ולקנות רק כשזה באמת שווה את זה – בסטייל, ובמחיר.
            </p>

            <p>
              כי את לא צריכה עוד מבצע.<br />
              את צריכה מישהי שתבין אותך, את הווייב שלך, את התקציב שלך,<br />
              ותחבר לך בין סטיילינג אישי לשופינג חכם – בלי לחץ ובלי בולשיט.
            </p>

            <p>
              אני לא עוד אתר דילים,<br />
              לא תיבת ספאם שצועקת &quot;עד 70%!!!&quot;,<br />
              ולא אחת שמנסה לדחוף לך לינקים בלי שביקשת.
            </p>

            <p>
              אני אושייה –<br />
              עין לסטייל, עין להזדמנות,<br />
              ושקט בראש של מישהי שעוקבת בשבילך.
            </p>
          </div>

          {/* Call to action */}
          <div className="pt-6 mt-6 border-t-2 border-gray-100">
            <button
              onClick={onClose}
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