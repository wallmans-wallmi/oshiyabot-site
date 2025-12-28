import React, { useState, useEffect } from 'react';
import { X, Settings } from 'lucide-react';
import { Switch } from './ui/switch';
import { AccessibilityButton } from './AccessibilityButton';
import { AccessibilityMenu } from './AccessibilityMenu';

interface SettingsPageProps {
  onClose: () => void;
  isDesktop?: boolean;
}

// Custom Radio Button Component
interface RadioButtonProps {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: React.ReactNode;
}

function RadioButton({ id, name, value, checked, onChange, label }: RadioButtonProps) {
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
}

export function SettingsPage({ onClose, isDesktop }: SettingsPageProps) {
  // Section 1 - Notifications
  const [whatsappNotifications, setWhatsappNotifications] = useState(() => {
    const saved = localStorage.getItem('oshiya-whatsapp-notifications');
    return saved ? JSON.parse(saved) : true;
  });
  const [notificationTime, setNotificationTime] = useState<'all-day' | 'daytime'>(() => {
    const saved = localStorage.getItem('oshiya-notification-time');
    return (saved as 'all-day' | 'daytime') || 'daytime';
  });

  // Section 2 - Update level
  const [updateLevel, setUpdateLevel] = useState<'calm' | 'balanced' | 'aggressive'>(() => {
    const saved = localStorage.getItem('oshiya-update-level');
    return (saved as 'calm' | 'balanced' | 'aggressive') || 'balanced';
  });

  // Section 3 - Default goal for new products
  const [newProductGoal, setNewProductGoal] = useState<'percentage' | 'amount' | 'smart'>(() => {
    const saved = localStorage.getItem('oshiya-new-product-goal');
    return (saved as 'percentage' | 'amount' | 'smart') || 'smart';
  });

  const [isAccessibilityMenuOpen, setIsAccessibilityMenuOpen] = useState(false);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('oshiya-whatsapp-notifications', JSON.stringify(whatsappNotifications));
  }, [whatsappNotifications]);

  useEffect(() => {
    localStorage.setItem('oshiya-notification-time', notificationTime);
  }, [notificationTime]);

  useEffect(() => {
    localStorage.setItem('oshiya-update-level', updateLevel);
  }, [updateLevel]);

  useEffect(() => {
    localStorage.setItem('oshiya-new-product-goal', newProductGoal);
  }, [newProductGoal]);

  return (
    <div className={`${isDesktop ? 'h-full min-h-full overflow-y-auto bg-gradient-to-br from-purple-50 to-pink-50' : 'min-h-screen bg-gradient-to-br from-purple-50 to-pink-50'}`} dir="rtl">
      {/* Header - only show close button on mobile */}
      {!isDesktop && (
      <div className="sticky top-0 bg-gradient-to-br from-purple-50 to-pink-50 px-4 py-3 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-600" />
            <h2 className="font-bold text-gray-900">ההגדרות שלי</h2>
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
        {/* Settings Icon & Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center">
            <Settings className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            ההגדרות שלי
          </h2>
          <p className="text-gray-600">שולטים איך ומתי אושייה מעדכנת אותך</p>
        </div>

        {/* Section 1 - Notifications */}
        <section className="mb-4">
          <div className="bg-white rounded-2xl p-5">
            <h3 className="text-xl font-bold text-gray-900 mb-6">התראות בוואטסאפ</h3>
          
            <div className="space-y-6">
              {/* Toggle */}
              <div className="flex items-center justify-between py-3">
                <label htmlFor="whatsapp-toggle" className="flex-1 cursor-pointer text-gray-900">
                  קבלת התראות בוואטסאפ
                </label>
                <Switch
                  id="whatsapp-toggle"
                  checked={whatsappNotifications}
                  onCheckedChange={(checked) => setWhatsappNotifications(checked)}
                  className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-gray-300"
                />
              </div>

              {/* Notification time - only show when notifications are enabled */}
              {whatsappNotifications && (
                <div>
                  <fieldset>
                    <legend className="text-sm font-semibold text-gray-900 mb-3">מתי לקבל התראות?</legend>
                    <div className="space-y-0 pr-2">
                      <RadioButton
                        id="notification-time-all-day"
                        name="notification-time"
                        value="all-day"
                        checked={notificationTime === 'all-day'}
                        onChange={(e) => setNotificationTime(e.target.value as 'all-day')}
                        label="כל היום"
                      />
                      <RadioButton
                        id="notification-time-daytime"
                        name="notification-time"
                        value="daytime"
                        checked={notificationTime === 'daytime'}
                        onChange={(e) => setNotificationTime(e.target.value as 'daytime')}
                        label={
                          <>
                            בשעות היום <span className="text-sm text-gray-400">(9:00-21:00)</span>
                          </>
                        }
                      />
                    </div>
                  </fieldset>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section 2 - Update level */}
        <section className="mb-4">
          <div className="bg-white rounded-2xl p-5">
            <h3 className="text-xl font-bold text-gray-900 mb-6">רמת העדכונים</h3>
          
            <div>
              <fieldset>
                <legend className="text-sm font-semibold text-gray-900 mb-3">כמה בא לך לדעת על שינויים במחיר?</legend>
                <div className="space-y-0 pr-2">
                  <RadioButton
                    id="update-level-calm"
                    name="update-level"
                    value="calm"
                    checked={updateLevel === 'calm'}
                    onChange={(e) => setUpdateLevel(e.target.value as 'calm')}
                    label="רגועה – רק כשיש ירידה ממש משמעותית"
                  />
                  <RadioButton
                    id="update-level-balanced"
                    name="update-level"
                    value="balanced"
                    checked={updateLevel === 'balanced'}
                    onChange={(e) => setUpdateLevel(e.target.value as 'balanced')}
                    label="מאוזנת – התראות כשיש ירידת מחיר שכדאי לדעת עליה"
                  />
                  <RadioButton
                    id="update-level-aggressive"
                    name="update-level"
                    value="aggressive"
                    checked={updateLevel === 'aggressive'}
                    onChange={(e) => setUpdateLevel(e.target.value as 'aggressive')}
                    label="אגרסיבית – כל שינוי קטן במחיר ישר אצלך"
                  />
                </div>
              </fieldset>
            </div>
          </div>
        </section>

        {/* Section 3 - Default goal for new products */}
        <section className="mb-4">
          <div className="bg-white rounded-2xl p-5">
            <h3 className="text-xl font-bold text-gray-900 mb-6">הגדרת יעד למוצר חדש</h3>
          
            <div className="space-y-8">
              {/* New product goal */}
              <div>
                <fieldset>
                  <legend className="text-sm font-semibold text-gray-900 mb-3">מה נחשב ירידת מחיר ששווה לעצור בשבילה?</legend>
                  <div className="space-y-0 pr-2">
                    <RadioButton
                      id="new-product-goal-percentage"
                      name="new-product-goal"
                      value="percentage"
                      checked={newProductGoal === 'percentage'}
                      onChange={(e) => setNewProductGoal(e.target.value as 'percentage')}
                      label="כשהמחיר יורד באחוז מסוים"
                    />
                    <RadioButton
                      id="new-product-goal-amount"
                      name="new-product-goal"
                      value="amount"
                      checked={newProductGoal === 'amount'}
                      onChange={(e) => setNewProductGoal(e.target.value as 'amount')}
                      label="כשהמחיר יורד בסכום מסוים"
                    />
                    <RadioButton
                      id="new-product-goal-smart"
                      name="new-product-goal"
                      value="smart"
                      checked={newProductGoal === 'smart'}
                      onChange={(e) => setNewProductGoal(e.target.value as 'smart')}
                      label={
                        <div>
                          <div>תבחרי לי משהו חכם לפי סוג המוצר</div>
                          <div className="text-sm text-gray-400">(למשל חמישה עשר אחוז על גאדג'טים או מאה שקלים על מוצרי חשמל גדולים)</div>
                        </div>
                      }
                    />
                  </div>
                </fieldset>
              </div>

              {/* Helper text */}
              <p className="text-sm text-gray-500 leading-relaxed">
                ההגדרה תחול אוטומטית על כל מוצר חדש שנוסף, ותמיד אפשר לשנות אחר כך
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* Accessibility Button */}
      <AccessibilityButton onClick={() => setIsAccessibilityMenuOpen(true)} />
      
      {/* Accessibility Menu */}
      <AccessibilityMenu
        isOpen={isAccessibilityMenuOpen}
        onClose={() => setIsAccessibilityMenuOpen(false)}
        onNavigateToStatement={() => {
          setIsAccessibilityMenuOpen(false);
          // Note: Navigation to accessibility statement would need to be handled by parent
        }}
      />
    </div>
  );
}