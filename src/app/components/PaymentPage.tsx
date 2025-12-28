import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';

interface PaymentPageProps {
  plan: 'monthly' | 'yearly';
  onBack: () => void;
  onSuccess: () => void;
}

export function PaymentPage({ plan, onBack, onSuccess }: PaymentPageProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentSuccess = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  const planDetails = plan === 'monthly' 
    ? { name: 'חודשי', price: '₪29', period: 'לחודש' }
    : { name: 'שנתי', price: '₪249', period: 'לשנה' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-br from-purple-50 to-pink-50 px-4 py-3 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-purple-600" />
            <h2 className="font-bold text-gray-900">תשלום מאובטח</h2>
          </div>
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            disabled={isProcessing}
            aria-label="סגור"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 pb-32">
        {/* Subtitle */}
        <p className="text-center text-gray-600 mb-6">כאן תתבצע הסליקה</p>

        {/* Plan Summary - Compact */}
        <div className="bg-white rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">מנוי {planDetails.name}</p>
              <p className="font-bold text-gray-900">{planDetails.price} {planDetails.period}</p>
            </div>
          </div>
        </div>

        {/* Payment iframe placeholder */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-12 text-center">
            <div className="text-gray-400 mb-3">
              <Lock className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-600 font-semibold">Payment iframe placeholder</p>
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handlePaymentSuccess}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>מעבד תשלום...</span>
              </>
            ) : (
              <span>אישור תשלום (דוגמה)</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}