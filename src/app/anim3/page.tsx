import React from 'react';

const DottedPath = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-blue-100 to-blue-200 flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full" style={{ perspective: '600px' }}>
        <div 
          className="absolute inset-0"
          style={{
            transform: 'rotateX(80deg)',
            transformOrigin: 'center center',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Create rows of exactly 8 dots going into the distance */}
          {[...Array(25)].map((_, row) => {
            // Start from screen and go into distance
            const progress = row / 24;
            const distance = row * 40; // Distance between rows
            const scale = 1 - (progress * 0.8); // Dots get smaller as they go away
            const dotSize = 8 * scale; // Start at 8px, shrink to ~1.6px
            const opacity = 1 - (progress * 0.7); // Fade as they go away
            const rowWidth = 300 - (progress * 150); // Row gets narrower
            
            return (
              <div
                key={row}
                className="absolute flex justify-between"
                style={{
                  top: `${50 + distance}px`,
                  left: '50%',
                  width: `${rowWidth}px`,
                  transform: `translateX(-50%)`,
                  opacity: opacity
                }}
              >
                {/* Exactly 8 dots per row */}
                {[...Array(8)].map((_, col) => (
                  <div
                    key={col}
                    className="bg-gray-600 rounded-full"
                    style={{
                      width: `${dotSize}px`,
                      height: `${dotSize}px`,
                      boxShadow: `0 0 ${dotSize * 0.5}px rgba(0,0,0,0.3)`
                    }}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DottedPath;