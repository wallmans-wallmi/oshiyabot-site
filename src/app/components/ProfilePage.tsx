import React, { useState, useEffect } from 'react';
import { User, Edit2, Plus, X, Crown, LogOut } from 'lucide-react';
import { LogoutConfirmDialog } from './LogoutConfirmDialog';

interface ProfilePageProps {
  onBack: () => void;
  firstName?: string;
  phoneNumber?: string;
  gender?: 'male' | 'female';
  onUpdateName?: (newName: string) => void;
  onUpdatePhone?: (newPhone: string) => void;
  onUpdateGender?: (gender: 'male' | 'female' | null) => void;
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
  const [isEditingGender, setIsEditingGender] = useState(false);
  const [editedGender, setEditedGender] = useState<'male' | 'female' | null>(gender || null);
  const [renewalReminderEnabled, setRenewalReminderEnabled] = useState(true);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Sync editedGender when gender prop changes (when not editing)
  useEffect(() => {
    if (!isEditingGender) {
      setEditedGender(gender || null);
    }
  }, [gender, isEditingGender]);

  const handleSaveName = () => {
    if (editedName.trim() && onUpdateName) {
      onUpdateName(editedName.trim());
    }
    setIsEditingName(false);
  };

  const handleSavePhone = () => {
    if (editedPhone.trim() && onUpdatePhone) {
      onUpdatePhone(editedPhone.trim());
    }
    setIsEditingPhone(false);
  };

  const handleSaveGender = () => {
    if (onUpdateGender) {
      onUpdateGender(editedGender);
    }
    setIsEditingGender(false);
  };

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
                {!isEditingName && (
                  <button
                    onClick={() => {
                      setIsEditingName(true);
                      setEditedName(firstName || '');
                    }}
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-800 transition-colors"
                  >
                    {firstName ? (
                      <>
                        <Edit2 className="w-4 h-4" />
                        <span className="text-sm">ערוך</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span className="text-sm">הוסף</span>
                      </>
                    )}
                  </button>
                )}
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
                {!isEditingPhone && (
                  <button
                    onClick={() => {
                      setIsEditingPhone(true);
                      setEditedPhone(phoneNumber || '');
                    }}
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-800 transition-colors"
                  >
                    {phoneNumber ? (
                      <>
                        <Edit2 className="w-4 h-4" />
                        <span className="text-sm">ערוך</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span className="text-sm">הוסף</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              {isEditingPhone ? (
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
                      className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      שמור
                    </button>
                    <button
                      onClick={() => setIsEditingPhone(false)}
                      className="flex-1 border-2 border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      ביטול
                    </button>
                  </div>
                </div>
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
                {!isEditingGender && (
                  <button
                    onClick={() => {
                      setIsEditingGender(true);
                      setEditedGender(gender || null);
                    }}
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-800 transition-colors"
                  >
                    {gender ? (
                      <>
                        <Edit2 className="w-4 h-4" />
                        <span className="text-sm">ערוך</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span className="text-sm">הוסף</span>
                      </>
                    )}
                  </button>
                )}
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
                      className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
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
                <p className="text-gray-600 text-lg font-normal">
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