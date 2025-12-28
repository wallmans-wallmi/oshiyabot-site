import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Package, TrendingDown, Clock, XCircle, X } from 'lucide-react';
import { AccessibilityButton } from './AccessibilityButton';
import { AccessibilityMenu } from './AccessibilityMenu';
import { Deal } from '../App';

interface TrackingsPageProps {
  onBack: () => void;
  deals: Deal[];
  onDealClick?: (dealId: number) => void;
  isDesktop?: boolean;
}

export function TrackingsPage({ 
  onBack, 
  deals = [],
  onDealClick,
  isDesktop = false
}: TrackingsPageProps) {
  const [isAccessibilityMenuOpen, setIsAccessibilityMenuOpen] = useState(false);
  const activeDeals = deals.filter(d => d.status === 'active');
  const pausedDeals = deals.filter(d => d.status === 'paused');
  const expiredDeals = deals.filter(d => d.status === 'expired');

  const renderDealCard = (deal: Deal) => (
    <div 
      key={deal.id}
      onClick={() => onDealClick?.(deal.id)}
      className="bg-white rounded-2xl p-5 hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="flex items-start gap-4">
        {deal.imageUrl ? (
          <Image
            src={deal.imageUrl}
            alt={deal.productName}
            width={64}
            height={64}
            className="w-16 h-16 rounded-lg object-cover"
            unoptimized
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            <Package className="w-8 h-8 text-purple-600" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1 truncate">
            {deal.productName}
          </h3>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-600">מחיר נוכחי:</span>
            <span className="text-lg font-bold text-gray-900">₪{deal.currentPrice}</span>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-600">יעד:</span>
            <span className="text-sm font-semibold text-purple-600">₪{deal.priceTarget}</span>
          </div>
          
          {/* Status badge */}
          {deal.status === 'active' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              <TrendingDown className="w-3 h-3" />
              פעיל
            </span>
          )}
          {deal.status === 'paused' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
              <Clock className="w-3 h-3" />
              מושהה
            </span>
          )}
          {deal.status === 'expired' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              <XCircle className="w-3 h-3" />
              הסתיים
            </span>
          )}
        </div>
      </div>
      
      {deal.status === 'expired' && deal.expirationReason && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600">{deal.expirationReason}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-br from-purple-50 to-pink-50 px-4 py-3 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-600" />
            <h2 className="font-bold text-gray-900">המעקבים שלי</h2>
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
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Content */}
        <div className="space-y-6">
          {/* Active Trackings */}
          {activeDeals.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">פעילים ({activeDeals.length})</h2>
              <div className="space-y-3">
                {activeDeals.map(renderDealCard)}
              </div>
            </section>
          )}

          {/* Paused Trackings */}
          {pausedDeals.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">מושהים ({pausedDeals.length})</h2>
              <div className="space-y-3">
                {pausedDeals.map(renderDealCard)}
              </div>
            </section>
          )}

          {/* Expired Trackings */}
          {expiredDeals.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">הסתיימו ({expiredDeals.length})</h2>
              <div className="space-y-3">
                {expiredDeals.map(renderDealCard)}
              </div>
            </section>
          )}

          {/* Empty state */}
          {deals.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <Package className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">עדיין אין מעקבים</h3>
              <p className="text-gray-600">
                בואי נתחיל לעקוב אחרי המוצר הראשון שלך! 🙂
              </p>
            </div>
          )}
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