import React, { useState, useEffect, useRef } from 'react';
import { Accessibility } from 'lucide-react';

interface AccessibilityButtonProps {
  onClick: () => void;
}

export function AccessibilityButton({ onClick }: AccessibilityButtonProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<number>(0); // Y position from bottom
  const [initialY, setInitialY] = useState<number>(0);
  const [initialPosition, setInitialPosition] = useState<number>(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Calculate default position: 12px above input area (assuming input is ~80px tall)
  const defaultBottom = 92; // 80px input + 12px margin

  useEffect(() => {
    setPosition(defaultBottom);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent click from firing when starting to drag
    if (e.button !== 0) return; // Only left mouse button
    setIsDragging(true);
    setInitialY(e.clientY);
    setInitialPosition(position);
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setInitialY(e.touches[0].clientY);
    setInitialPosition(position);
    e.stopPropagation();
  };

  const handleClick = (e: React.MouseEvent) => {
    // Only trigger onClick if not dragging
    if (!isDragging) {
      onClick();
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    let hasMoved = false;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = initialY - e.clientY; // Inverted because bottom positioning
      
      // Only count as dragging if moved more than 5px
      if (Math.abs(deltaY) > 5) {
        hasMoved = true;
      }
      
      const newPosition = initialPosition + deltaY;
      
      // Constrain position: minimum 12px above input (92px), maximum near top
      const minBottom = 92;
      const maxBottom = window.innerHeight - 60; // 60px from top
      const constrainedPosition = Math.max(minBottom, Math.min(maxBottom, newPosition));
      
      setPosition(constrainedPosition);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = initialY - e.touches[0].clientY;
      
      if (Math.abs(deltaY) > 5) {
        hasMoved = true;
      }
      
      const newPosition = initialPosition + deltaY;
      
      const minBottom = 92;
      const maxBottom = window.innerHeight - 60;
      const constrainedPosition = Math.max(minBottom, Math.min(maxBottom, newPosition));
      
      setPosition(constrainedPosition);
      e.preventDefault(); // Prevent scrolling while dragging
    };

    const handleMouseUp = () => {
      // If moved significantly, don't trigger click
      if (hasMoved) {
        setTimeout(() => setIsDragging(false), 50);
      } else {
        setIsDragging(false);
      }
    };

    const handleTouchEnd = () => {
      if (hasMoved) {
        setTimeout(() => setIsDragging(false), 50);
      } else {
        setIsDragging(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, initialY, initialPosition]);

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      className={`fixed right-0 z-40 bg-[#2d2d2d] rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 flex items-center justify-center touch-manipulation select-none ${
        isDragging 
          ? 'opacity-80 shadow-2xl cursor-grabbing scale-105' 
          : 'cursor-grab hover:bg-[#3d3d3d] hover:shadow-lg hover:scale-105 shadow-md'
      }`}
      style={{
        bottom: `${position}px`,
        width: '48px',
        height: '48px',
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      }}
      aria-label="Open accessibility menu"
      title="נגישות - ניתן לגרור למיקום אחר"
    >
      <Accessibility className="w-6 h-6 text-white" strokeWidth={2} />
    </button>
  );
}