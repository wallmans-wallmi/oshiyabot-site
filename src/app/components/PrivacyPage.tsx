import React, { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import { AccessibilityButton } from './AccessibilityButton';
import { AccessibilityMenu } from './AccessibilityMenu';

interface CookiePreferences {
  essential: boolean;
  performance: boolean;
  marketing: boolean;
}

interface PrivacyPageProps {
  onClose: () => void;
  isDesktop?: boolean;
}

export function PrivacyPage({ onClose, isDesktop = false }: PrivacyPageProps) {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    performance: false,
    marketing: false,
  });
  const [isAccessibilityMenuOpen, setIsAccessibilityMenuOpen] = useState(false);

  // Load existing preferences on mount
  useEffect(() => {
    const saved = localStorage.getItem('cookieConsent');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPreferences({
          essential: true, // Always true
          performance: parsed.performance || false,
          marketing: parsed.marketing || false,
        });
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, []);

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    // Show a brief confirmation
    alert('ההעדפות שלכם נשמרו בהצלחה!');
  };

  const handleResetToDefault = () => {
    const defaultPrefs = {
      essential: true,
      performance: false,
      marketing: false,
    };
    setPreferences(defaultPrefs);
    localStorage.setItem('cookieConsent', JSON.stringify(defaultPrefs));
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 overflow-y-auto" dir="rtl" style={{ minHeight: '100dvh', height: '100dvh' }}>
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-br from-purple-50 to-pink-50 px-4 py-3 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cookie className="w-5 h-5 text-purple-600" />
            <h2 className="font-bold text-gray-900">פרטיות ועוגיות</h2>
          </div>
          {!isDesktop && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            aria-label="סגור"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        
        <div className={isDesktop ? "bg-white rounded-3xl p-6 md:p-8 space-y-8" : "space-y-8"}>
        {/* Section 1: Opening */}
        <section className="space-y-4">
          <p className="text-gray-800 leading-relaxed text-lg">
            אנחנו מכבדים את הפרטיות שלכם. לא מוכרים מידע, לא עוקבים מעבר למה שצריך, ולא מציקים.
          </p>
          <p className="text-gray-800 leading-relaxed">
            כן משתמשים בעוגיות (Cookies) – רק כדי שהאתר יעבוד חלק, כדי לשפר חוויית שימוש, וכדי להודיע כשיש משהו שווה.
          </p>
          <p className="text-gray-800 leading-relaxed">
            פה תמצאו את כל המידע, ותוכלו לבחור מה מתאים לכם.
          </p>
        </section>

        {/* Divider */}
        <div className="border-t-2 border-purple-100"></div>

        {/* Section 2: What are cookies */}
        <section className="space-y-4">
          <h2 className="font-bold text-gray-900 text-xl">אז מה זה בכלל עוגיות?</h2>
          <p className="text-gray-800 leading-relaxed">
            קבצים קטנים שנשמרים בדפדפן שלכם.
          </p>
          <p className="text-gray-800 leading-relaxed">
            הם עוזרים לנו לזכור העדפות, להבין איך השירות משמש, ולספק חוויה טובה יותר.
          </p>
        </section>

        {/* Divider */}
        <div className="border-t-2 border-purple-100"></div>

        {/* Section 3: Types of cookies */}
        <section className="space-y-4">
          <h2 className="font-bold text-gray-900 text-xl">איזה סוגי עוגיות אנחנו משתמשים?</h2>
          
          {/* Essential Cookies */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">עוגיות חיוניות</h3>
            <p className="text-gray-800 leading-relaxed">
              דרושות כדי שהאתר יפעל. לדוגמה: זיכרון ההעדפות שלכם, התחברות, שמירת סל קניות.
            </p>
            <div className="flex items-start gap-2">
              <span className="text-purple-600 font-bold leading-tight">—</span>
              <p className="text-gray-600 text-sm">תמיד פעילות – אי אפשר לכבות אותן כי בלעדיהן האתר לא יעבוד.</p>
            </div>
          </div>

          {/* Performance Cookies */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">עוגיות ביצועים</h3>
            <p className="text-gray-800 leading-relaxed">
              עוזרות לנו להבין איך משתמשים באתר – אילו דפים פופולריים, איפה יש בעיות טכניות.
            </p>
            <div className="flex items-start gap-2">
              <span className="text-purple-600 font-bold leading-tight">—</span>
              <p className="text-gray-600 text-sm">לא חובה, אבל עוזרות לנו לשפר.</p>
            </div>
          </div>

          {/* Marketing Cookies */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">עוגיות שיווקיות</h3>
            <p className="text-gray-800 leading-relaxed">
              משמשות להצגת תוכן רלוונטי ופרסומות מותאמות.
            </p>
            <div className="flex items-start gap-2">
              <span className="text-purple-600 font-bold leading-tight">—</span>
              <p className="text-gray-600 text-sm">אופציונלי לגמרי.</p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t-2 border-purple-100"></div>

        {/* Section 4: Cookie preferences */}
        <section className="space-y-4">
          <h2 className="font-bold text-gray-900 text-xl">ניהול העדפות עוגיות</h2>
          <p className="text-gray-800 leading-relaxed">
            תוכלו לשנות את ההעדפות בכל זמן:
          </p>

          {/* Toggle switches */}
          <div className="space-y-4 bg-purple-50 rounded-lg p-4">
            {/* Essential - always on */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">עוגיות חיוניות</h3>
                <p className="text-sm text-gray-600">תמיד פעילות</p>
              </div>
              <div className="w-12 h-6 bg-purple-600 rounded-full flex items-center justify-end px-1">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Performance */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">עוגיות ביצועים</h3>
                <p className="text-sm text-gray-600">לשיפור השירות</p>
              </div>
              <button
                onClick={() => setPreferences(prev => ({ ...prev, performance: !prev.performance }))}
                className={`w-12 h-6 rounded-full flex items-center transition-all ${
                  preferences.performance ? 'bg-purple-600 justify-end' : 'bg-gray-300 justify-start'
                } px-1`}
              >
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </button>
            </div>

            {/* Marketing */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">עוגיות שיווקיות</h3>
                <p className="text-sm text-gray-600">פרסומות מותאמות</p>
              </div>
              <button
                onClick={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                className={`w-12 h-6 rounded-full flex items-center transition-all ${
                  preferences.marketing ? 'bg-purple-600 justify-end' : 'bg-gray-300 justify-start'
                } px-1`}
              >
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSavePreferences}
              className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              שמירת העדפות
            </button>
            <button
              onClick={handleResetToDefault}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              איפוס
            </button>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t-2 border-purple-100"></div>

        {/* Section 5: Privacy commitment */}
        <section className="space-y-4">
          <h2 className="font-bold text-gray-900 text-xl">המחויבות שלנו לפרטיות</h2>
          <p className="text-gray-800 leading-relaxed">
            אנחנו לא אוספים מידע אישי ללא אישור, ולא משתפים נתונים עם גורמי צד שלישי למטרות שאינן קשורות לשירות.
          </p>
          <p className="text-gray-800 leading-relaxed">
            שאלות? רוצים לדעת עוד? תמיד אפשר ליצור איתנו קשר ונסביר הכול.
          </p>
        </section>

        </div>
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