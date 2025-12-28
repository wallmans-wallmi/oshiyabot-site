import React, { useState, useRef, useEffect } from 'react';
import { X, ArrowRight, Shield } from 'lucide-react';

interface OTPVerificationProps {
  phoneNumber: string;
  onClose: () => void;
  onVerify: (code: string) => void;
  onResend: () => void;
}

export function OTPVerification({ phoneNumber, onClose, onVerify, onResend }: OTPVerificationProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only take last character
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (newCode.every(digit => digit) && index === 5) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (codeStr?: string) => {
    const verificationCode = codeStr || code.join('');
    
    if (verificationCode.length !== 6) {
      setError('אנא הזינו את כל הספרות');
      return;
    }

    onVerify(verificationCode);
  };

  const maskedPhone = phoneNumber.slice(0, 3) + '***' + phoneNumber.slice(-4);

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3 shadow-sm z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            <h2 className="font-bold text-gray-900">אימות מספר</h2>
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
            <span className="text-3xl">💬</span>
          </div>
          <p className="text-gray-600 mb-2">
            שלחנו לך קוד בוואטסאפ
          </p>
          <p className="text-sm text-gray-500">
            למספר {maskedPhone}
          </p>
        </div>

        <div className="space-y-6">
          {/* OTP Input */}
          <div dir="ltr" className="flex gap-2 justify-center">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-semibold rounded-xl border-2 border-gray-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white transition-all duration-200"
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            onClick={() => handleVerify()}
            className="w-full bg-purple-600 text-white px-4 py-3 rounded-xl hover:bg-purple-700 transition-all duration-200 hover:scale-[1.01] shadow-sm flex items-center justify-center gap-2"
            style={{ minHeight: '44px' }}
          >
            <span>אישור</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center">
            <button
              onClick={onResend}
              className="text-sm text-purple-600 hover:text-purple-700 underline"
            >
              לא קיבלתי קוד - שלחו שוב
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}