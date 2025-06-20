'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';

const InteractiveDottedPath = () => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const animationRef = useRef(null);
  const touchStartY = useRef(0);

  // Generate dots based on current scroll offset
  const generateDots = useCallback(() => {
    const dots = [];
    
    // Create 50 rows to account for scrolling
    for (let row = 0; row < 50; row++) {
      const adjustedRow = row + scrollOffset;
      const progress = adjustedRow / 49;
      const distance = row * 40;
      const scale = Math.max(0.1, 1 - (progress * 0.8));
      const dotSize = 8 * scale;
      const opacity = Math.max(0.1, 1 - (progress * 0.7));
      const rowWidth = Math.max(50, 300 - (progress * 150));
      
      // Calculate curve offset - creates an S-curve
      const curveOffset = Math.sin(adjustedRow * 0.3) * (80 - adjustedRow * 1.5);
      
      // Create array of 8 dots for this row
      const rowDots = [];
      for (let col = 0; col < 8; col++) {
        rowDots.push({
          id: `${row}-${col}`,
          size: dotSize,
          opacity: opacity
        });
      }
      
      dots.push({
        id: row,
        dots: rowDots,
        top: 50 + distance,
        width: rowWidth,
        opacity: opacity,
        transform: curveOffset
      });
    }
    
    return dots;
  }, [scrollOffset]);

  // Handle scroll events
  const handleScroll = useCallback((event) => {
    event.preventDefault();
    
    const scrollSensitivity = 0.05;
    const newOffset = scrollOffset + (event.deltaY * scrollSensitivity);
    
    // Limit scroll range
    const clampedOffset = Math.max(0, Math.min(newOffset, 200));
    
    // Smooth animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    animationRef.current = requestAnimationFrame(() => {
      setScrollOffset(clampedOffset);
    });
  }, [scrollOffset]);

  // Handle touch events for mobile
  const handleTouchStart = useCallback((event) => {
    touchStartY.current = event.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((event) => {
    event.preventDefault();
    const touchY = event.touches[0].clientY;
    const deltaY = touchStartY.current - touchY;
    
    const scrollSensitivity = 0.1;
    const newOffset = scrollOffset + (deltaY * scrollSensitivity);
    const clampedOffset = Math.max(0, Math.min(newOffset, 200));
    
    touchStartY.current = touchY;
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    animationRef.current = requestAnimationFrame(() => {
      setScrollOffset(clampedOffset);
    });
  }, [scrollOffset]);

  // Handle keyboard controls
  const handleKeyDown = useCallback((event) => {
    const keyScrollAmount = 2;
    
    switch(event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        event.preventDefault();
        setScrollOffset(prev => Math.max(0, prev - keyScrollAmount));
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        event.preventDefault();
        setScrollOffset(prev => Math.min(200, prev + keyScrollAmount));
        break;
    }
  }, []);

  // Set up event listeners
  useEffect(() => {
    const handleWheel = (event) => handleScroll(event);
    const handleTouch = (event) => handleTouchMove(event);
    const handleTouchStartEvent = (event) => handleTouchStart(event);
    const handleKey = (event) => handleKeyDown(event);

    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchstart', handleTouchStartEvent, { passive: false });
    document.addEventListener('touchmove', handleTouch, { passive: false });
    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchstart', handleTouchStartEvent);
      document.removeEventListener('touchmove', handleTouch);
      document.removeEventListener('keydown', handleKey);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleScroll, handleTouchMove, handleTouchStart, handleKeyDown]);

  const dotRows = generateDots();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-blue-100 to-blue-200 flex items-center justify-center overflow-hidden">
      {/* Instructions */}
      <div className="absolute top-4 left-4 text-sm text-gray-600 bg-white/80 p-3 rounded-lg shadow-sm z-10">
        <p className="font-semibold mb-1">Navigate the path:</p>
        <p>• Mouse wheel or trackpad</p>
        <p>• Arrow keys or W/S</p>
        <p>• Touch swipe (mobile)</p>
      </div>
      
      {/* Scroll progress indicator */}
      <div className="absolute top-4 right-4 text-sm text-gray-600 bg-white/80 p-3 rounded-lg shadow-sm z-10">
        <p>Progress: {Math.round(scrollOffset)}/200</p>
      </div>

      <div className="relative w-full h-full" style={{ perspective: '600px' }}>
        <div 
          className="absolute inset-0"
          style={{
            transform: 'rotateX(80deg)',
            transformOrigin: 'center center',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Render dot rows */}
          {dotRows.map((row) => (
            <div
              key={row.id}
              className="absolute flex justify-between"
              style={{
                top: `${row.top}px`,
                left: '50%',
                width: `${row.width}px`,
                opacity: row.opacity,
                transform: `translateX(calc(-50% + ${row.transform}px))`
              }}
            >
              {/* Render 8 dots per row */}
              {row.dots.map((dot) => (
                <div
                  key={dot.id}
                  className="bg-gray-600 rounded-full"
                  style={{
                    width: `${dot.size}px`,
                    height: `${dot.size}px`,
                    boxShadow: `0 0 ${dot.size * 0.5}px rgba(0,0,0,0.3)`
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InteractiveDottedPath;