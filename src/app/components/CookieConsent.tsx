import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  performance: boolean;
  marketing: boolean;
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, can't be disabled
    performance: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      performance: true,
      marketing: true,
    };
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    setShowPreferences(false);
    setIsVisible(false);
  };

  const handleManagePreferences = () => {
    setShowPreferences(true);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Cookie Banner */}
      {!showPreferences && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl" dir="rtl">
          <div className="max-w-6xl mx-auto px-4 py-4 md:py-5">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              {/* Icon & Text */}
              <div className="flex-1 flex items-start gap-3">
                <Cookie className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-gray-800 leading-relaxed">
                    אנחנו משתמשים בעוגיות (Cookies) כדי שהאתר יעבוד חלק, לשפר את החוויה שלכם, ולפעמים גם כדי לגלות אם יש מבצע מעניין.
                    <br className="hidden md:inline" />
                    <span className="block md:inline md:mr-1">תבחרו מה מתאים לכם – או פשוט תאשרו הכול ותמשיכו בכיף.</span>
                  </p>
                  <a 
                    href="#privacy" 
                    onClick={(e) => {
                      e.preventDefault();
                      window.dispatchEvent(new CustomEvent('navigate-to-privacy'));
                    }}
                    className="text-sm text-purple-600 hover:text-purple-700 underline mt-2 inline-block"
                  >
                    מדיניות הפרטיות שלנו »
                  </a>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <button
                  onClick={handleAcceptAll}
                  className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-all duration-200 hover:scale-105 shadow-md font-medium whitespace-nowrap"
                >
                  אישור הכול
                </button>
                <button
                  onClick={handleManagePreferences}
                  className="text-purple-600 hover:text-purple-700 px-6 py-3 underline transition-colors font-medium whitespace-nowrap"
                >
                  לנהל העדפות
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showPreferences && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 z-50 transition-opacity duration-300"
            onClick={() => setShowPreferences(false)}
          ></div>

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
            <div 
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b-2 border-purple-100 px-6 py-4 rounded-t-3xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Cookie className="w-6 h-6 text-purple-600" />
                  <h2 className="font-bold text-gray-900">ניהול העדפות עוגיות</h2>
                </div>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="p-2 hover:bg-purple-50 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-6 space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  אפשר לכם לבחור איזה סוגי עוגיות תרצו לאשר. עוגיות חיוניות תמיד פעילות כי בלעדיהן האתר לא יעבוד.
                </p>

                {/* Essential Cookies */}
                <div className="bg-purple-50 rounded-2xl p-4 border-2 border-purple-200">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">✅ עוגיות חיוניות</h3>
                        <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full font-medium">
                          תמיד פעיל
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                        עוגיות שחיוניות לתפעול האתר. בלעדיהן לא נוכל להציע לכם את השירות.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Performance Cookies */}
                <div className="bg-white rounded-2xl p-4 border-2 border-purple-100">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">📈 עוגיות ביצועים</h3>
                      <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                        עוזרות לנו להבין איך משתמשים באתר ולשפר את החוויה.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.performance}
                        onChange={(e) => setPreferences({ ...preferences, performance: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="bg-white rounded-2xl p-4 border-2 border-purple-100">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">🎯 עוגיות שיווק</h3>
                      <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                        מאפשרות לנו להציע לכם מבצעים ותוכן רלוונטיים יותר.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t-2 border-purple-100 px-6 py-4 rounded-b-3xl">
                <button
                  onClick={handleSavePreferences}
                  className="w-full bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-all duration-200 hover:scale-105 shadow-md font-medium"
                >
                  שמור והמשך
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}