import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface SubscriptionManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: 'monthly' | 'yearly';
  onSwitchPlan?: (newPlan: 'monthly' | 'yearly') => void;
  onCancelSubscription?: () => void;
}

export function SubscriptionManagementModal({
  isOpen,
  onClose,
  currentPlan,
  onSwitchPlan,
  onCancelSubscription
}: SubscriptionManagementModalProps) {
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

  if (!isOpen) return null;

  const handleSwitchPlan = (newPlan: 'monthly' | 'yearly') => {
    if (onSwitchPlan) {
      onSwitchPlan(newPlan);
      onClose();
    }
  };

  const handleCancelSubscription = () => {
    if (onCancelSubscription) {
      onCancelSubscription();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="font-bold text-gray-900 text-xl">ניהול מנוי</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="סגור"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!showCancelConfirmation ? (
            <>
              {/* Switch Plan Section */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">החלפת תוכנית</h3>
                <div className="space-y-3">
                  {currentPlan === 'monthly' ? (
                    <button
                      onClick={() => handleSwitchPlan('yearly')}
                      className="w-full bg-white border-2 border-gray-300 rounded-xl p-4 text-right hover:border-purple-500 hover:bg-purple-50 transition-all"
                    >
                      <p className="font-semibold text-gray-900 mb-1">מעבר למנוי שנתי</p>
                      <p className="text-sm text-gray-600">חסכו עד 20% בתשלום שנתי</p>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSwitchPlan('monthly')}
                      className="w-full bg-white border-2 border-gray-300 rounded-xl p-4 text-right hover:border-purple-500 hover:bg-purple-50 transition-all"
                    >
                      <p className="font-semibold text-gray-900 mb-1">מעבר למנוי חודשי</p>
                      <p className="text-sm text-gray-600">גמישות מקסימלית בתשלום חודשי</p>
                    </button>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* Cancel Section */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">ביטול מנוי</h3>
                <button
                  onClick={() => setShowCancelConfirmation(true)}
                  className="w-full bg-white border-2 border-red-300 text-red-600 rounded-xl p-4 hover:bg-red-50 transition-all"
                >
                  ביטול מנוי
                </button>
              </div>
            </>
          ) : (
            // Cancel Confirmation
            <div className="space-y-4">
              {/* Warning Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </div>

              {/* Title */}
              <h3 className="font-bold text-gray-900 text-center text-xl">בטוחים?</h3>

              {/* Explanation */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-gray-800 leading-relaxed">
                  ביטול המנוי יפסיק מעקבים שנוספו במסגרת הפרימיום.
                  <br />
                  <br />
                  <strong>שלושת המעקבים הראשונים יישארו פעילים.</strong>
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleCancelSubscription}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  כן, בטלו את המנוי
                </button>
                <button
                  onClick={() => setShowCancelConfirmation(false)}
                  className="w-full border-2 border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  לא, אני נשארת
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
