import React from 'react';
import { Package, Plus, Settings } from 'lucide-react';

interface AccountPreviewCardProps {
  onNavigate: () => void;
}

export function AccountPreviewCard({ onNavigate }: AccountPreviewCardProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 mt-3 border-2 border-purple-200/50">
      <h3 className="font-semibold text-lg mb-3 text-purple-900">האזור שלי</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-3 text-gray-700">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
            <Package className="w-4 h-4 text-gray-700" />
          </div>
          <span>המעקבים שלי</span>
        </div>
        
        <div className="flex items-center gap-3 text-gray-700">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
            <Plus className="w-4 h-4 text-gray-700" />
          </div>
          <span>הוספת מוצר חדש</span>
        </div>
        
        <div className="flex items-center gap-3 text-gray-700">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
            <Settings className="w-4 h-4 text-gray-700" />
          </div>
          <span>הגדרות חשבון</span>
        </div>
      </div>
      
      <button
        onClick={onNavigate}
        className="w-full bg-purple-600 text-white px-4 py-3 rounded-xl hover:bg-purple-700 transition-all duration-200 hover:scale-[1.01] shadow-sm"
        style={{ minHeight: '44px' }}
        aria-label="למעבר לאזור האישי"
      >
        למעבר לאזור האישי
      </button>
    </div>
  );
}