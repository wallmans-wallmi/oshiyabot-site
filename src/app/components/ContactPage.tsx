import React from 'react';
import Image from 'next/image';
import { X, MessageCircle, Mail } from 'lucide-react';
const oshiyaAvatar = '/assets/653a3723dbd14f47ecc15c0eb95c1efeff5624a9.png';

interface ContactPageProps {
  onClose?: () => void;
  isDesktop?: boolean;
}

export function ContactPage({ onClose, isDesktop = false }: ContactPageProps) {
  return (
    <div className={`${isDesktop ? 'h-full overflow-y-auto' : 'fixed inset-0 z-50 overflow-y-auto'} bg-gradient-to-br from-purple-50 to-pink-50`} dir="rtl">
      {/* Header - only show close button on mobile */}
      {!isDesktop && onClose && (
        <div className="sticky top-0 bg-gradient-to-br from-purple-50 to-pink-50 px-4 py-3 z-10">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-purple-600" />
              <h2 className="font-bold text-gray-900">צור קשר</h2>
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
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Avatar */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Image
                src={oshiyaAvatar}
                alt="Oshiya"
                width={160}
                height={160}
                className="w-40 h-40 rounded-full object-cover border-4 border-purple-300"
              />
              <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-4 border-white flex items-center justify-center">
                <span className="text-white text-xl">✨</span>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">
            משהו לא הסתדר?
          </h2>
          <p className="text-gray-600">או שכן הסתדר, אבל מתחשק לשתף?</p>
        </div>
        
        {/* Contact Options */}
        <div className="space-y-4 mb-8">
          {/* WhatsApp */}
          <a
            href="https://wa.me/972501234567"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-2xl p-5 active:bg-gray-50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  וואטסאפ
                  <span className="text-sm text-gray-600 font-normal mr-2">– תמיד פתוח</span>
                </h3>
                <p className="text-sm text-gray-600 text-right" dir="ltr">
                  050-123-4567
                </p>
              </div>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:support@oshiya.co.il"
            className="block bg-white rounded-2xl p-5 active:bg-gray-50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  מייל
                  <span className="text-sm text-gray-600 font-normal mr-2">– אם את בקטע של לכתוב כמו ב-2009</span>
                </h3>
                <p className="text-sm text-gray-600">
                  support@oshiya.co.il
                </p>
              </div>
            </div>
          </a>
        </div>

        {/* Footer message */}
        <p className="text-gray-600 text-sm leading-relaxed text-center">
          יש בעיה, שאלה, או הברקה גאונית? תכתבי לי.<br />
          אני עונה כשאני מתפנה, לא עם אוטומציה כמה –<br />
          אלא עם ראש (יחסית) מפוקס וקפה ביד.
        </p>
      </div>
    </div>
  );
}