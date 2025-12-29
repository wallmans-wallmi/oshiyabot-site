'use client';

import { useState, useRef, type KeyboardEvent } from 'react';
import { ArrowLeft, Loader2, X } from 'lucide-react';
import { supabaseAuth } from '@/lib/supabase/client-auth';

interface LoginFlowProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

type LoginState = 'phone-input' | 'sending-otp' | 'otp-input' | 'verifying' | 'error';

export function LoginFlow({ onClose, onSuccess }: LoginFlowProps) {
  const [phone, setPhone] = useState('');
  const [loginState, setLoginState] = useState<LoginState>('phone-input');
  const [statusMessage, setStatusMessage] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [phoneE164, setPhoneE164] = useState('');

  // Convert Israeli format to E.164
  const toE164 = (israeliPhone: string): string => {
    const cleaned = israeliPhone.trim().replace(/\s/g, '');
    if (cleaned.startsWith('05')) {
      return '+972' + cleaned.slice(1);
    }
    return cleaned.startsWith('+972') ? cleaned : '+972' + cleaned;
  };

  // Send OTP
  const handleSendOTP = async () => {
    const trimmedPhone = phone.trim().replace(/\s/g, '');
    const isValid = /^05\d{8}$/.test(trimmedPhone);

    if (!isValid) {
      setStatusMessage('מספר טלפון לא תקין. אנא הזינו מספר בתבנית 05XXXXXXXX');
      setLoginState('error');
      return;
    }

    const e164 = toE164(trimmedPhone);
    setPhoneE164(e164);
    setLoginState('sending-otp');
    setStatusMessage('שולח קוד אימות...');
    setOtpError('');

    try {
      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_e164: e164 }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('OTP send failed:', data);
        throw new Error(data.error || 'Failed to send OTP');
      }

      setLoginState('otp-input');
      setStatusMessage('הזינו את הקוד שנשלח אליכם');
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (error: unknown) {
      console.error('Error sending OTP:', error);
      const errorMessage = error instanceof Error ? error.message : 'שגיאה בשליחת הקוד. נסו שוב.';
      setStatusMessage(errorMessage);
      setLoginState('error');
    }
  };

  // Handle OTP input change
  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...otpCode];
    newCode[index] = value.slice(-1);
    setOtpCode(newCode);
    setOtpError('');

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (newCode.every(digit => digit) && index === 5) {
      handleVerifyOTP(newCode.join(''));
    }
  };

  // Handle OTP keydown
  const handleOTPKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP and create session
  const handleVerifyOTP = async (codeStr?: string) => {
    const code = codeStr || otpCode.join('');
    
    if (code.length !== 6) {
      setOtpError('אנא הזינו את כל הספרות');
      return;
    }

    setLoginState('verifying');
    setStatusMessage('בודק את הקוד...');
    setOtpError('');

    try {
      // Verify OTP
      const verifyResponse = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_e164: phoneE164, code }),
      });

      if (!verifyResponse.ok) {
        const data = await verifyResponse.json();
        throw new Error(data.error || 'Invalid OTP code');
      }

      // OTP verified - now create Supabase Auth session (if configured)
      // In development mode, we can skip auth session creation if Supabase Auth is not configured
      if (supabaseAuth) {
        // Create or sign in user with phone as identifier
        const tempEmail = `${phoneE164}@temp.oshiya`;
        
        try {
          // Try to sign in first
          const signInResult = await supabaseAuth.auth.signInWithPassword({
            email: tempEmail,
            password: phoneE164,
          });

          // If user doesn't exist, sign up
          if (signInResult.error) {
            const signUpResult = await supabaseAuth.auth.signUp({
              email: tempEmail,
              password: phoneE164,
              options: {
                data: {
                  phone_e164: phoneE164,
                },
              },
            });

            if (signUpResult.error) {
              console.warn('Could not create auth session (continuing in dev mode):', signUpResult.error);
              // In development, continue even if auth session creation fails
              if (process.env.NODE_ENV !== 'development') {
                throw new Error(signUpResult.error.message);
              }
            }
          }
        } catch (authError) {
          console.warn('Auth session creation failed (continuing in dev mode):', authError);
          // In development, continue even if auth session creation fails
          if (process.env.NODE_ENV !== 'development') {
            throw authError;
          }
        }
      } else {
        // Supabase Auth not configured - in development mode, we'll just mark as logged in locally
        if (process.env.NODE_ENV === 'development') {
          console.log('🧪 Dev mode: Skipping Supabase Auth session creation');
          // Store login state in localStorage for development
          if (typeof window !== 'undefined') {
            localStorage.setItem('oshiya-logged-in', 'true');
            localStorage.setItem('oshiya-phone', phoneE164);
          }
        } else {
          throw new Error('Auth not configured');
        }
      }

      // OTP verified successfully - redirect immediately via onSuccess callback
      if (onSuccess) {
        onSuccess();
      } else {
        // Use window.location for navigation
        window.location.href = '/chat';
      }
    } catch (error: unknown) {
      console.error('Error verifying OTP:', error);
      const errorMessage = error instanceof Error ? error.message : 'קוד שגוי. נסו שוב.';
      setLoginState('otp-input');
      setOtpError(errorMessage);
    }
  };

  // Handle resend OTP
  const handleResend = async () => {
    setOtpCode(['', '', '', '', '', '']);
    setOtpError('');
    setStatusMessage('שולח קוד חדש...');

    try {
      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_e164: phoneE164 }),
      });

      if (!response.ok) {
        throw new Error('Failed to send OTP');
      }

      setStatusMessage('קוד נשלח בהצלחה');
      otpInputRefs.current[0]?.focus();
    } catch (error: unknown) {
      console.error('Error resending OTP:', error);
      setStatusMessage('שגיאה בשליחת הקוד. נסו שוב.');
    }
  };

  const maskedPhone = phoneE164.slice(0, 3) + '***' + phoneE164.slice(-4);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-50 to-pink-50 z-50 overflow-y-auto" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-br from-purple-50 to-pink-50 px-4 py-3 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-center relative">
          <h2 className="font-bold text-gray-900 text-center">כניסה לאזור האישי</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="absolute left-4 p-2 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="סגור"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        {loginState === 'phone-input' || loginState === 'error' ? (
          <>
            {/* Avatar/Icon Section */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center">
                <span className="text-3xl">👋</span>
              </div>
              <p className="text-gray-600">
                הכניסה מתבצעת עם מספר הוואצאפ שלך
              </p>
            </div>

            {/* Form Section */}
            <div className="space-y-4">
              <div>
                <input
                  id="login-phone-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="מספר טלפון (לדוגמה: 0501234567)"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white transition-all duration-200"
                  style={{ minHeight: '44px' }}
                  inputMode="tel"
                  dir="ltr"
                  aria-label="מספר טלפון WhatsApp"
                />
                {statusMessage && loginState === 'error' && (
                  <p className="text-sm text-red-500 mt-2">{statusMessage}</p>
                )}
              </div>

              <button
                onClick={handleSendOTP}
                disabled={!phone.trim()}
                className={`w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium flex items-center justify-center gap-2 ${
                  phone.trim()
                    ? 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-[1.01] shadow-sm'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                style={{ minHeight: '44px' }}
              >
                <span>שלחו לי קוד</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : loginState === 'otp-input' || loginState === 'verifying' ? (
          <>
            {/* Avatar/Icon Section */}
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

            {/* OTP Input Section */}
            <div className="space-y-4">
              {statusMessage && (
                <p className="text-sm text-center text-gray-600">
                  {statusMessage}
                </p>
              )}

              {/* OTP Input */}
              <div dir="ltr" className="flex gap-2 justify-center">
                {otpCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => { otpInputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-semibold rounded-xl border-2 border-gray-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white transition-all duration-200 disabled:opacity-50"
                    aria-label={`Digit ${index + 1}`}
                    disabled={loginState === 'verifying'}
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-sm text-red-500 text-center">{otpError}</p>
              )}

              <button
                onClick={() => handleVerifyOTP()}
                disabled={loginState === 'verifying' || otpCode.some(d => !d)}
                className={`w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium flex items-center justify-center gap-2 ${
                  !loginState.includes('verifying') && otpCode.every(d => d)
                    ? 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-[1.01] shadow-sm'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                style={{ minHeight: '44px' }}
              >
                {loginState === 'verifying' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>בודק את הקוד...</span>
                  </>
                ) : (
                  <>
                    <span>אישור</span>
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex justify-between items-center mt-3">
                <button
                  onClick={handleResend}
                  disabled={loginState === 'verifying'}
                  className="text-sm text-purple-600 hover:text-purple-700 underline disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  לא קיבלתי קוד - שלחו שוב
                </button>
                <button
                  onClick={() => {
                    setLoginState('phone-input');
                    setPhoneE164('');
                    setOtpCode(['', '', '', '', '', '']);
                    setOtpError('');
                    setStatusMessage('');
                  }}
                  disabled={loginState === 'verifying'}
                  className="text-sm text-purple-600 hover:text-purple-700 underline disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  שנה מספר וואטסאפ
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

