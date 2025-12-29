import React, { useState, useEffect, useRef } from 'react';
import { User, Edit2, Plus, X, Crown, LogOut, ArrowLeft } from 'lucide-react';
import { LogoutConfirmDialog } from './LogoutConfirmDialog';
import { type Gender } from '@/lib/utils/genderPhrasing';

interface ProfilePageProps {
  onBack: () => void;
  firstName?: string;
  phoneNumber?: string;
  gender?: Gender;
  onUpdateName?: (newName: string) => void;
  onUpdatePhone?: (newPhone: string) => Promise<void>;
  onUpdateGender?: (gender: Gender) => void;
  isLoggedIn?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
  isDesktop?: boolean;
  // Subscription props
  isPremium?: boolean;
  subscriptionType?: 'monthly' | 'yearly';
  renewalDate?: string;
  activeTrackings?: number;
  onUpgradeToPremium?: () => void;
  onCancelSubscription?: () => void;
  // Feature flag to hide premium features
  enablePremium?: boolean;
}

export function ProfilePage({ 
  onBack, 
  firstName, 
  phoneNumber,
  gender,
  onUpdateName,
  onUpdatePhone,
  onUpdateGender,
  isLoggedIn = false,
  onLogin,
  onLogout,
  isDesktop = false,
  // Subscription props
  isPremium = false,
  subscriptionType,
  renewalDate,
  activeTrackings,
  onUpgradeToPremium,
  onCancelSubscription,
  enablePremium = true
}: ProfilePageProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(firstName || '');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editedPhone, setEditedPhone] = useState(phoneNumber || '');
  const [initialPhone, setInitialPhone] = useState(phoneNumber || ''); // Track initial phone when editing starts
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [pendingPhoneForOTP, setPendingPhoneForOTP] = useState('');
  const [isEditingGender, setIsEditingGender] = useState(false);
  const [editedGender, setEditedGender] = useState<Gender>(gender || null);
  const [renewalReminderEnabled, setRenewalReminderEnabled] = useState(true);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Sync editedGender when gender prop changes (when not editing)
  useEffect(() => {
    if (!isEditingGender) {
      setEditedGender(gender || null);
    }
  }, [gender, isEditingGender]);

  // Sync editedPhone when phoneNumber prop changes (when not editing)
  useEffect(() => {
    if (!isEditingPhone && !showOTPVerification) {
      setEditedPhone(phoneNumber || '');
      setInitialPhone(phoneNumber || '');
    }
  }, [phoneNumber, isEditingPhone, showOTPVerification]);

  const handleSaveName = () => {
    if (editedName.trim() && onUpdateName) {
      onUpdateName(editedName.trim());
    }
    setIsEditingName(false);
  };

  const handleSavePhone = async () => {
    const trimmedPhone = editedPhone.trim().replace(/\s/g, '');
    const isValidIsraeliPhone = /^05\d{8}$/.test(trimmedPhone);

    if (!isValidIsraeliPhone) {
      alert('מספר טלפון לא תקין. אנא הזינו מספר בתבנית 05XXXXXXXX');
      return;
    }

    // Convert to E.164 format
    const phoneE164 = '+972' + trimmedPhone.slice(1);

    // Store the phone and send OTP
    setPendingPhoneForOTP(trimmedPhone);
    setOtpError('');
    
    try {
      // Send OTP
      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_e164: phoneE164 }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send OTP');
      }

      // Show OTP verification inline
      setShowOTPVerification(true);
      // Focus first OTP input after a brief delay to ensure it's rendered
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'שגיאה בשליחת הקוד. נסו שוב.';
      alert(errorMessage);
    }
  };

  // Handle OTP input change
  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newCode = [...otpCode];
    newCode[index] = value.slice(-1); // Only take last character
    setOtpCode(newCode);
    setOtpError('');

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (newCode.every(digit => digit) && index === 5) {
      handleOTPVerify(newCode.join(''));
    }
  };

  // Handle OTP keydown (backspace)
  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const [isOTPVerifying, setIsOTPVerifying] = useState(false);
  const [isOTPSuccess, setIsOTPSuccess] = useState(false);

  // Handle OTP verification
  const handleOTPVerify = async (codeStr?: string) => {
    const verificationCode = codeStr || otpCode.join('');
    
    if (verificationCode.length !== 6) {
      setOtpError('אנא הזינו את כל הספרות');
      return;
    }

    setIsOTPVerifying(true);
    setOtpError('');

    try {
      if (!pendingPhoneForOTP) {
        throw new Error('מספר טלפון לא זמין');
      }

      // Convert to E.164 format
      const phoneE164 = '+972' + pendingPhoneForOTP.slice(1);

      // Verify OTP via API
      const verifyResponse = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_e164: phoneE164, code: verificationCode }),
      });

      if (!verifyResponse.ok) {
        const data = await verifyResponse.json();
        throw new Error(data.error || 'Invalid OTP code');
      }

      // Update phone via API
      const updateResponse = await fetch('/api/user/update-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_e164: phoneE164 }),
      });

      if (!updateResponse.ok) {
        const data = await updateResponse.json();
        throw new Error(data.error || 'Failed to update phone number');
      }

      // Update local state via callback (only to sync with parent state, no navigation)
      // This is safe because onUpdatePhone in App.tsx only updates conversationState
      if (onUpdatePhone) {
        await onUpdatePhone(pendingPhoneForOTP);
      }

      setIsOTPSuccess(true);
      
      // Update editedPhone to show the new number immediately
      setEditedPhone(pendingPhoneForOTP);
      setInitialPhone(pendingPhoneForOTP);
      
      // Reset OTP state after showing success
      setTimeout(() => {
        setOtpCode(['', '', '', '', '', '']);
        setOtpError('');
        setShowOTPVerification(false);
        setIsEditingPhone(false);
        setPendingPhoneForOTP('');
        setIsOTPVerifying(false);
        setIsOTPSuccess(false);
      }, 2000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'קוד שגוי. נסו שוב.';
      setOtpError(errorMessage);
      setIsOTPVerifying(false);
    }
  };

  // Handle OTP resend
  const handleOTPResend = () => {
    // TODO: Implement OTP resend API call
    console.log('Resending OTP to:', pendingPhoneForOTP);
    setOtpCode(['', '', '', '', '', '']);
    setOtpError('');
  };

  // Handle cancel OTP verification
  const handleCancelOTP = () => {
    setShowOTPVerification(false);
    setOtpCode(['', '', '', '', '', '']);
    setOtpError('');
    setPendingPhoneForOTP('');
    // Return to editing phone
    setIsEditingPhone(true);
  };

  const handleSaveGender = () => {
    if (onUpdateGender) {
      onUpdateGender(editedGender);
    }
    setIsEditingGender(false);
  };

  // Check if phone value has changed from initial value
  // Save button should be enabled if:
  // 1. Phone has changed from initial value (for editing existing number), OR
  // 2. Phone is not empty and initial was empty (for first-time entry)
  const hasPhoneChanged = editedPhone.trim() !== initialPhone.trim() && editedPhone.trim() !== '';

  // Check if gender value has changed
  const hasGenderChanged = editedGender !== gender;

  // Custom Radio Button Component (reused from SettingsPage pattern)
  const RadioButton = ({ id, name, value, checked, onChange, label }: {
    id: string;
    name: string;
    value: 'male' | 'female';
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
  }) => {
    return (
      <label className="flex items-start cursor-pointer group py-3">
        <div className="relative flex items-center ml-4 mt-0.5">
          <input
            type="radio"
            id={id}
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            className="sr-only"
          />
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
            checked ? 'border-purple-600 bg-white' : 'border-gray-400 bg-white'
          }`}>
            {checked && (
              <div className="w-2 h-2 rounded-full bg-purple-600" />
            )}
          </div>
        </div>
        <span className={`${checked ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>{label}</span>
      </label>
    );
  };

  return (
    <div className={`${isDesktop ? 'h-full min-h-full overflow-y-auto' : 'overflow-y-auto'} bg-gradient-to-br from-purple-50 to-pink-50`} dir="rtl" style={!isDesktop ? { minHeight: '100dvh', height: '100dvh' } : undefined}>
      {/* Header - only show close button on mobile */}
      {!isDesktop && (
      <div className="sticky top-0 bg-gradient-to-br from-purple-50 to-pink-50 px-4 py-3 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            <h2 className="font-bold text-gray-900">הפרופיל שלי</h2>
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
        {/* Content */}
        <div className="space-y-4">
          {/* Avatar */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {firstName ? `היי, ${firstName}!` : 'היי!'}
            </h2>
            <p className="text-gray-600">זה הפרופיל שלך</p>
          </div>
          
          {/* Personal Info Cards */}
          <div className="space-y-4">
            {/* Name Field */}
            <div className="bg-white rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">הכינוי שלי</h3>
                <button
                  onClick={() => {
                    if (isEditingName) {
                      setIsEditingName(false);
                      setEditedName(firstName || '');
                    } else {
                      setIsEditingName(true);
                      setEditedName(firstName || '');
                    }
                  }}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-800 transition-colors"
                >
                  {isEditingName ? (
                    <X className="w-4 h-4" />
                  ) : firstName ? (
                    <>
                      <Edit2 className="w-4 h-4" />
                      <span className="text-sm">עריכה</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">הוספה</span>
                    </>
                  )}
                </button>
              </div>
              {isEditingName ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none font-mono"
                    placeholder="הכינוי שלי"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveName}
                      className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      שמור
                    </button>
                    <button
                      onClick={() => setIsEditingName(false)}
                      className="flex-1 border-2 border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      ביטול
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-lg font-normal font-mono">
                  {firstName || 'לא הודר כינוי'}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div className="bg-white rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                <button
                  onClick={() => {
                    if (isEditingPhone) {
                      setIsEditingPhone(false);
                      setEditedPhone(initialPhone);
                      setShowOTPVerification(false);
                      setPendingPhoneForOTP('');
                    } else {
                      setIsEditingPhone(true);
                      const currentPhone = phoneNumber || '';
                      setEditedPhone(currentPhone);
                      setInitialPhone(currentPhone); // Store initial value when editing starts
                    }
                  }}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-800 transition-colors"
                >
                  {isEditingPhone ? (
                    <X className="w-4 h-4" />
                  ) : phoneNumber ? (
                    <>
                      <Edit2 className="w-4 h-4" />
                      <span className="text-sm">עריכה</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">הוספה</span>
                    </>
                  )}
                </button>
              </div>
              {isEditingPhone ? (
                showOTPVerification ? (
                  // OTP Verification UI
                  <div className="space-y-4">
                    <div className="text-center py-2">
                      <p className="text-gray-600 text-sm mb-1">
                        שלחנו לך קוד בוואטסאפ
                      </p>
                      <p className="text-xs text-gray-500">
                        למספר {pendingPhoneForOTP.slice(0, 3) + '***' + pendingPhoneForOTP.slice(-4)}
                      </p>
                    </div>
                    
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
                          className="w-12 h-12 text-center text-lg font-semibold rounded-lg border-2 border-gray-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white transition-all duration-200 disabled:opacity-50"
                          aria-label={`Digit ${index + 1}`}
                          disabled={isOTPVerifying || isOTPSuccess}
                        />
                      ))}
                    </div>

                    {otpError && (
                      <p className="text-sm text-red-500 text-center">{otpError}</p>
                    )}

                    <button
                      onClick={() => handleOTPVerify()}
                      className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <span>אישור</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    {!isOTPSuccess && (
                      <>
                        <div className="text-center">
                          <button
                            onClick={handleOTPResend}
                            disabled={isOTPVerifying}
                            className="text-sm text-purple-600 hover:text-purple-700 underline disabled:text-gray-400 disabled:cursor-not-allowed"
                          >
                            לא קיבלתי קוד - שלחו שוב
                          </button>
                        </div>

                        <button
                          onClick={handleCancelOTP}
                          disabled={isOTPVerifying}
                          className="w-full border-2 border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ביטול
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  // Phone Input UI
                  <div className="space-y-3">
                    <input
                      type="tel"
                      value={editedPhone}
                      onChange={(e) => setEditedPhone(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none font-mono"
                      placeholder="מספר טלפון"
                      dir="ltr"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSavePhone}
                        disabled={!hasPhoneChanged}
                        className={`flex-1 py-2 rounded-lg transition-colors ${
                          hasPhoneChanged
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        שמור
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingPhone(false);
                          setEditedPhone(initialPhone); // Revert to initial value on cancel
                        }}
                        className="flex-1 border-2 border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        ביטול
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <p className="text-gray-600 text-lg font-normal font-mono" dir="ltr" style={{ textAlign: 'right' }}>
                  {phoneNumber || 'לא הוגדר מספר'}
                </p>
              )}
            </div>

            {/* Gender Field */}
            <div className="bg-white rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">איך לפנות אליך</h3>
                  <p className="text-xs text-gray-500 mt-1">רק כדי שאדע אם לפנות אליך בלשון זכר או נקבה</p>
                </div>
                <button
                  onClick={() => {
                    if (isEditingGender) {
                      setEditedGender(gender || null);
                      setIsEditingGender(false);
                    } else {
                      setIsEditingGender(true);
                      setEditedGender(gender || null);
                    }
                  }}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-800 transition-colors"
                >
                  {isEditingGender ? (
                    <X className="w-4 h-4" />
                  ) : gender ? (
                    <>
                      <Edit2 className="w-4 h-4" />
                      <span className="text-sm">עריכה</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">הוסף</span>
                    </>
                  )}
                </button>
              </div>
              {isEditingGender ? (
                <div className="space-y-3">
                  <div className="space-y-0">
                    <RadioButton
                      id="gender-male"
                      name="gender"
                      value="male"
                      checked={editedGender === 'male'}
                      onChange={(e) => setEditedGender(e.target.value as 'male')}
                      label="גבר"
                    />
                    <RadioButton
                      id="gender-female"
                      name="gender"
                      value="female"
                      checked={editedGender === 'female'}
                      onChange={(e) => setEditedGender(e.target.value as 'female')}
                      label="אישה"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveGender}
                      disabled={!hasGenderChanged}
                      className={`flex-1 py-2 rounded-lg transition-colors ${
                        hasGenderChanged
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      שמור
                    </button>
                    <button
                      onClick={() => {
                        setEditedGender(gender || null);
                        setIsEditingGender(false);
                      }}
                      className="flex-1 border-2 border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      ביטול
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-lg font-normal font-mono">
                  {gender === 'male' ? 'גבר' : gender === 'female' ? 'אישה' : 'לא הוגדר'}
                </p>
              )}
            </div>
          </div>

          {/* Info Card */}
          <div className="mt-6">
            <p className="text-sm text-gray-700 leading-relaxed">
              לכאן אני אשלח לך התראות כשיש הזדמנות שווה покупа את המוצרים שעוקבת אחריהם. 
              רק כשזה באמת משתלם 😊
            </p>
          </div>

          {/* Subscription Section */}
          {enablePremium && (
            <div className="mt-8 space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg">המנוי שלי</h3>

            {/* Subscription Card */}
            <div className="bg-white rounded-2xl p-5">
              {!isPremium ? (
                // Free User State
                <div className="space-y-4">
                  {/* Status */}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">סטטוס:</p>
                    <p className="text-lg font-semibold text-gray-900">חינם</p>
                  </div>

                  {/* Explanation */}
                  <p className="text-sm text-gray-700">
                    אפשר לעקוב אחרי עד 3 מוצרים במקביל.
                  </p>

                  {/* Usage Indicator */}
                  <div>
                    <p className="text-sm text-gray-600 mb-2">מעקבים פעילים:</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-purple-600">
                        {activeTrackings || 0}
                      </span>
                      <span className="text-gray-500">/</span>
                      <span className="text-xl font-semibold text-gray-700">3</span>
                    </div>
                  </div>

                  {/* Upgrade Button */}
                  <button
                    onClick={onUpgradeToPremium}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Crown className="w-5 h-5" />
                    שדרוג לפרימיום
                  </button>

                  {/* Helper Text */}
                  <p className="text-xs text-gray-500 text-center">
                    אפשר לשדרג בכל רגע, בלי התחייבות.
                  </p>
                </div>
              ) : (
                // Premium User State
                <div className="space-y-4">
                  {/* Status Badge */}
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Crown className="w-5 h-5 text-purple-600" />
                      <p className="font-semibold text-purple-600">פרימיום פעיל</p>
                    </div>

                    {/* Plan Details */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">סוג מנוי:</span>
                        <span className="font-semibold text-gray-900">
                          {subscriptionType === 'monthly' ? 'חודשי' : 'שנתי'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">מחיר:</span>
                        <span className="font-semibold text-gray-900">
                          {subscriptionType === 'monthly' ? '₪29 לחודש' : '₪249 לשנה'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">תוקף המנוי:</span>
                        <span className="font-semibold text-gray-900">
                          {renewalDate || 'לא הוגדר'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Helper Text */}
                  <p className="text-sm text-gray-600">
                    יש מנוי אין פנקסנות! אני עוקבת בלי הגבלה.<br />
                    המנוי נגמר? אני עוצרת. המעקבים קופאים עד שחוזרים לעניינים
                  </p>

                  {/* Renewal Reminder Toggle */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-start justify-between gap-3">
                      <label htmlFor="renewal-reminder" className="flex-1 cursor-pointer">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          בא לך שאני אזכיר לך לפני שהמנוי נגמר? שולחת וואטסאפ 3 ימים לפני
                        </p>
                      </label>
                      <button
                        id="renewal-reminder"
                        role="switch"
                        aria-checked={renewalReminderEnabled}
                        onClick={() => setRenewalReminderEnabled(!renewalReminderEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          renewalReminderEnabled ? 'bg-purple-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            renewalReminderEnabled ? 'translate-x-1' : 'translate-x-6'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Cancel Subscription Button */}
                  <button
                    onClick={() => setShowCancelConfirmation(true)}
                    className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    ביטול מנוי
                  </button>

                  {/* Cancel Confirmation Modal */}
                  {showCancelConfirmation && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={() => setShowCancelConfirmation(false)}
                      />
                      
                      {/* Dialog - bottom sheet on mobile, centered on desktop */}
                      <div className={`fixed bg-white shadow-2xl z-50 ${
                        isDesktop 
                          ? 'inset-x-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl p-6'
                          : 'bottom-0 left-0 right-0 rounded-t-3xl p-6 animate-slide-up'
                      }`} dir="rtl">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">האם לבטל את המנוי?</h3>
                        <p className="text-sm text-gray-600 mb-6">
                          המנוי יבוטל ותחזרו למגבלה של 3 מעקבים במ��ביל.<br />
                          אפשר לחזור לפרימיום בכל רגע.
                        </p>
                        
                        <div className="space-y-2">
                          <button
                            onClick={() => {
                              setShowCancelConfirmation(false);
                              if (onCancelSubscription) {
                                onCancelSubscription();
                              }
                            }}
                            className="w-full bg-[#2d2d2d] text-white px-4 py-3 rounded-xl hover:bg-[#3d3d3d] transition-colors font-medium"
                          >
                            לבטל את המנוי
                          </button>
                          <button
                            onClick={() => setShowCancelConfirmation(false)}
                            className="w-full border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                          >
                            ביטול
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          )}

          {/* Login/Logout Button */}
          <div className="mt-6">
            {isLoggedIn ? (
              <button
                onClick={() => setShowLogoutDialog(true)}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-2xl active:bg-gray-50 active:border-gray-400 transition-all"
                style={{ minHeight: '44px' }}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">התנתקות</span>
              </button>
            ) : (
              <button
                onClick={() => onLogin?.()}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-2xl active:bg-gray-50 active:border-gray-400 transition-all"
                style={{ minHeight: '44px' }}
              >
                <span className="font-medium">התחברות</span>
                <User className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Logout confirmation dialog */}
      <LogoutConfirmDialog 
        isOpen={showLogoutDialog}
        onConfirm={() => {
          setShowLogoutDialog(false);
          onLogout?.();
        }}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </div>
  );
}