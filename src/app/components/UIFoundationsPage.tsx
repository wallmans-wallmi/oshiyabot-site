import React, { useState } from 'react';
import { X, Sparkles, Check } from 'lucide-react';

interface UIFoundationsPageProps {
  onClose: () => void;
}

export function UIFoundationsPage({ onClose }: UIFoundationsPageProps) {
  // State for interactive examples
  const [toggleExample, setToggleExample] = useState(true);
  const [radioExample, setRadioExample] = useState('option1');

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3 shadow-sm z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="font-bold text-gray-900">UI Foundations</h2>
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
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        
        {/* Intro */}
        <section>
          <p className="text-gray-600 text-center mb-2">
            דף זה מתעד את דפוסי העיצוב הקיימים במוצר Oshiya
          </p>
          <p className="text-sm text-gray-400 text-center">
            זהו דף תיעוד בלבד - ללא שינויים במסכים קיימים
          </p>
        </section>

        {/* ===== FOUNDATIONS ===== */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Foundations</h3>

          {/* Colors */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-4">צבעים</h4>
            
            {/* Semantic Tokens Section */}
            <div className="mb-6 p-4 bg-purple-50 border border-purple-100 rounded-xl">
              <p className="text-sm font-semibold text-purple-900 mb-3">📐 Semantic Color Tokens</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#9333ea] shadow-sm"></div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">1️⃣ Action Primary (Purple)</p>
                    <p className="text-xs text-gray-600">#9333ea • צבע ראשי - רק ל-CTAs ראשיים</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#2d2d2d] shadow-sm"></div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">2️⃣ Neutral Primary (Charcoal)</p>
                    <p className="text-xs text-gray-600">#2d2d2d • צבע משני - כפתורים, אייקונים, נגישות</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 shadow-sm border border-gray-200"></div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">3️⃣ Neutral Tertiary (Light Gray)</p>
                    <p className="text-xs text-gray-600">#f3f4f6 (gray-100) • צבע שלישי - רקעים של tabs</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#6b7280] shadow-sm"></div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Neutral Secondary</p>
                    <p className="text-xs text-gray-600">#6b7280 • טקסט משני</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Original Colors */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-purple-600 shadow-sm"></div>
                <div>
                  <p className="font-medium text-gray-900">Purple Primary (Action Primary)</p>
                  <p className="text-sm text-gray-500">purple-600 • רק לכפתורי CTA ראשיים וקו תחתון פעיל</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 shadow-sm"></div>
                <div>
                  <p className="font-medium text-gray-900">Gradient Primary</p>
                  <p className="text-sm text-gray-500">purple-600 → pink-600 • הודעות העוזרת בצ'אט</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-[#2d2d2d] shadow-sm"></div>
                <div>
                  <p className="font-medium text-gray-900">Charcoal (Neutral Primary)</p>
                  <p className="text-sm text-gray-500">#2d2d2d • ניווט, tabs, אייקוני נגישות</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-gray-900 shadow-sm"></div>
                <div>
                  <p className="font-medium text-gray-900">Gray 900</p>
                  <p className="text-sm text-gray-500">gray-900 • טקסטים ראשיים בתוכן</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-gray-700 shadow-sm"></div>
                <div>
                  <p className="font-medium text-gray-900">Gray 700</p>
                  <p className="text-sm text-gray-500">gray-700 • טקסטים משניים</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-gray-400 shadow-sm"></div>
                <div>
                  <p className="font-medium text-gray-900">Gray 400</p>
                  <p className="text-sm text-gray-500">gray-400 • טקסט עזרה, הסברים</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-gray-300 shadow-sm"></div>
                <div>
                  <p className="font-medium text-gray-900">Gray 300</p>
                  <p className="text-sm text-gray-500">gray-300 • גבולות, מצב כבוי בבקרות</p>
                </div>
              </div>
            </div>
          </div>

          {/* Border Radius */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-4">פינות מעוגלות (Border Radius)</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-purple-100 rounded-lg"></div>
                <div>
                  <p className="font-medium text-gray-900">rounded-lg</p>
                  <p className="text-sm text-gray-500">אייקונים קטנים, כפתורי סגירה</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-purple-100 rounded-xl"></div>
                <div>
                  <p className="font-medium text-gray-900">rounded-xl</p>
                  <p className="text-sm text-gray-500">כפתורים, אינפוטים, קונטיינרים - הנפוץ ביותר</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl"></div>
                <div>
                  <p className="font-medium text-gray-900">rounded-2xl</p>
                  <p className="text-sm text-gray-500">בועות צ'אט</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-purple-100 rounded-3xl"></div>
                <div>
                  <p className="font-medium text-gray-900">rounded-3xl</p>
                  <p className="text-sm text-gray-500">אייקון אפליקציה, אלמנטים דקורטיביים</p>
                </div>
              </div>
            </div>
          </div>

          {/* Spacing */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-4">רווחים נפוצים</h4>
            <div className="space-y-3 text-sm text-gray-700">
              <p>• <span className="font-mono bg-gray-100 px-2 py-1 rounded">p-3 / py-3</span> - ריפוד פנימי בכפתורי רדיו, אלמנטים</p>
              <p>• <span className="font-mono bg-gray-100 px-2 py-1 rounded">p-4 / px-4 py-3</span> - ריפוד פנימי בכפתורים ואינפוטים</p>
              <p>• <span className="font-mono bg-gray-100 px-2 py-1 rounded">p-5</span> - ריפוד פנימי בקונטיינרים</p>
              <p>• <span className="font-mono bg-gray-100 px-2 py-1 rounded">gap-2 / gap-3</span> - מרווח בין אייקון לטקסט</p>
              <p>• <span className="font-mono bg-gray-100 px-2 py-1 rounded">space-y-5</span> - מרווח אנכי בין אלמנטים בסקציה</p>
              <p>• <span className="font-mono bg-gray-100 px-2 py-1 rounded">mb-8 / mb-10</span> - מרווח תחתון בין סקציות</p>
            </div>
          </div>
        </section>

        {/* ===== CONTROLS ===== */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Controls</h3>

          {/* Primary Button */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-4">Primary Button</h4>
            <button
              className="bg-purple-600 text-white px-4 py-3 rounded-xl hover:bg-purple-700 transition-all duration-200 hover:scale-[1.01] shadow-sm"
              style={{ minHeight: '44px' }}
            >
              שליחת קוד אימות
            </button>
            <p className="text-sm text-gray-500 mt-3">
              נמצא ב: LoginPage, OTPVerification
            </p>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm font-mono text-gray-700">
              bg-purple-600 text-white px-4 py-3 rounded-xl<br />
              hover:bg-purple-700 transition-all duration-200<br />
              hover:scale-[1.01] shadow-sm<br />
              minHeight: '44px'
            </div>
          </div>

          {/* Secondary/Ghost Button */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-4">Secondary Button (Ghost)</h4>
            <button
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
            <p className="text-sm text-gray-500 mt-3">
              נמצא ב: כפתורי סגירה בכל העמודים
            </p>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm font-mono text-gray-700">
              p-2 hover:bg-gray-50 rounded-lg transition-colors
            </div>
          </div>

          {/* Toggle */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-4">Toggle Switch</h4>
            <div className="flex items-center gap-3">
              <button
                role="switch"
                aria-checked={toggleExample}
                onClick={() => setToggleExample(!toggleExample)}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:ring-offset-2 ${
                  toggleExample ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <span className="sr-only">Toggle example</span>
                <span
                  aria-hidden="true"
                  className={`inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out self-center ${
                    toggleExample ? 'translate-x-[-26px]' : 'translate-x-[3px]'
                  }`}
                />
              </button>
              <span className="text-gray-700">דוגמה אינטראקטיבית</span>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              נמצא ב: SettingsPage (קבלת התראות בוואטסאפ)
            </p>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm font-mono text-gray-700">
              h-7 w-12 rounded-full<br />
              bg-purple-600 (on) / bg-gray-300 (off)<br />
              Inner circle: h-5 w-5 bg-white shadow-lg<br />
              translate-x-[-26px] (on) / translate-x-[3px] (off)
            </div>
          </div>

          {/* Radio Button */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-4">Radio Button</h4>
            <div className="space-y-0">
              <label className="flex items-center cursor-pointer group py-3">
                <div className="relative flex items-center ml-3">
                  <input
                    type="radio"
                    name="radio-example"
                    value="option1"
                    checked={radioExample === 'option1'}
                    onChange={(e) => setRadioExample(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    radioExample === 'option1' ? 'border-gray-900' : 'border-gray-300'
                  }`}>
                    {radioExample === 'option1' && (
                      <div className="w-3 h-3 rounded-full bg-gray-900" />
                    )}
                  </div>
                </div>
                <span className={`${radioExample === 'option1' ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                  אופציה ראשונה
                </span>
              </label>

              <label className="flex items-center cursor-pointer group py-3">
                <div className="relative flex items-center ml-3">
                  <input
                    type="radio"
                    name="radio-example"
                    value="option2"
                    checked={radioExample === 'option2'}
                    onChange={(e) => setRadioExample(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    radioExample === 'option2' ? 'border-gray-900' : 'border-gray-300'
                  }`}>
                    {radioExample === 'option2' && (
                      <div className="w-3 h-3 rounded-full bg-gray-900" />
                    )}
                  </div>
                </div>
                <span className={`${radioExample === 'option2' ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                  אופציה שנייה
                </span>
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              נמצא ב: SettingsPage (העדפות מעקב)
            </p>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm font-mono text-gray-700">
              Container: py-3 ml-3<br />
              Circle: w-6 h-6 rounded-full border-2<br />
              border-gray-900 (checked) / border-gray-300 (unchecked)<br />
              Inner: w-3 h-3 rounded-full bg-gray-900
            </div>
          </div>

          {/* Text Input */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-4">Text Input</h4>
            <input
              type="text"
              placeholder="דוגמה לשדה קלט"
              className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all"
            />
            <p className="text-sm text-gray-500 mt-3">
              נמצא ב: SettingsPage (שם פרטי)
            </p>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm font-mono text-gray-700">
              px-4 py-3 bg-white rounded-lg<br />
              border border-gray-300<br />
              focus:ring-2 focus:ring-purple-200<br />
              focus:border-purple-400 transition-all
            </div>
          </div>

          {/* Text Input with border */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-4">Text Input (with border-2)</h4>
            <input
              type="text"
              placeholder="מספר טלפון"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white transition-all duration-200"
              style={{ minHeight: '44px' }}
            />
            <p className="text-sm text-gray-500 mt-3">
              נמצא ב: LoginPage (מספר טלפון)
            </p>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm font-mono text-gray-700">
              px-4 py-3 rounded-xl border-2 border-gray-300<br />
              focus:border-purple-400 focus:ring-2<br />
              focus:ring-purple-200 bg-white<br />
              minHeight: '44px'
            </div>
          </div>
        </section>

        {/* ===== CHAT ===== */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Chat</h3>

          {/* Assistant Message */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-4">Assistant Message Bubble</h4>
            <div className="flex justify-end">
              <div className="max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                היי! אני אושייה, העוזרת הקנייה האישית שלך 💜<br />
                אשמח לעזור לך לעקוב אחרי מוצרים ולקבל התראות כשהמחיר יורד!
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              נמצא ב: ChatInterface (הודעות העוזרת)
            </p>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm font-mono text-gray-700">
              max-w-[85%] md:max-w-[70%] rounded-2xl<br />
              px-4 py-3<br />
              bg-gradient-to-r from-purple-600 to-pink-600<br />
              text-white
            </div>
          </div>

          {/* User Message */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-4">User Message Bubble</h4>
            <div className="flex justify-start">
              <div className="max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 bg-white border-2 border-purple-200 text-gray-900">
                אני רוצה לעקוב אחרי מוצר חדש
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              נמצא ב: ChatInterface (הודעות המשתמש)
            </p>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm font-mono text-gray-700">
              max-w-[85%] md:max-w-[70%] rounded-2xl<br />
              px-4 py-3<br />
              bg-white border-2 border-purple-200<br />
              text-gray-900
            </div>
          </div>

          {/* Quick Reply Buttons */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-4">Quick Reply Buttons</h4>
            <div className="max-w-[85%] md:max-w-[70%] space-y-2">
              <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-purple-900 px-4 py-2 rounded-xl transition-all duration-200 font-medium border border-purple-300"
                style={{ minHeight: '44px' }}>
                עקוב אחרי מוצר חדש
              </button>
              <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-purple-900 px-4 py-2 rounded-xl transition-all duration-200 font-medium border border-purple-300"
                style={{ minHeight: '44px' }}>
                המוצרים שלי
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              נמצא ב: ChatInterface (כפתורים בתוך בועת הודעה)
            </p>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm font-mono text-gray-700">
              w-full bg-white/10 hover:bg-white/20<br />
              backdrop-blur-sm text-white<br />
              px-4 py-2 rounded-xl<br />
              border border-white/20<br />
              minHeight: '44px'<br />
              <br />
              הערה: בשימוש בפועל הם מופיעים על רקע סגול<br />
              ולכן text-white. כאן בדוגמה text-purple-900
            </div>
          </div>
        </section>

        {/* ===== NAVIGATION ===== */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Navigation</h3>

          {/* Tabs */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-4">Tabs</h4>
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
              <button className="flex-1 py-2 px-4 rounded-lg bg-white text-gray-900 shadow-sm font-medium transition-all">
                צ'אט
              </button>
              <button className="flex-1 py-2 px-4 rounded-lg text-gray-600 hover:text-gray-900 transition-colors">
                עסקאות
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              נמצא ב: DesktopLayout (מעבר בין צ'אט לעסקאות)
            </p>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm font-mono text-gray-700">
              Container: flex gap-1 bg-gray-100 p-1 rounded-xl<br />
              Active: bg-white text-gray-900 shadow-sm font-medium<br />
              Inactive: text-gray-600 hover:text-gray-900
            </div>
          </div>
        </section>

        {/* ===== CONTAINERS ===== */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Containers</h3>

          {/* Card */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-4">Card Container</h4>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <p className="text-gray-900 font-medium mb-2">כותרת</p>
              <p className="text-sm text-gray-600">תוכן של הקארד. משמש להגדרות ולתיבות מידע.</p>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              נמצא ב: SettingsPage, AccountPage
            </p>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm font-mono text-gray-700">
              bg-white border border-gray-200<br />
              rounded-xl p-5 shadow-sm
            </div>
          </div>
        </section>

        {/* ===== ICONS & EMOJIS ===== */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Icons & Emojis</h3>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Icons (lucide-react)</h4>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <X className="w-5 h-5 text-gray-700" />
                  <span className="text-sm text-gray-600">w-5 h-5</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-600">w-5 h-5 text-purple-600</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  <span className="text-sm text-gray-600">w-6 h-6</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                סגנון: outline (ברירת מחדל של lucide-react)<br />
                גדלים נפוצים: w-5 h-5 (כפתורים), w-6 h-6 (דקורטיבי)
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Emojis</h4>
              <div className="flex items-center gap-4">
                <span className="text-3xl">💜</span>
                <span className="text-3xl">👋</span>
                <span className="text-3xl">✨</span>
                <span className="text-3xl">🎉</span>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                משמשים בעיקר בתוך בועות צ'אט ובמסכי onboarding<br />
                מוסיפים חום ואישיות לטון הידידותי של אושייה
              </p>
            </div>
          </div>
        </section>

        {/* Color Usage Guidelines */}
        <section className="border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">הנחיות שימוש בצבעים</h3>
          
          <div className="space-y-4">
            <div className="bg-white border-2 border-purple-200 rounded-xl p-5">
              <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
                1️⃣ Action Primary (Purple) - #9333ea
              </h4>
              <p className="text-sm text-gray-700 mb-2 font-medium">שימוש:</p>
              <ul className="text-sm text-gray-600 space-y-1 mr-4">
                <li>✓ כפתורי CTA ראשיים (שליחה, התחברות)</li>
                <li>✓ אינדיקטורים פעילים</li>
              </ul>
              <p className="text-sm text-gray-700 mt-3 mb-2 font-medium">אסור:</p>
              <ul className="text-sm text-gray-600 space-y-1 mr-4">
                <li>✗ טקסט בניווט</li>
                <li>✗ רקע של Tabs</li>
                <li>✗ אייקונים כלליים</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-gray-300 rounded-xl p-5">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-[#2d2d2d] rounded-full"></span>
                2️⃣ Neutral Primary (Charcoal) - #2d2d2d
              </h4>
              <p className="text-sm text-gray-700 mb-2 font-medium">שימוש:</p>
              <ul className="text-sm text-gray-600 space-y-1 mr-4">
                <li>✓ טקסט בניווט (Tabs)</li>
                <li>✓ אייקון העלאת תמונה</li>
                <li>✓ כפתור נגישות</li>
                <li>✓ כפתור "לבדוק שוב" במעקבים שפג תוקפם</li>
                <li>✓ אייקוני כלי עזר</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-gray-100 rounded-xl p-5">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-gray-100 rounded-full border border-gray-300"></span>
                3️⃣ Neutral Tertiary (Light Gray) - #f3f4f6
              </h4>
              <p className="text-sm text-gray-700 mb-2 font-medium">שימוש:</p>
              <ul className="text-sm text-gray-600 space-y-1 mr-4">
                <li>✓ רקע של Tab פעיל (bg-gray-100)</li>
                <li>✓ רקעים עדינים להדגשה</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-semibold text-gray-900 mb-3">עקרון כללי</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                סגול הוא צבע ראשי לפעולות חשובות. Charcoal (#2d2d2d) הוא צבע משני לכפתורים ואייקונים. Light Gray (gray-100) הוא צבע שלישי לרקעים עדינים. כך נשמר איזון ויזואלי וברור היררכי.
              </p>
            </div>
          </div>
        </section>

        {/* Tabs Style Guide */}
        <section className="border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Tabs - מדריך עיצוב</h3>
          
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-semibold text-gray-900 mb-4">Tab לא פעיל</h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">• צבע טקסט: <code className="bg-gray-100 px-2 py-0.5 rounded">text-[#2d2d2d]</code> (Neutral Primary)</p>
                <p className="text-sm text-gray-600">• רקע: אין</p>
                <p className="text-sm text-gray-600">• Hover: <code className="bg-gray-100 px-2 py-0.5 rounded">hover:bg-gray-50</code></p>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <button className="px-4 py-2 rounded-xl text-[#2d2d2d] hover:bg-gray-50">
                  דוגמה
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-semibold text-gray-900 mb-4">Tab פעיל</h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">• צבע טקסט: <code className="bg-gray-100 px-2 py-0.5 rounded">text-[#2d2d2d]</code> (Neutral Primary)</p>
                <p className="text-sm text-gray-600">• פונט: <code className="bg-gray-100 px-2 py-0.5 rounded">font-medium</code></p>
                <p className="text-sm text-gray-600">• רקע: <code className="bg-gray-100 px-2 py-0.5 rounded">bg-gray-100</code> (Neutral Tertiary)</p>
                <p className="text-sm text-gray-600">• פוקוס: ללא ring (רק outline)</p>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <button className="px-4 py-2 rounded-xl text-[#2d2d2d] bg-gray-100 font-medium">
                  דוגמה פעילה
                </button>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <p className="text-sm text-purple-900 font-medium mb-1">✨ עיצוב פשוט ונקי</p>
              <p className="text-sm text-purple-800">
                Tab פעיל משתמש רק ברקע אפור עדין (gray-100) + font-medium. ללא פס צבעוני, ללא focus ring סגול - רק הדגשה עדינה ונקייה.
              </p>
            </div>
          </div>
        </section>

        {/* Final note */}
        <section className="border-t border-gray-200 pt-8">
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
            <h4 className="font-semibold text-purple-900 mb-2">הערה חשובה</h4>
            <p className="text-sm text-purple-800 leading-relaxed">
              דף זה הוא לתיעוד בלבד. לא בוצעו שינויים במסכים הקיימים.<br />
              כל הרכיבים כאן הם העתק מדויק של הדפוסים הקיימים במוצר.<br />
              ניתן להשתמש בדף זה כמדריך לעיצוב עקבי בעתיד.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
