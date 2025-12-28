import React, { useState } from 'react';
import { X, Crown, Check, Sparkles } from 'lucide-react';

interface PremiumSelectionPageProps {
  onBack: () => void;
  onContinueToPayment: (plan: 'monthly' | 'yearly') => void;
}

export function PremiumSelectionPage({ onBack, onContinueToPayment }: PremiumSelectionPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-br from-purple-50 to-pink-50 px-4 py-3 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-purple-600" />
            <h2 className="font-bold text-gray-900">פרימיום של אושייה</h2>
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

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 pb-32">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl mb-4">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">פרימיום של אושייה</h1>
          <p className="text-gray-600">מעקב בלי הגבלה + התראות חכמות</p>
        </div>

        {/* Features List */}
        <div className="bg-white rounded-2xl p-5 mb-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">מעקב בלי הגבלה</p>
                <p className="text-sm text-gray-600">עוקבים אחרי כמה מוצרים שרוצים</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">התראות חכמות</p>
                <p className="text-sm text-gray-600">מקבלים עדכון רק כשזה באמת משתלם</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">ניתוק בכל רגע</p>
                <p className="text-sm text-gray-600">בלי התחייבות, בלי דמי ביטול</p>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Selection */}
        <div className="space-y-3">
          {/* Monthly Plan */}
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`w-full bg-white rounded-2xl p-5 transition-all ${
              selectedPlan === 'monthly'
                ? 'ring-2 ring-purple-600 shadow-lg'
                : 'ring-1 ring-gray-200 hover:ring-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Radio Button */}
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === 'monthly' 
                    ? 'border-purple-600 bg-purple-600' 
                    : 'border-gray-300'
                }`}>
                  {selectedPlan === 'monthly' && (
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  )}
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-lg">חודשי</p>
                  <p className="text-sm text-gray-600">גמיש, אפשר לבטל מתי שרוצים</p>
                </div>
              </div>
              
              <div className="text-left">
                <p className="font-bold text-gray-900 text-xl">₪29</p>
                <p className="text-sm text-gray-600">לחודש</p>
              </div>
            </div>
          </button>

          {/* Yearly Plan */}
          <button
            onClick={() => setSelectedPlan('yearly')}
            className={`w-full bg-white rounded-2xl p-5 transition-all relative ${
              selectedPlan === 'yearly'
                ? 'ring-2 ring-purple-600 shadow-lg'
                : 'ring-1 ring-gray-200 hover:ring-gray-300'
            }`}
          >
            {/* Best Value Badge */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                הכי משתלם
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Radio Button */}
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === 'yearly' 
                    ? 'border-purple-600 bg-purple-600' 
                    : 'border-gray-300'
                }`}>
                  {selectedPlan === 'yearly' && (
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  )}
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-lg">שנתי</p>
                  <p className="text-sm text-gray-600">חיסכון לעומת חודשי</p>
                </div>
              </div>
              
              <div className="text-left">
                <p className="font-bold text-gray-900 text-xl">₪249</p>
                <p className="text-sm text-gray-600">לשנה</p>
              </div>
            </div>
          </button>
        </div>

        {/* Reassurance Text */}
        <p className="text-center text-sm text-gray-600 mt-6">
          ניתן לבטל את המנוי בכל רגע, בלי דמי ביטול
        </p>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => onContinueToPayment(selectedPlan)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            להמשיך לתשלום
            <Crown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
