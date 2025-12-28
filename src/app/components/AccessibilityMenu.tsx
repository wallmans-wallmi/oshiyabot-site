import React, { useState, useEffect, useRef } from 'react';
import { X, Type, Eye, Keyboard, RotateCcw } from 'lucide-react';

interface AccessibilitySettings {
  textSize: 'small' | 'default' | 'large';
  lineSpacing: boolean;
  letterSpacing: boolean;
  readingFocus: boolean;
  highContrast: boolean;
  darkMode: boolean;
  highlightLinks: boolean;
  reduceMotion: boolean;
  keyboardFocus: boolean;
  biggerCursor: boolean;
  screenReaderHints: boolean;
}

interface AccessibilityMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToStatement: () => void;
  isDesktop?: boolean;
}

const defaultSettings: AccessibilitySettings = {
  textSize: 'default',
  lineSpacing: false,
  letterSpacing: false,
  readingFocus: false,
  highContrast: false,
  darkMode: false,
  highlightLinks: false,
  reduceMotion: false,
  keyboardFocus: false,
  biggerCursor: false,
  screenReaderHints: false,
};

export function AccessibilityMenu({ isOpen, onClose, onNavigateToStatement, isDesktop }: AccessibilityMenuProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [startY, setStartY] = useState<number>(0);
  const [currentY, setCurrentY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  // Load saved settings on mount
  useEffect(() => {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
        applySettings(parsed);
      } catch (e) {
        console.error('Failed to load accessibility settings');
      }
    }
  }, []);

  // Apply settings immediately to the document
  const applySettings = (s: AccessibilitySettings) => {
    const html = document.documentElement;
    
    // Text size
    html.classList.remove('a11y-text-small', 'a11y-text-large');
    if (s.textSize === 'small') html.classList.add('a11y-text-small');
    if (s.textSize === 'large') html.classList.add('a11y-text-large');
    
    // Line spacing
    html.classList.toggle('a11y-line-spacing', s.lineSpacing);
    
    // Letter spacing
    html.classList.toggle('a11y-letter-spacing', s.letterSpacing);
    
    // Reading focus
    html.classList.toggle('a11y-reading-focus', s.readingFocus);
    
    // High contrast
    html.classList.toggle('a11y-high-contrast', s.highContrast);
    
    // Dark mode
    html.classList.toggle('a11y-dark-mode', s.darkMode);
    
    // Highlight links
    html.classList.toggle('a11y-highlight-links', s.highlightLinks);
    
    // Reduce motion
    html.classList.toggle('a11y-reduce-motion', s.reduceMotion);
    
    // Keyboard focus
    html.classList.toggle('a11y-keyboard-focus', s.keyboardFocus);
    
    // Bigger cursor
    html.classList.toggle('a11y-bigger-cursor', s.biggerCursor);
  };

  // Update a setting and apply immediately
  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
  };

  // Reset all settings
  const handleReset = () => {
    setSettings(defaultSettings);
    applySettings(defaultSettings);
    localStorage.removeItem('accessibility-settings');
  };

  // Focus management
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Swipe down to close (mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - startY;
    if (deltaY > 0) {
      setCurrentY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (currentY > 100) {
      onClose();
    }
    setCurrentY(0);
    setIsDragging(false);
  };

  if (!isOpen) return null;

  const shouldReduceMotion = settings.reduceMotion;

  return (
    <>
      {/* Overlay - only on mobile */}
      {!isDesktop && (
        <div 
          className={`fixed inset-0 bg-black/30 z-50 ${
            shouldReduceMotion ? '' : 'transition-opacity duration-200'
          }`}
          aria-hidden="true"
        />
      )}
      
      {/* Menu */}
      {isDesktop ? (
        // Desktop: Full screen with centered content
        <div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="a11y-menu-title"
          className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-br from-purple-50 to-pink-50"
          dir="rtl"
        >
          {/* Close button - desktop */}
          <div className="sticky top-0 bg-gradient-to-br from-purple-50 to-pink-50 px-6 py-4 z-10">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">♿</span>
                </div>
                <div>
                  <h2 id="a11y-menu-title" className="font-bold text-gray-900">
                    נגישות
                  </h2>
                  <p className="text-sm text-gray-600">
                    התאימו את האתר לצרכים שלכם
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                  aria-label="Reset all accessibility settings"
                  title="איפוס"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  aria-label="סגור"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>

          {/* Content - Desktop Grid */}
          <div className="max-w-6xl mx-auto px-6 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Section A: Text and Reading */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Type className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">טקסט וקריאה</h3>
                </div>
                
                <div className="space-y-1">
                  {/* Text size */}
                  <div className="flex flex-col gap-3 py-3">
                    <label className="text-gray-700 font-medium">גודל טקסט</label>
                    <div className="flex items-center gap-1.5 bg-gray-100 rounded-xl p-1">
                      <button
                        onClick={() => updateSetting('textSize', 'small')}
                        className={`flex-1 py-2.5 rounded-lg text-sm transition-all min-h-[44px] ${
                          settings.textSize === 'small'
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-200'
                        }`}
                        aria-label="Small text size"
                        aria-pressed={settings.textSize === 'small'}
                      >
                        A-
                      </button>
                      <button
                        onClick={() => updateSetting('textSize', 'default')}
                        className={`flex-1 py-2.5 rounded-lg text-sm transition-all min-h-[44px] ${
                          settings.textSize === 'default'
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-200'
                        }`}
                        aria-label="Default text size"
                        aria-pressed={settings.textSize === 'default'}
                      >
                        A
                      </button>
                      <button
                        onClick={() => updateSetting('textSize', 'large')}
                        className={`flex-1 py-2.5 rounded-lg text-sm transition-all min-h-[44px] ${
                          settings.textSize === 'large'
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-200'
                        }`}
                        aria-label="Large text size"
                        aria-pressed={settings.textSize === 'large'}
                      >
                        A+
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 my-2" />

                  {/* Line spacing */}
                  <ToggleRow
                    label="ריווח שורות מוגבר"
                    description="הוסיפו רווח בין שורות לקריאה נוחה"
                    checked={settings.lineSpacing}
                    onChange={(checked) => updateSetting('lineSpacing', checked)}
                  />

                  {/* Letter spacing */}
                  <ToggleRow
                    label="ריווח אותיות"
                    description="הוסיפו רווח בין אותיות"
                    checked={settings.letterSpacing}
                    onChange={(checked) => updateSetting('letterSpacing', checked)}
                  />

                  {/* Reading focus */}
                  <ToggleRow
                    label="מסגרת מיקוד לקריאה"
                    description="הדגישו את האלמנט הפעיל"
                    checked={settings.readingFocus}
                    onChange={(checked) => updateSetting('readingFocus', checked)}
                  />
                </div>
              </div>

              {/* Section B: Contrast and Visuals */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Eye className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">ניגודיות וויזואלית</h3>
                </div>
                
                <div className="space-y-1">
                  <ToggleRow
                    label="ניגודיות גבוהה"
                    description="הגבירו את הניגודיות בין צבעים"
                    checked={settings.highContrast}
                    onChange={(checked) => updateSetting('highContrast', checked)}
                  />

                  <ToggleRow
                    label="מצב כהה"
                    description="החליפו לצבעים כהים"
                    checked={settings.darkMode}
                    onChange={(checked) => updateSetting('darkMode', checked)}
                  />

                  <ToggleRow
                    label="הדגשת קישורים"
                    description="הדגישו קישורים בקו תחתון"
                    checked={settings.highlightLinks}
                    onChange={(checked) => updateSetting('highlightLinks', checked)}
                  />

                  <ToggleRow
                    label="הפחתת אנימציות"
                    description="הפחיתו תנועה ואנימציות"
                    checked={settings.reduceMotion}
                    onChange={(checked) => updateSetting('reduceMotion', checked)}
                  />
                </div>
              </div>

              {/* Section C: Navigation and Assistance */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Keyboard className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">ניווט וסיוע</h3>
                </div>
                
                <div className="space-y-1">
                  <ToggleRow
                    label="הדגשת פוקוס במקלדת"
                    description="הדגישו אלמנטים פעילים"
                    checked={settings.keyboardFocus}
                    onChange={(checked) => updateSetting('keyboardFocus', checked)}
                  />

                  <ToggleRow
                    label="סמן עכבר מוגדל"
                    description="הגדילו את סמן העכבר"
                    checked={settings.biggerCursor}
                    onChange={(checked) => updateSetting('biggerCursor', checked)}
                  />

                  <ToggleRow
                    label="רמזים לקורא מסך"
                    description="הוסיפו תיאורים נוספים"
                    checked={settings.screenReaderHints}
                    onChange={(checked) => updateSetting('screenReaderHints', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Accessibility Statement Link */}
            <div className="mt-6 max-w-md mx-auto">
              <button
                onClick={onNavigateToStatement}
                className="w-full bg-white text-purple-700 py-4 rounded-xl hover:bg-purple-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 font-medium shadow-sm"
              >
                הצהרת נגישות
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Mobile: Bottom sheet
        <div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="a11y-menu-title"
          className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 flex flex-col max-h-[80vh] ${
            shouldReduceMotion ? '' : 'transition-transform duration-150 ease-out'
          }`}
          style={{
            transform: isDragging ? `translateY(${currentY}px)` : 'translateY(0)',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full" aria-hidden="true" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4 pt-2">
            <div className="flex-1">
              <h2 id="a11y-menu-title" className="font-semibold text-gray-900">
                נגישות
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                התאימו את האתר לצרכים שלכם
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="p-2 text-purple-600 active:bg-purple-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Reset all accessibility settings"
                title="איפוס"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-2 text-gray-600 active:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close accessibility menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="space-y-6">
              {/* Section A: Text and Reading */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Type className="w-5 h-5 text-purple-600" />
                  <h3 className="font-medium text-gray-900">טקסט וקריאה</h3>
                </div>
                
                <div className="space-y-1">
                  {/* Text size */}
                  <div className="flex items-center justify-between min-h-[60px] py-2">
                    <label className="text-gray-700">גודל טקסט</label>
                    <div className="flex items-center gap-1.5 bg-gray-100 rounded-xl p-1">
                      <button
                        onClick={() => updateSetting('textSize', 'small')}
                        className={`px-4 py-2.5 rounded-lg text-sm transition-all min-w-[56px] min-h-[44px] ${
                          settings.textSize === 'small'
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'text-gray-600 active:bg-gray-200'
                        }`}
                        aria-label="Small text size"
                        aria-pressed={settings.textSize === 'small'}
                      >
                        A-
                      </button>
                      <button
                        onClick={() => updateSetting('textSize', 'default')}
                        className={`px-4 py-2.5 rounded-lg text-sm transition-all min-w-[56px] min-h-[44px] ${
                          settings.textSize === 'default'
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'text-gray-600 active:bg-gray-200'
                        }`}
                        aria-label="Default text size"
                        aria-pressed={settings.textSize === 'default'}
                      >
                        A
                      </button>
                      <button
                        onClick={() => updateSetting('textSize', 'large')}
                        className={`px-4 py-2.5 rounded-lg text-sm transition-all min-w-[56px] min-h-[44px] ${
                          settings.textSize === 'large'
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'text-gray-600 active:bg-gray-200'
                        }`}
                        aria-label="Large text size"
                        aria-pressed={settings.textSize === 'large'}
                      >
                        A+
                      </button>
                    </div>
                  </div>

                  {/* Line spacing */}
                  <ToggleRow
                    label="ריווח שורות מוגבר"
                    description="הוסיפו רווח בין שורות לקריאה נוחה"
                    checked={settings.lineSpacing}
                    onChange={(checked) => updateSetting('lineSpacing', checked)}
                  />

                  {/* Letter spacing */}
                  <ToggleRow
                    label="ריווח אותיות"
                    description="הוסיפו רווח בין אותיות"
                    checked={settings.letterSpacing}
                    onChange={(checked) => updateSetting('letterSpacing', checked)}
                  />

                  {/* Reading focus */}
                  <ToggleRow
                    label="מסגרת מיקוד לקריאה"
                    description="הדגישו את האלמנט הפעיל"
                    checked={settings.readingFocus}
                    onChange={(checked) => updateSetting('readingFocus', checked)}
                  />
                </div>
              </section>

              <div className="border-t border-gray-100" />

              {/* Section B: Contrast and Visuals */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-5 h-5 text-purple-600" />
                  <h3 className="font-medium text-gray-900">ניגודיות וויזואלית</h3>
                </div>
                
                <div className="space-y-1">
                  <ToggleRow
                    label="ניגודיות גבוהה"
                    description="הגבירו את הניגודיות בין צבעים"
                    checked={settings.highContrast}
                    onChange={(checked) => updateSetting('highContrast', checked)}
                  />

                  <ToggleRow
                    label="מצב כהה"
                    description="החליפו לצבעים כהים"
                    checked={settings.darkMode}
                    onChange={(checked) => updateSetting('darkMode', checked)}
                  />

                  <ToggleRow
                    label="הדגשת קישורים"
                    description="הדגישו קישורים בקו תחתון"
                    checked={settings.highlightLinks}
                    onChange={(checked) => updateSetting('highlightLinks', checked)}
                  />

                  <ToggleRow
                    label="הפחתת אנימציות"
                    description="הפחיתו תנועה ואנימציות"
                    checked={settings.reduceMotion}
                    onChange={(checked) => updateSetting('reduceMotion', checked)}
                  />
                </div>
              </section>

              <div className="border-t border-gray-100" />

              {/* Section C: Navigation and Assistance */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Keyboard className="w-5 h-5 text-purple-600" />
                  <h3 className="font-medium text-gray-900">ניווט וסיוע</h3>
                </div>
                
                <div className="space-y-1">
                  <ToggleRow
                    label="הדגשת פוקוס במקלדת"
                    description="הדגישו אלמנטים פעילים"
                    checked={settings.keyboardFocus}
                    onChange={(checked) => updateSetting('keyboardFocus', checked)}
                  />

                  <ToggleRow
                    label="סמן עכבר מוגדל"
                    description="הגדילו את סמן העכבר (דسكטופ בלבד)"
                    checked={settings.biggerCursor}
                    onChange={(checked) => updateSetting('biggerCursor', checked)}
                  />

                  <ToggleRow
                    label="רמזים לקורא מסך"
                    description="הוסיפו תיאורים נוספים"
                    checked={settings.screenReaderHints}
                    onChange={(checked) => updateSetting('screenReaderHints', checked)}
                  />
                </div>
              </section>

              {/* Accessibility Statement Link */}
              <div className="pt-4">
                <button
                  onClick={onNavigateToStatement}
                  className="w-full bg-purple-50 text-purple-700 py-4 rounded-xl active:bg-purple-100 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 font-medium min-h-[52px]"
                >
                  הצהרת נגישות
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface ToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between w-full min-h-[60px] py-3 active:bg-gray-50 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
      role="switch"
      aria-checked={checked}
    >
      <div className="flex-1 text-right pr-1">
        <div className="text-gray-900 font-medium">{label}</div>
        {description && (
          <div className="text-sm text-gray-500 mt-0.5">{description}</div>
        )}
      </div>
      <div
        className={`relative flex-shrink-0 w-14 h-8 rounded-full transition-colors ml-3 ${
          checked ? 'bg-purple-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${
            checked ? 'right-1' : 'right-7'
          }`}
        />
      </div>
    </button>
  );
}