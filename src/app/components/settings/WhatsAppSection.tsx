'use client';

import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
import { Phone, ArrowLeft, Loader2 } from 'lucide-react';

export interface WhatsAppSectionProps {
  initialPhone?: string; // Phone in Israeli format (05XXXXXXXX) or E.164 (+972XXXXXXXX)
  onPhoneUpdate: (phone: string) => Promise<void>; // Callback when phone is successfully verified
}

type VerificationState = 'idle' | 'sending-otp' | 'waiting-for-otp' | 'verifying' | 'success' | 'error';

export function WhatsAppSection({ initialPhone, onPhoneUpdate }: WhatsAppSectionProps) {
  // Normalize phone format: convert E.164 to Israeli format for display
  const normalizePhoneForDisplay = (phone: string | undefined): string => {
    if (!phone) return '';
    if (phone.startsWith('+972')) {
      return '0' + phone.slice(4);
    }
    return phone;
  };

  const [phone, setPhone] = useState(() => normalizePhoneForDisplay(initialPhone));
  const [isDirty, setIsDirty] = useState(false);
  const [verificationState, setVerificationState] = useState<VerificationState>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Track initial phone value
  const [initialPhoneValue] = useState(() => normalizePhoneForDisplay(initialPhone));

  // Update phone when prop changes
  useEffect(() => {
    const normalized = normalizePhoneForDisplay(initialPhone);
    setPhone(normalized);
    setIsDirty(false);
    setVerificationState('idle');
    setStatusMessage('');
  }, [initialPhone]);

  // Track if phone has changed
  useEffect(() => {
    setIsDirty(phone.trim() !== initialPhoneValue.trim());
  }, [phone, initialPhoneValue]);

  // Convert Israeli format to E.164
  const toE164 = (israeliPhone: string): string => {
    const cleaned = israeliPhone.trim().replace(/\s/g, '');
    if (cleaned.startsWith('05')) {
      return '+972' + cleaned.slice(1);
    }
    return cleaned;
  };

  // Send OTP
  const sendOTP = async (phoneE164: string): Promise<void> => {
    try {
      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_e164: phoneE164 }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send OTP');
      }

      setStatusMessage('קוד נשלח בהצלחה');
    } catch (err: unknown) {
      console.error('Error sending OTP:', err);
      const errorMessage = err instanceof Error ? err.message : 'שגיאה בשליחת הקוד. נסו שוב.';
      setStatusMessage(errorMessage);
      setVerificationState('error');
      throw err;
    }
  };

  // Verify OTP and update phone
  const verifyOTP = async (phoneE164: string, code: string): Promise<void> => {
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

      // Update user phone number via API
      const updateResponse = await fetch('/api/user/update-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_e164: phoneE164 }),
      });

      if (!updateResponse.ok) {
        const data = await updateResponse.json();
        throw new Error(data.error || 'Failed to update phone number');
      }

      setStatusMessage('מספר אומת בהצלחה');
    } catch (err: unknown) {
      console.error('Error verifying OTP:', err);
      const errorMessage = err instanceof Error ? err.message : 'קוד שגוי. נסו שוב.';
      setOtpError(errorMessage);
      throw err;
    }
  };

  // Handle save button click
  const handleSave = async () => {
    const trimmedPhone = phone.trim().replace(/\s/g, '');
    const isValid = /^05\d{8}$/.test(trimmedPhone);

    if (!isValid) {
      setStatusMessage('מספר טלפון לא תקין. אנא הזינו מספר בתבנית 05XXXXXXXX');
      setVerificationState('error');
      return;
    }

    const phoneE164 = toE164(trimmedPhone);

    // Step 1: Send OTP
    setVerificationState('sending-otp');
    setStatusMessage('שולח קוד אימות...');
    setOtpError('');
    setOtpCode(['', '', '', '', '', '']);

    try {
      await sendOTP(phoneE164);
      setVerificationState('waiting-for-otp');
      setStatusMessage('הזינו את הקוד שנשלח אליכם');
      // Focus first OTP input
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch {
      // Error already handled in sendOTP
      return;
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
      handleOTPSubmit(newCode.join(''));
    }
  };

  // Handle OTP keydown
  const handleOTPKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP submit
  const handleOTPSubmit = async (codeStr?: string) => {
    const code = codeStr || otpCode.join('');
    
    if (code.length !== 6) {
      setOtpError('אנא הזינו את כל הספרות');
      return;
    }

    const trimmedPhone = phone.trim().replace(/\s/g, '');
    const phoneE164 = toE164(trimmedPhone);

    setVerificationState('verifying');
    setStatusMessage('מאמת את הקוד...');
    setOtpError('');

    try {
      await verifyOTP(phoneE164, code);
      
      // Step 3: Update phone via callback
      setStatusMessage('מעדכן מספר...');
      await onPhoneUpdate(trimmedPhone);
      
      // Step 4: Success
      setVerificationState('success');
      setStatusMessage('המספר עודכן בהצלחה');
      
      // Reset after a brief delay
      setTimeout(() => {
        setVerificationState('idle');
        setStatusMessage('');
        setIsDirty(false);
      }, 2000);
    } catch {
      setVerificationState('waiting-for-otp');
      // Error message already set in verifyOTP
    }
  };

  // Handle OTP resend
  const handleResend = async () => {
    const trimmedPhone = phone.trim().replace(/\s/g, '');
    const phoneE164 = toE164(trimmedPhone);

    setOtpCode(['', '', '', '', '', '']);
    setOtpError('');
    setStatusMessage('שולח קוד חדש...');

    try {
      await sendOTP(phoneE164);
      setStatusMessage('קוד נשלח בהצלחה');
      otpInputRefs.current[0]?.focus();
    } catch {
      // Error already handled in sendOTP
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setVerificationState('idle');
    setStatusMessage('');
    setOtpCode(['', '', '', '', '', '']);
    setOtpError('');
    setPhone(initialPhoneValue);
    setIsDirty(false);
  };

  const maskedPhone = phone.trim().replace(/\s/g, '').slice(0, 3) + '***' + phone.trim().replace(/\s/g, '').slice(-4);
  const isLoading = verificationState === 'sending-otp' || verificationState === 'verifying';
  const showOTPInput = verificationState === 'waiting-for-otp' || verificationState === 'verifying';

  return (
    <section className="mb-4">
      <div className="bg-white rounded-2xl p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-6">מספר WhatsApp</h3>
        
        {verificationState === 'idle' || verificationState === 'error' ? (
          // Phone input view
          <div className="space-y-4">
            <div>
              <label htmlFor="whatsapp-phone-input" className="block text-sm font-semibold text-gray-900 mb-2">
                מספר הטלפון שלך
              </label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="whatsapp-phone-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05XXXXXXXX"
                  className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-gray-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white transition-all duration-200"
                  style={{ minHeight: '44px' }}
                  inputMode="tel"
                  dir="ltr"
                  aria-label="מספר טלפון WhatsApp"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                שינוי המספר דורש אימות באמצעות קוד OTP
              </p>
            </div>

            {statusMessage && verificationState === 'error' && (
              <p className="text-sm text-red-500">{statusMessage}</p>
            )}

            <button
              onClick={handleSave}
              disabled={!isDirty || isLoading}
              className={`w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                isDirty && !isLoading
                  ? 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-[1.01] shadow-sm'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              style={{ minHeight: '44px' }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  שולח קוד...
                </span>
              ) : (
                'שמור מספר'
              )}
            </button>
          </div>
        ) : showOTPInput ? (
          // OTP input view
          <div className="space-y-4">
            <div className="text-center py-2">
              <p className="text-gray-600 text-sm mb-1">
                שלחנו לך קוד בוואטסאפ
              </p>
              <p className="text-xs text-gray-500">
                למספר {maskedPhone}
              </p>
            </div>

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
                  className="w-12 h-12 text-center text-lg font-semibold rounded-lg border-2 border-gray-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white transition-all duration-200"
                  aria-label={`Digit ${index + 1}`}
                  disabled={isLoading}
                />
              ))}
            </div>

            {otpError && (
              <p className="text-sm text-red-500 text-center">{otpError}</p>
            )}

            <button
              onClick={() => handleOTPSubmit()}
              disabled={isLoading || otpCode.some(d => !d)}
              className={`w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium flex items-center justify-center gap-2 ${
                !isLoading && otpCode.every(d => d)
                  ? 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-[1.01] shadow-sm'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              style={{ minHeight: '44px' }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
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
                onClick={handleResend}
                disabled={isLoading}
                className="text-sm text-purple-600 hover:text-purple-700 underline disabled:text-gray-400"
              >
                לא קיבלתי קוד - שלחו שוב
              </button>
            </div>

            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full border-2 border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ביטול
            </button>
          </div>
        ) : verificationState === 'success' ? (
          // Success view
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-600 font-medium">{statusMessage}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

