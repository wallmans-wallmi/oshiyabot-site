import React from 'react';
import { ChevronDown } from 'lucide-react';

interface ChatScrollToLatestButtonProps {
  onClick: () => void;
  isVisible: boolean;
}

export function ChatScrollToLatestButton({ onClick, isVisible }: ChatScrollToLatestButtonProps) {
  if (!isVisible) return null;

  return (
    <button
      onClick={onClick}
      aria-label="חזרה להודעה האחרונה"
      className="fixed bottom-24 left-4 md:left-8 w-12 h-12 rounded-full shadow-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 z-40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 border-2"
      style={{
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
        color: '#2d2d2d',
        animation: 'fadeSlideIn 0.2s ease-out'
      }}
    >
      <ChevronDown className="w-5 h-5" strokeWidth={2.5} />
    </button>
  );
}