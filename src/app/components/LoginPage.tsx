import React, { useState } from 'react';
import { X, ArrowLeft, LogIn } from 'lucide-react';

interface LoginPageProps {
  onClose: () => void;
  onSendOTP: (phoneNumber: string) => void;
}

export function LoginPage({ onClose, onSendOTP }: LoginPageProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const phone = phoneNumber.replace(/\s/g, '');
    const isValidIsraeliPhone = /^05\d{8}$/.test(phone);
    
    if (!isValidIsraeliPhone) {
      setError('נראה שהמספר לא תקין. אנא בדקו שוב.');
      return;
    }
    
    setError('');
    onSendOTP(phone);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3 shadow-sm z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogIn className="w-5 h-5 text-purple-600" />
            <h2 className="font-bold text-gray-900">כניסה לאזור האישי</h2>
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

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center">
            <span className="text-3xl">👋</span>
          </div>
          <p className="text-gray-600">
            הכניסה מתבצעת עם מספר הטלפון שלך
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setError('');
              }}
              placeholder="מספר טלפון (לדוגמה: 0501234567)"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white transition-all duration-200"
              style={{ minHeight: '44px' }}
              inputMode="tel"
              dir="ltr"
              aria-label="Israeli phone number"
            />
            {error && (
              <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-purple-600 text-white px-4 py-3 rounded-xl hover:bg-purple-700 transition-all duration-200 hover:scale-[1.01] shadow-sm flex items-center justify-center gap-2"
            style={{ minHeight: '44px' }}
          >
            <span>שלחו לי קוד</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>
            לא קיבלתם קוד? נסו שוב או פנו לתמיכה
          </p>
        </div>
      </div>
    </div>
  );
}