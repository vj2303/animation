'use client';

import { useEffect, useRef, useState } from 'react';
import { forwardRef, useImperativeHandle } from 'react';

const DottedPathRenderer = forwardRef(({ segments, currentPosition }, ref) => {
  const pathWrapperRef = useRef(null);

  const createDottedPath = () => {
    const wrapper = pathWrapperRef.current;
    if (!wrapper) return;
    
    wrapper.innerHTML = ''; // Clear existing dots and cards
    
    // Render each segment
    segments.forEach((segment, segmentIndex) => {
      const segmentDiv = document.createElement('div');
      segmentDiv.className = 'path-segment';
      segmentDiv.style.position = 'absolute';
      segmentDiv.style.left = '0';
      segmentDiv.style.top = '0';
      segmentDiv.style.width = '100%';
      segmentDiv.style.height = '100%';
      
      // Create dots for this segment
      segment.rows.forEach((row, rowIndex) => {
        const globalRowIndex = segmentIndex * 10 + rowIndex;
        const distanceFromCurrent = globalRowIndex - currentPosition;
        
        // Only render rows that are visible (within reasonable distance)
        if (Math.abs(distanceFromCurrent) > 25) return;
        
        // Calculate position and scale based on distance from current position
        const distance = distanceFromCurrent * 40;
        const progress = Math.abs(distanceFromCurrent) / 25;
        const scale = Math.max(0.1, 1 - (progress * 0.8));
        const dotSize = 8 * scale;
        const opacity = Math.max(0.1, 1 - (progress * 0.7));
        const rowWidth = Math.max(200, 800 - (progress * 400));
        
        // Position from bottom of screen
        const yPosition = window.innerHeight - 100 - distance;
        
        // Skip if too far off screen
        if (yPosition < -100 || yPosition > window.innerHeight + 100) return;
        
        // Create row container
        const rowDiv = document.createElement('div');
        rowDiv.className = 'dot-row';
        rowDiv.style.position = 'absolute';
        rowDiv.style.display = 'flex';
        rowDiv.style.justifyContent = 'space-between';
        rowDiv.style.left = '50%';
        rowDiv.style.top = `${yPosition}px`;
        rowDiv.style.width = `${rowWidth}px`;
        rowDiv.style.opacity = opacity;
        rowDiv.style.transform = `translateX(calc(-50% + ${row.curveOffset}px))`;
        rowDiv.style.zIndex = Math.floor(1000 - Math.abs(distanceFromCurrent));
        rowDiv.style.gap = `${80 * scale}px`; // Add large horizontal gap between dots
        
        // Create 6 dots for this row (reduced from 8 for better spacing)
        for (let col = 0; col < 6; col++) {
          const dot = document.createElement('div');
          dot.style.backgroundColor = '#4b5563';
          dot.style.borderRadius = '50%';
          dot.style.width = `${dotSize}px`;
          dot.style.height = `${dotSize}px`;
          dot.style.boxShadow = `0 0 ${dotSize * 0.5}px rgba(0,0,0,0.3)`;
          
          rowDiv.appendChild(dot);
        }
        
        segmentDiv.appendChild(rowDiv);

        // Add card every 20 dots
        if (globalRowIndex > 0 && globalRowIndex % 20 === 0) {
          const cardDiv = document.createElement('div');
          cardDiv.className = 'milestone-card';
          cardDiv.style.position = 'absolute';
          cardDiv.style.left = '50%';
          cardDiv.style.top = `${yPosition - 120}px`; // 120px above the dots for floating effect
          cardDiv.style.transform = `translateX(calc(-50% + ${row.curveOffset}px))`;
          cardDiv.style.width = `${Math.max(140, 220 * scale)}px`;
          cardDiv.style.height = `${Math.max(50, 70 * scale)}px`;
          cardDiv.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
          cardDiv.style.borderRadius = '16px';
          cardDiv.style.display = 'flex';
          cardDiv.style.alignItems = 'center';
          cardDiv.style.justifyContent = 'center';
          cardDiv.style.color = 'white';
          cardDiv.style.fontSize = `${Math.max(10, 14 * scale)}px`;
          cardDiv.style.fontWeight = 'bold';
          cardDiv.style.boxShadow = `
            0 8px 32px rgba(102, 126, 234, 0.4),
            0 4px 16px rgba(0,0,0,0.3),
            0 2px 8px rgba(0,0,0,0.2)
          `;
          cardDiv.style.opacity = opacity;
          cardDiv.style.zIndex = Math.floor(1001 - Math.abs(distanceFromCurrent)); // Higher than dots
          cardDiv.style.border = '2px solid rgba(255,255,255,0.4)';
          cardDiv.style.backdropFilter = 'blur(15px)';
          cardDiv.style.animation = 'float 3s ease-in-out infinite';
          
          // Add floating animation keyframes to the document if not already added
          if (!document.querySelector('#floating-keyframes')) {
            const style = document.createElement('style');
            style.id = 'floating-keyframes';
            style.textContent = `
              @keyframes float {
                0%, 100% { transform: translateY(0px) translateX(calc(-50% + ${row.curveOffset}px)); }
                50% { transform: translateY(-6px) translateX(calc(-50% + ${row.curveOffset}px)); }
              }
            `;
            document.head.appendChild(style);
          }
          
          // Add card content
          cardDiv.innerHTML = `
            <div style="text-align: center;">
              <div style="font-size: ${Math.max(8, 10 * scale)}px; opacity: 0.8;">✨ Milestone</div>
              <div>${globalRowIndex}</div>
            </div>
          `;
          
          segmentDiv.appendChild(cardDiv);

          // Add connecting line to show floating effect
          const connectionLine = document.createElement('div');
          connectionLine.className = 'connection-line';
          connectionLine.style.position = 'absolute';
          connectionLine.style.left = '50%';
          connectionLine.style.top = `${yPosition - 115}px`; // Start just below the card
          connectionLine.style.transform = `translateX(calc(-50% + ${row.curveOffset}px))`;
          connectionLine.style.width = '2px';
          connectionLine.style.height = '70px'; // Connect to the dots
          connectionLine.style.background = `linear-gradient(to bottom, 
            rgba(102, 126, 234, ${opacity * 0.6}) 0%, 
            rgba(102, 126, 234, ${opacity * 0.2}) 50%,
            transparent 100%
          )`;
          connectionLine.style.opacity = opacity * 0.7;
          connectionLine.style.zIndex = Math.floor(1000 - Math.abs(distanceFromCurrent));
          connectionLine.style.borderRadius = '1px';
          connectionLine.style.boxShadow = `0 0 8px rgba(102, 126, 234, ${opacity * 0.3})`;
          
          segmentDiv.appendChild(connectionLine);
        }
      });
      
      wrapper.appendChild(segmentDiv);
    });
  };

  // Expose the createDottedPath function to parent component
  useImperativeHandle(ref, () => ({
    createDottedPath
  }));

  useEffect(() => {
    createDottedPath();
  }, [segments, currentPosition]);

  return (
    <div 
      ref={pathWrapperRef}
      style={{
        position: 'fixed',
        inset: '0',
        transformOrigin: 'center bottom',
        transformStyle: 'preserve-3d',
        pointerEvents: 'none'
      }}
    >
      {/* Dots and cards will be generated by JavaScript */}
    </div>
  );
});

