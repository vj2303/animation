export function UIOverlay({ currentPosition }) {
    // Calculate current agent section and direction
    const currentAgent = Math.floor(currentPosition / 60);
    const agentSection = currentAgent;
    const isLeftToRight = agentSection % 2 === 0;
    const directionText = isLeftToRight ? "Left → Right" : "Right ← Left";
    const directionColor = isLeftToRight ? "#00ff88" : "#ff8800";
  
    return (
      <>
        {/* Controls Instructions */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          color: '#ffffff',
          fontFamily: 'Arial, sans-serif',
          fontSize: '12px',
          background: 'rgba(0,0,0,0.8)',
          padding: '12px',
          borderRadius: '8px',
          maxWidth: '320px',
          lineHeight: '1.4',
          boxShadow: '0 2px 10px rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>🎮 Controls (Alternating Curve Navigation):</div>
          <div>🔄 <strong>Scroll:</strong> Snap to next/previous AI agent</div>
          <div>🖱️ <strong>Mouse Drag:</strong> Subtle camera rotation</div>
          <div>🔍 <strong>Mouse Wheel:</strong> Zoom in/out</div>
          <div>⌨️ <strong>W/S:</strong> Snap forward/backward to agents</div>
          <div>📱 <strong>Touch:</strong> Swipe to snap between agents</div>
          <div>✨ <strong>Dots:</strong> Animated blinking with curve colors</div>
          <div>🤖 <strong>AI Agents:</strong> 3D floating boxes every 60 dots</div>
          <div>🌊 <strong>Path:</strong> Alternating left-right curve flow</div>
          <div>💫 <strong>Text:</strong> Direction arrows with glassmorphism</div>
          
          {/* Current Direction Indicator */}
          <div style={{ 
            marginTop: '10px', 
            padding: '6px', 
            background: 'rgba(255,255,255,0.1)', 
            borderRadius: '4px',
            border: `1px solid ${directionColor}`
          }}>
            <div style={{ fontSize: '11px', color: '#cccccc', marginBottom: '2px' }}>
              Current Path Direction:
            </div>
            <div style={{ 
              fontWeight: 'bold', 
              color: directionColor,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>{isLeftToRight ? "🌊" : "🌀"}</span>
              {directionText}
            </div>
          </div>
          
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#cccccc' }}>
            Agent: {currentAgent} | Position: {Math.floor(currentPosition)} | Section: {agentSection} | GSAP Snap Active
          </div>
        </div>
        
        {/* Progress indicator with direction colors */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '250px',
          height: '6px',
          background: 'rgba(255,255,255,0.3)',
          borderRadius: '3px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{
            height: '100%',
            background: `linear-gradient(to right, ${directionColor}, ${isLeftToRight ? '#00aa55' : '#aa5500'})`,
            width: `${((currentPosition % 360) / 360) * 100}%`,
            borderRadius: '3px',
            transition: 'width 0.1s ease, background 0.3s ease',
            boxShadow: `0 0 10px ${directionColor}50`
          }} />
        </div>
  
        {/* Direction Change Preview */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '10px',
          color: '#9ca3af',
          textAlign: 'center'
        }}>
          Next section: {!isLeftToRight ? "Left → Right" : "Right ← Left"}
        </div>
      </>
    );
  }