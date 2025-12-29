import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { X, ArrowLeft, Shield } from 'lucide-react';

interface OTPVerificationProps {
  phoneNumber: string;
  onClose: () => void;
  onVerify: (code: string) => Promise<void>;
  onResend: () => void;
}

export function OTPVerification({ phoneNumber, onClose, onVerify, onResend }: OTPVerificationProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (codeStr?: string) => {
    const verificationCode = codeStr || code.join('');
    
    if (verificationCode.length !== 6) {
      setError('אנא הזינו את כל הספרות');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      await onVerify(verificationCode);
      setIsSuccess(true);
      // Close after showing success for 2 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    } catch (error: unknown) {
      console.error('Error verifying OTP:', error);
      setError('קוד שגוי. נסו שוב.');
      setIsVerifying(false);
    }
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
        {isSuccess ? (
          // Success view
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">אימות הושלם בהצלחה!</h2>
            <p className="text-gray-600">
              המספר שלך אומת ואושר
            </p>
          </div>
        ) : (
          <>
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
                    ref={el => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-semibold rounded-xl border-2 border-gray-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white transition-all duration-200 disabled:opacity-50"
                    aria-label={`Digit ${index + 1}`}
                    disabled={isVerifying || isSuccess}
                  />
                ))}
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <button
                onClick={() => handleVerify()}
                disabled={isVerifying || isSuccess}
                className={`w-full bg-purple-600 text-white px-4 py-3 rounded-xl hover:bg-purple-700 transition-all duration-200 hover:scale-[1.01] shadow-sm flex items-center justify-center gap-2 ${
                  isVerifying || isSuccess ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                style={{ minHeight: '44px' }}
              >
                {isVerifying ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>מאמת...</span>
                  </>
                ) : (
                  <>
                    <span>אישור</span>
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  onClick={onResend}
                  disabled={isVerifying || isSuccess}
                  className="text-sm text-purple-600 hover:text-purple-700 underline disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  לא קיבלתי קוד - שלחו שוב
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}