DottedPathRenderer.displayName = 'DottedPathRenderer';

// Path segment generator
const generatePathSegment = (segmentIndex) => {
  const rows = [];
  const baseOffset = segmentIndex * 10;
  
  for (let i = 0; i < 10; i++) {
    const globalRowIndex = baseOffset + i;
    const curveOffset = Math.sin(globalRowIndex * 0.3) * (80 - globalRowIndex * 0.5);
    
    rows.push({
      index: globalRowIndex,
      curveOffset: curveOffset
    });
  }
  
  return {
    id: segmentIndex,
    rows: rows
  };
};

// Main DottedPath component
export default function DottedPath() {
  const containerRef = useRef(null);
  const pathRendererRef = useRef(null);
  const animationIdRef = useRef(null);
  
  // Path state
  const [segments, setSegments] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const positionRef = useRef(0);
  
  // Camera state
  const [zoom, setZoom] = useState(600);

  // Initialize path segments
  useEffect(() => {
    const initialSegments = [];
    for (let i = 0; i < 10; i++) {
      initialSegments.push(generatePathSegment(i));
    }
    setSegments(initialSegments);
  }, []);

  // Add new segments as needed
  const addSegmentsIfNeeded = () => {
    const segmentLength = 10; // rows per segment
    const currentSegment = Math.floor(positionRef.current / segmentLength);
    const maxSegment = Math.max(...segments.map(s => s.id));
    const minSegment = Math.min(...segments.map(s => s.id));
    
    let newSegments = [...segments];
    let segmentsAdded = false;
    
    // Add forward segments
    if (currentSegment + 5 > maxSegment) {
      for (let i = maxSegment + 1; i <= currentSegment + 10; i++) {
        newSegments.push(generatePathSegment(i));
        segmentsAdded = true;
      }
    }
    
    // Add backward segments
    if (currentSegment - 5 < minSegment) {
      for (let i = currentSegment - 10; i < minSegment; i++) {
        if (i >= 0) {
          newSegments.unshift(generatePathSegment(i));
          segmentsAdded = true;
        }
      }
    }
    
    // Remove distant segments to prevent memory buildup
    newSegments = newSegments.filter(segment => 
      Math.abs(segment.id - currentSegment) <= 15
    );
    
    if (segmentsAdded || newSegments.length !== segments.length) {
      setSegments(newSegments);
    }
  };

  // Update camera transform
  const updateCameraTransform = () => {
    const container = containerRef.current;
    if (!container) return;
    container.style.perspective = `${zoom}px`;
  };

  // Handle scroll events
  const handleScroll = (event) => {
    event.preventDefault();
    
    // If holding Ctrl/Cmd, zoom instead of moving along path
    if (event.ctrlKey || event.metaKey) {
      const zoomSensitivity = 20;
      const newZoom = Math.max(200, Math.min(2000, zoom + event.deltaY * zoomSensitivity));
      setZoom(newZoom);
    } else {
      // Move along path
      const scrollSensitivity = 0.1;
      const newPosition = Math.max(0, positionRef.current + event.deltaY * scrollSensitivity);
      positionRef.current = newPosition;
      setCurrentPosition(newPosition);
      
      // Add segments if needed
      addSegmentsIfNeeded();
      
      // Smooth animation
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      animationIdRef.current = requestAnimationFrame(() => {
        if (pathRendererRef.current) {
          pathRendererRef.current.createDottedPath();
        }
      });
    }
  };

  // Handle touch events for mobile
  const touchStartYRef = useRef(0);
  
  const handleTouchStart = (event) => {
    if (event.touches.length === 1) {
      touchStartYRef.current = event.touches[0].clientY;
    }
  };

  const handleTouchMove = (event) => {
    event.preventDefault();
    
    if (event.touches.length === 1) {
      const touchY = event.touches[0].clientY;
      const deltaY = touchStartYRef.current - touchY;
      
      const scrollSensitivity = 0.2;
      const newPosition = Math.max(0, positionRef.current + deltaY * scrollSensitivity);
      positionRef.current = newPosition;
      setCurrentPosition(newPosition);
      
      touchStartYRef.current = touchY;
      
      // Add segments if needed
      addSegmentsIfNeeded();
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      animationIdRef.current = requestAnimationFrame(() => {
        if (pathRendererRef.current) {
          pathRendererRef.current.createDottedPath();
        }
      });
    }
  };

  // Keyboard controls
  const handleKeyDown = (event) => {
    const keyScrollAmount = 2;
    
    switch(event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        event.preventDefault();
        const newPosUp = Math.max(0, positionRef.current - keyScrollAmount);
        positionRef.current = newPosUp;
        setCurrentPosition(newPosUp);
        addSegmentsIfNeeded();
        if (pathRendererRef.current) {
          pathRendererRef.current.createDottedPath();
        }
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        event.preventDefault();
        const newPosDown = positionRef.current + keyScrollAmount;
        positionRef.current = newPosDown;
        setCurrentPosition(newPosDown);
        addSegmentsIfNeeded();
        if (pathRendererRef.current) {
          pathRendererRef.current.createDottedPath();
        }
        break;
    }
  };

  useEffect(() => {
    updateCameraTransform();
  }, [zoom]);

  useEffect(() => {
    // Add event listeners
    const handleWheelEvent = (e) => handleScroll(e);
    const handleTouchStartEvent = (e) => handleTouchStart(e);
    const handleTouchMoveEvent = (e) => handleTouchMove(e);
    const handleKeyDownEvent = (e) => handleKeyDown(e);

    document.addEventListener('wheel', handleWheelEvent, { passive: false });
    document.addEventListener('touchstart', handleTouchStartEvent, { passive: false });
    document.addEventListener('touchmove', handleTouchMoveEvent, { passive: false });
    document.addEventListener('keydown', handleKeyDownEvent);

    // Cleanup
    return () => {
      document.removeEventListener('wheel', handleWheelEvent);
      document.removeEventListener('touchstart', handleTouchStartEvent);
      document.removeEventListener('touchmove', handleTouchMoveEvent);
      document.removeEventListener('keydown', handleKeyDownEvent);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [segments, currentPosition, zoom]);

  return (
    <div style={{
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      height: '100vh',
      background: 'linear-gradient(to bottom, #f3f4f6, #dbeafe, #bfdbfe)',
      overflow: 'hidden',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div 
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          perspective: `${zoom}px`
        }}
      >
        <div 
          style={{
            position: 'absolute',
            inset: '0',
            transform: 'rotateX(75deg)',
            transformOrigin: 'center bottom',
            transformStyle: 'preserve-3d'
          }}
        >
          <DottedPathRenderer 
            ref={pathRendererRef}
            segments={segments}
            currentPosition={currentPosition}
          />
        </div>
      </div>
      
      {/* Controls Instructions */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: '#4b5563',
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        background: 'rgba(255,255,255,0.9)',
        padding: '12px',
        borderRadius: '8px',
        maxWidth: '280px',
        lineHeight: '1.4',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>🎮 Controls:</div>
        <div>🔄 <strong>Scroll:</strong> Move along infinite path</div>
        <div>🔍 <strong>Ctrl+Scroll:</strong> Zoom in/out</div>
        <div>⌨️ <strong>W/S:</strong> Forward/backward</div>
        <div>📱 <strong>Touch:</strong> Swipe vertically to move</div>
        <div>🎯 <strong>Cards:</strong> Appear every 20 dots</div>
        <div style={{ marginTop: '8px', fontSize: '11px', color: '#6b7280' }}>
          Position: {Math.floor(currentPosition)} | Segments: {segments.length}
        </div>
      </div>
      
      {/* Progress indicator */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '200px',
        height: '4px',
        background: 'rgba(255,255,255,0.3)',
        borderRadius: '2px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(to right, #3b82f6, #1d4ed8)',
          width: `${((currentPosition % 100) / 100) * 100}%`,
          borderRadius: '2px',
          transition: 'width 0.1s ease'
        }} />
      </div>
    </div>
  );
}