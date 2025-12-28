import React from 'react';

interface LogoutConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function LogoutConfirmDialog({ isOpen, onConfirm, onCancel }: LogoutConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-[60] animate-in fade-in duration-200"
        onClick={onCancel}
        aria-hidden="true"
      />
      
      {/* Dialog */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-dialog-title"
          aria-describedby="logout-dialog-description"
        >
          {/* Title */}
          <h2 
            id="logout-dialog-title"
            className="text-xl font-semibold text-gray-900 mb-3 text-center"
          >
            רוצה להתנתק?
          </h2>
          
          {/* Body */}
          <p 
            id="logout-dialog-description"
            className="text-gray-600 mb-6 text-center leading-relaxed"
          >
            אם תתנתקי, תוכלי תמיד להתחבר שוב עם מספר הטלפון שלך.
          </p>
          
          {/* Actions */}
          <div className="space-y-3">
            {/* Primary action - Logout */}
            <button
              onClick={onConfirm}
              className="w-full bg-gray-100 text-gray-900 px-4 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              style={{ minHeight: '44px' }}
              aria-label="כן, להתנתק מהחשבון"
            >
              כן, להתנתק
            </button>
            
            {/* Secondary action - Cancel */}
            <button
              onClick={onCancel}
              className="w-full bg-purple-600 text-white px-4 py-3 rounded-xl hover:bg-purple-700 transition-all duration-200 font-medium"
              style={{ minHeight: '44px' }}
              aria-label="לא, לחזור להגדרות"
              autoFocus
            >
              לא, חזרה
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
