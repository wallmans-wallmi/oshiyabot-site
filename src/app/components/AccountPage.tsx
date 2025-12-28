import React, { useState } from 'react';
import { X, User, Edit2, LogOut, Package, TrendingDown } from 'lucide-react';
import { LogoutConfirmDialog } from './LogoutConfirmDialog';
import { AccessibilityButton } from './AccessibilityButton';
import { AccessibilityMenu } from './AccessibilityMenu';

interface TrackingSummary {
  id: number;
  productName: string;
  status: 'active' | 'paused' | 'expired';
}

interface AccountPageProps {
  onClose?: () => void;
  firstName?: string;
  phoneNumber?: string;
  onLogout?: () => void;
  onEditPhone?: () => void;
  onUpdateName?: (newName: string) => void;
  isDesktop?: boolean;
  trackings?: TrackingSummary[];
  onNavigateToTrackings?: () => void;
}

export function AccountPage({ 
  onClose, 
  firstName, 
  phoneNumber,
  onLogout,
  onEditPhone,
  onUpdateName,
  isDesktop = false,
  trackings = [],
  onNavigateToTrackings
}: AccountPageProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(firstName || '');
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isAccessibilityMenuOpen, setIsAccessibilityMenuOpen] = useState(false);

  const handleSaveName = () => {
    if (editedName.trim() && onUpdateName) {
      onUpdateName(editedName.trim());
    }
    setIsEditingName(false);
  };

  const activeTrackings = trackings.filter(t => t.status === 'active');
  const recentTrackings = trackings.slice(0, 2);

  return (
    <div className={`${isDesktop ? 'h-full overflow-y-auto' : 'fixed inset-0 z-50 overflow-y-auto'} bg-white`} dir="rtl">
      {/* Header - only show close button on mobile */}
      {!isDesktop && onClose && (
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-10">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={onClose}
              className="p-2 active:bg-gray-100 rounded-full transition-colors"
              aria-label="סגור"
            >
              <X className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold">האזור שלי</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Avatar */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {firstName ? `היי, ${firstName}!` : 'היי!'}
          </h2>
          <p className="text-gray-600">זה האזור האישי שלך</p>
        </div>
        
        {/* Personal Info Cards */}
        <div className="space-y-4 mb-6">
          {/* Name Field */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">הכינוי שלי</h3>
              {!isEditingName && (
                <button
                  onClick={() => {
                    setIsEditingName(true);
                    setEditedName(firstName || '');
                  }}
                  className="flex items-center gap-2 text-gray-700 active:text-gray-800 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="text-sm">ערוך</span>
                </button>
              )}
            </div>
            {isEditingName ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="הכינוי שלך"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveName}
                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-xl active:bg-purple-700 transition-colors"
                    style={{ minHeight: '44px' }}
                  >
                    שמור
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl active:bg-gray-200 transition-colors"
                    style={{ minHeight: '44px' }}
                  >
                    ביטול
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 text-lg">{firstName || 'לא הוגדר'}</p>
            )}
          </div>

          {/* Phone Number Field */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">מספר הוואטסאפ שלי</h3>
              <button
                onClick={onEditPhone}
                className="flex items-center gap-2 text-gray-700 active:text-gray-800 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span className="text-sm">ערוך</span>
              </button>
            </div>
            <p className="text-gray-700 text-lg text-right" dir="ltr">{phoneNumber || '+972 50-XXX-XXXX'}</p>
            <p className="text-xs text-gray-500 mt-2">עריכת מספר דורשת אימות</p>
          </div>
        </div>

        {/* Trackings Summary Section */}
        <div className="mb-6">
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">המעקבים שלי</h3>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                <span className="text-2xl font-bold text-purple-600">{activeTrackings.length}</span>
              </div>
            </div>
            
            {recentTrackings.length > 0 ? (
              <>
                <div className="space-y-2 mb-4">
                  {recentTrackings.map((tracking) => (
                    <div 
                      key={tracking.id}
                      className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <TrendingDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <p className="text-sm text-gray-700 truncate">{tracking.productName}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        tracking.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : tracking.status === 'paused'
                          ? 'bg-gray-200 text-gray-600'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {tracking.status === 'active' ? 'פעיל' : tracking.status === 'paused' ? 'מושהה' : 'פג תוקף'}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={onNavigateToTrackings}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl transition-all text-sm font-medium"
                >
                  לכל המעקבים
                </button>
              </>
            ) : (
              <div className="py-6 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-1">עדיין אין מעקבים</p>
                <p className="text-xs text-gray-400">התחילי שיחה כדי להוסיף מעקב ראשון</p>
              </div>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutDialog(true)}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-2xl active:bg-gray-50 active:border-gray-400 transition-all"
          style={{ minHeight: '44px' }}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">התנתק מהחשבון</span>
        </button>
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