'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function DottedPath() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animationIdRef = useRef(null);
  
  // Path state
  const [currentPosition, setCurrentPosition] = useState(0);
  const positionRef = useRef(0);
  const dotsGroupRef = useRef(null);
  const cardsGroupRef = useRef(null);
  const textGroupRef = useRef(null); // New group for floating text
  const dotsArrayRef = useRef([]); // Store dots for blinking animation
  const textMeshesRef = useRef([]); // Store text meshes for animation
  
  // GSAP and scroll snapping
  const isSnappingRef = useRef(false);
  const targetPositionRef = useRef(0);

  // Initialize GSAP (using CDN version)
  useEffect(() => {
    // Load GSAP from CDN
    if (!window.gsap) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
      script.onload = () => {
        console.log('GSAP loaded successfully');
      };
      document.head.appendChild(script);
    }
  }, []);

  // Create text texture with glassmorphism effect
  const createTextTexture = (text, isActive = false) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, 512, 128);
    
    if (isActive) {
      // Glassmorphism background for active state
      const gradient = ctx.createLinearGradient(0, 0, 512, 128);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
      ctx.fillStyle = gradient;
      
      // Rounded rectangle
      const radius = 20;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(512 - radius, 0);
      ctx.quadraticCurveTo(512, 0, 512, radius);
      ctx.lineTo(512, 128 - radius);
      ctx.quadraticCurveTo(512, 128, 512 - radius, 128);
      ctx.lineTo(radius, 128);
      ctx.quadraticCurveTo(0, 128, 0, 128 - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.fill();
      
      // Border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Inner glow
      ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }
    
    // Text styling
    ctx.font = isActive ? 'bold 32px Arial' : 'bold 28px Arial';
    ctx.fillStyle = isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.7)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Text shadow for better readability
    if (!isActive) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    }
    
    // Draw text
    ctx.fillText(text, 256, 64);
    
    return new THREE.CanvasTexture(canvas);
  };

  // Snap to agent function
  const snapToAgent = (direction) => {
    if (isSnappingRef.current || !window.gsap) return;
    
    const currentAgent = Math.floor(positionRef.current / 60);
    let targetAgent;
    
    if (direction > 0) {
      // Scrolling down - go to next agent
      targetAgent = currentAgent + 1;
    } else {
      // Scrolling up - go to previous agent
      targetAgent = Math.max(0, currentAgent - 1);
    }
    
    const targetPosition = targetAgent * 60;
    targetPositionRef.current = targetPosition;
    
    if (targetPosition === positionRef.current) return;
    
    isSnappingRef.current = true;
    
    // GSAP animation to target position
    window.gsap.to(positionRef, {
      current: targetPosition,
      duration: 1.2,
      ease: "power2.out",
      onUpdate: () => {
        setCurrentPosition(positionRef.current);
        createDottedPath();
      },
      onComplete: () => {
        isSnappingRef.current = false;
      }
    });
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup with gradient background
    const scene = new THREE.Scene();
    
    // Create gradient background
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, '#1a1a1a'); // Dark gray at top
    gradient.addColorStop(0.5, '#0f0f0f'); // Darker in middle
    gradient.addColorStop(1, '#000000'); // Pure black at bottom
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    
    const backgroundTexture = new THREE.CanvasTexture(canvas);
    const backgroundGeometry = new THREE.SphereGeometry(500, 32, 32);
    const backgroundMaterial = new THREE.MeshBasicMaterial({ 
      map: backgroundTexture, 
      side: THREE.BackSide 
    });
    const backgroundSphere = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    scene.add(backgroundSphere);
    
    scene.fog = new THREE.Fog(0x000000, 50, 200);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 15, 25);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1); // Black background
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Subtle OrbitControls implementation
    const controls = {
      enabled: true,
      target: new THREE.Vector3(0, 5, 0), // Focus slightly above the ground
      minDistance: 15,
      maxDistance: 50,
      minPolarAngle: Math.PI * 0.2, // Limit how high we can look
      maxPolarAngle: Math.PI * 0.8, // Limit how low we can look
      enablePan: false, // Disable panning to keep focus on path
      enableZoom: true,
      enableRotate: true,
      rotateSpeed: 0.3, // Much more subtle rotation
      zoomSpeed: 0.5,
      dampingFactor: 0.1
    };
    controlsRef.current = controls;

    // Mouse control variables
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    const spherical = new THREE.Spherical();
    const sphericalDelta = new THREE.Spherical();
    
    // Set initial camera position
    spherical.setFromVector3(camera.position.clone().sub(controls.target));

    // Mouse event handlers
    const onMouseDown = (event) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseMove = (event) => {
      if (!isDragging) return;

      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };

      // Much more subtle rotation - reduced sensitivity
      const rotateAngle = 2 * Math.PI * deltaMove.x / window.innerWidth * controls.rotateSpeed;
      const rotateAngleVertical = 2 * Math.PI * deltaMove.y / window.innerHeight * controls.rotateSpeed;

      sphericalDelta.theta -= rotateAngle;
      sphericalDelta.phi -= rotateAngleVertical;

      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (event) => {
      if (event.ctrlKey) return; // Let path navigation handle this
      
      const scale = event.deltaY > 0 ? 1.05 : 0.95; // More subtle zoom
      const newDistance = spherical.radius * scale;
      spherical.radius = Math.max(controls.minDistance, Math.min(controls.maxDistance, newDistance));
    };

    // Add event listeners
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel);

    // Update camera position
    const updateCamera = () => {
      spherical.theta += sphericalDelta.theta;
      spherical.phi += sphericalDelta.phi;
      
      // Apply angle constraints
      spherical.phi = Math.max(controls.minPolarAngle, Math.min(controls.maxPolarAngle, spherical.phi));
      
      camera.position.setFromSpherical(spherical).add(controls.target);
      camera.lookAt(controls.target);
      
      // Apply damping for smooth movement
      sphericalDelta.theta *= (1 - controls.dampingFactor);
      sphericalDelta.phi *= (1 - controls.dampingFactor);
    };

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create dots group
    const dotsGroup = new THREE.Group();
    scene.add(dotsGroup);
    dotsGroupRef.current = dotsGroup;

    // Create cards group
    const cardsGroup = new THREE.Group();
    scene.add(cardsGroup);
    cardsGroupRef.current = cardsGroup;

    // Create text group
    const textGroup = new THREE.Group();
    scene.add(textGroup);
    textGroupRef.current = textGroup;

    // Blinking animation function
    const animateBlinking = () => {
      const time = Date.now() * 0.001; // Current time in seconds
      
      dotsArrayRef.current.forEach((dot, index) => {
        if (!dot || !dot.material) return;
        
        // Create staggered blinking effect
        const blinkOffset = index * 0.8; // Much slower stagger between dots
        const blinkSpeed = 0.3; // Very slow speed of blinking
        const blinkWave = Math.sin(time * blinkSpeed + blinkOffset);
        
        // Random occasional bright white blinks (very rare)
        const randomBlink = Math.random() < 0.0002; // 0.02% chance per frame (very rare)
        
        if (randomBlink) {
          // Bright white flash
          dot.material.color.setHex(0xffffff);
          dot.material.opacity = 1;
          dot.scale.setScalar(1.15); // Very subtle flash size
        } else {
          // Normal pulsing between gray and slightly brighter (very subtle)
          const intensity = (blinkWave + 1) * 0.5; // Normalize to 0-1
          const grayValue = 0.65 + intensity * 0.15; // Pulse between 0.65 and 0.8 (very subtle range)
          dot.material.color.setRGB(grayValue, grayValue, grayValue);
          dot.scale.setScalar(1); // Normal size
        }
      });
    };

    // Animate floating text
    const animateFloatingText = () => {
      const time = Date.now() * 0.001;
      const currentAgent = Math.floor(positionRef.current / 60);
      
      textMeshesRef.current.forEach((textMesh, index) => {
        if (!textMesh) return;
        
        const isActive = index === currentAgent;
        const agentPosition = index * 60;
        const distanceFromCurrent = Math.abs(positionRef.current - agentPosition);
        
        // Update texture based on active state
        if (textMesh.userData.isActive !== isActive) {
          textMesh.userData.isActive = isActive;
          textMesh.material.map = createTextTexture(textMesh.userData.text, isActive);
          textMesh.material.needsUpdate = true;
        }
        
        // Bouncy animation for active text
        if (isActive) {
          const bounceTime = time * 3; // Faster bounce for active
          const bounce = Math.sin(bounceTime) * 0.5 + Math.sin(bounceTime * 2) * 0.2;
          textMesh.position.y = textMesh.userData.baseY + bounce;
          
          // Scale animation
          const scaleTime = time * 2;
          const scale = 1 + Math.sin(scaleTime) * 0.1;
          textMesh.scale.setScalar(scale);
          
          // Gentle rotation
          textMesh.rotation.y = Math.sin(time * 1.5) * 0.1;
        } else {
          // Gentle floating for inactive text
          const floatTime = time * 0.8 + index * 0.5;
          textMesh.position.y = textMesh.userData.baseY + Math.sin(floatTime) * 0.2;
          textMesh.scale.setScalar(1);
          textMesh.rotation.y = 0;
        }
        
        // Fade based on distance
        const fadeDistance = 120; // Start fading at 2 agents away
        const opacity = Math.max(0.1, 1 - Math.max(0, distanceFromCurrent - 60) / fadeDistance);
        textMesh.material.opacity = opacity;
      });
    };

    // Render loop
    const animate = () => {
      updateCamera();
      animateBlinking(); // Add blinking animation
      animateFloatingText(); // Add floating text animation
      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Create dots and cards
  const createDottedPath = () => {
    if (!dotsGroupRef.current || !cardsGroupRef.current || !textGroupRef.current) return;

    // Clear existing objects
    dotsGroupRef.current.clear();
    cardsGroupRef.current.clear();
    textGroupRef.current.clear();
    dotsArrayRef.current = []; // Clear dots array
    textMeshesRef.current = []; // Clear text meshes array

    const visibleRange = 50;
    
    // Create 2D dot geometry (flat circle)
    const dotGeometry = new THREE.CircleGeometry(0.4, 16);

    // AI agent names array
    const aiAgents = [
      '🖋️ Content Writer',
      '📊 Lead Generation',
      '📱 App Creator',
      '🌐 Website Creator',
      '🎨 Design Assistant',
      '📈 Data Analyst',
      '🤖 Chatbot Builder',
      '📧 Email Marketer',
      '🎥 Video Editor',
      '📱 Social Media Manager',
      '🔍 SEO Optimizer',
      '💰 Sales Assistant',
      '📝 Blog Writer',
      '🎙️ Podcast Creator',
      '📊 Report Generator',
      '🛍️ E-commerce Helper',
      '🎯 Ad Campaign Manager',
      '📋 Project Manager',
      '🔧 Code Reviewer',
      '📚 Course Creator'
    ];

    // Create dots
    for (let i = -visibleRange; i < visibleRange; i++) {
      const globalRowIndex = Math.floor(positionRef.current) + i;
      if (globalRowIndex < 0) continue;

      const distance = i * 3; // 3 units between rows
      const progress = Math.abs(i) / visibleRange;
      const opacity = Math.max(0.1, 1 - (progress * 0.8));
      
      // Curve calculation
      const curveOffset = Math.sin(globalRowIndex * 0.3) * (4 - globalRowIndex * 0.02);
      
      // Create 6 dots per row
      for (let col = 0; col < 6; col++) {
        const dotMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x808080, // Starting gray color
          transparent: true,
          opacity: opacity
        });
        
        const dot = new THREE.Mesh(dotGeometry, dotMaterial);
        
        // Make dots face up (lay flat on ground)
        dot.rotation.x = -Math.PI / 2;
        
        // Position dots fixed to the ground (y = 0)
        const xPos = (col - 2.5) * 4 + curveOffset;
        const zPos = -distance;
        
        dot.position.set(xPos, 0.01, zPos); // Slightly above ground to prevent z-fighting
        
        // Store dot in array for blinking animation
        dotsArrayRef.current.push(dot);
        
        dotsGroupRef.current.add(dot);
      }

      // Add AI agent boxes every 60 dots with much larger vertical gap
      if (globalRowIndex > 0 && globalRowIndex % 60 === 0) {
        // Get AI agent name based on milestone number
        const agentIndex = (Math.floor(globalRowIndex / 60) - 1) % aiAgents.length;
        const agentName = aiAgents[agentIndex];
        
        // Create 3D box geometry
        const boxGeometry = new THREE.BoxGeometry(6, 4, 2);
        
        // Create canvas for texture
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Create gradient background
        const gradientColors = [
          ['#667eea', '#764ba2'], // Purple-blue
          ['#f093fb', '#f5576c'], // Pink-red
          ['#4facfe', '#00f2fe'], // Blue-cyan
          ['#43e97b', '#38f9d7'], // Green-cyan
          ['#fa709a', '#fee140'], // Pink-yellow
          ['#a8edea', '#fed6e3'], // Mint-pink
          ['#ffecd2', '#fcb69f'], // Peach
          ['#ff9a9e', '#fecfef'], // Rose
        ];
        
        const colorIndex = agentIndex % gradientColors.length;
        const gradient = ctx.createLinearGradient(0, 0, 512, 256);
        gradient.addColorStop(0, gradientColors[colorIndex][0]);
        gradient.addColorStop(1, gradientColors[colorIndex][1]);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 256);
        
        // Add subtle pattern overlay
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < 10; i++) {
          ctx.fillRect(i * 60, 0, 20, 256);
        }
        
        // Add border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 6;
        ctx.strokeRect(3, 3, 506, 250);
        
        // Add AI Agent text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.fillText('AI AGENT', 256, 80);
        
        // Add agent name (split into lines if too long)
        const words = agentName.split(' ');
        if (words.length > 2) {
          ctx.font = 'bold 28px Arial';
          ctx.fillText(words.slice(0, 2).join(' '), 256, 140);
          ctx.fillText(words.slice(2).join(' '), 256, 180);
        } else {
          ctx.font = 'bold 32px Arial';
          ctx.fillText(agentName, 256, 160);
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        
        // Create materials for each face
        const materials = [
          new THREE.MeshLambertMaterial({ map: texture }), // Right
          new THREE.MeshLambertMaterial({ map: texture }), // Left
          new THREE.MeshLambertMaterial({ color: gradientColors[colorIndex][1] }), // Top
          new THREE.MeshLambertMaterial({ color: gradientColors[colorIndex][0] }), // Bottom
          new THREE.MeshLambertMaterial({ map: texture }), // Front
          new THREE.MeshLambertMaterial({ map: texture })  // Back
        ];
        
        const box = new THREE.Mesh(boxGeometry, materials);
        box.castShadow = true;
        box.receiveShadow = true;
        
        // Position box high above dots (20 units = significant air gap, fixed height)
        box.position.set(curveOffset, 20, -distance);
        
        // Add subtle floating animation
        const time = Date.now() * 0.001;
        box.position.y += Math.sin(time * 0.5 + globalRowIndex) * 0.4;
        
        // Add gentle rotation
        box.rotation.y = Math.sin(time * 0.3 + globalRowIndex) * 0.1;
        box.rotation.x = Math.sin(time * 0.2 + globalRowIndex) * 0.05;
        
        cardsGroupRef.current.add(box);

        // Create floating text in front of the card
        const textGeometry = new THREE.PlaneGeometry(12, 3);
        const currentAgent = Math.floor(positionRef.current / 60);
        const isActive = Math.floor(globalRowIndex / 60) - 1 === currentAgent;
        
        const textTexture = createTextTexture(agentName, isActive);
        const textMaterial = new THREE.MeshBasicMaterial({
          map: textTexture,
          transparent: true,
          opacity: 1,
          alphaTest: 0.1
        });
        
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        
        // Position text in front of the card
        const textBaseY = 25; // Higher than the card
        textMesh.position.set(curveOffset, textBaseY, -distance + 8); // 8 units in front
        
        // Store data for animation
        textMesh.userData = {
          text: agentName,
          baseY: textBaseY,
          isActive: isActive
        };
        
        // Make text face the camera
        textMesh.lookAt(cameraRef.current.position);
        
        textGroupRef.current.add(textMesh);
        textMeshesRef.current[Math.floor(globalRowIndex / 60) - 1] = textMesh;
      }
    }
  };

  // Handle path navigation with snapping
  const handleScroll = (event) => {
    if (!event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      
      if (isSnappingRef.current) return; // Prevent scrolling during snap animation
      
      const scrollDirection = event.deltaY > 0 ? 1 : -1;
      snapToAgent(scrollDirection);
    }
  };

  // Keyboard controls with snapping
  const handleKeyDown = (event) => {
    if (isSnappingRef.current) return; // Prevent movement during snap animation
    
    switch(event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        event.preventDefault();
        snapToAgent(-1);
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        event.preventDefault();
        snapToAgent(1);
        break;
    }
  };

  // Touch controls with snapping
  const touchStartYRef = useRef(0);
  const touchDeltaRef = useRef(0);
  
  const handleTouchStart = (event) => {
    if (event.touches.length === 1) {
      touchStartYRef.current = event.touches[0].clientY;
      touchDeltaRef.current = 0;
    }
  };

  const handleTouchMove = (event) => {
    if (event.touches.length === 1 && !isSnappingRef.current) {
      const touchY = event.touches[0].clientY;
      touchDeltaRef.current = touchStartYRef.current - touchY;
    }
  };

  const handleTouchEnd = (event) => {
    if (Math.abs(touchDeltaRef.current) > 50 && !isSnappingRef.current) { // Minimum swipe distance
      const direction = touchDeltaRef.current > 0 ? 1 : -1;
      snapToAgent(direction);
    }
    touchDeltaRef.current = 0;
  };

  useEffect(() => {
    createDottedPath();
  }, []);

  useEffect(() => {
    // Add event listeners
    document.addEventListener('wheel', handleScroll, { passive: false });
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Cleanup
    return () => {
      document.removeEventListener('wheel', handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div style={{
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: 'Arial, sans-serif',
      background: 'radial-gradient(ellipse at center, #2a2a2a 0%, #1a1a1a 50%, #000000 100%)'
    }}>
      <div 
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%'
        }}
      />
      
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
        maxWidth: '300px',
        lineHeight: '1.4',
        boxShadow: '0 2px 10px rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>🎮 Controls (Snap Navigation):</div>
        <div>🔄 <strong>Scroll:</strong> Snap to next/previous AI agent</div>
        <div>🖱️ <strong>Mouse Drag:</strong> Subtle camera rotation</div>
        <div>🔍 <strong>Mouse Wheel:</strong> Zoom in/out</div>
        <div>⌨️ <strong>W/S:</strong> Snap forward/backward to agents</div>
        <div>📱 <strong>Touch:</strong> Swipe to snap between agents</div>
        <div>✨ <strong>Dots:</strong> Animated blinking with white flashes</div>
        <div>🤖 <strong>AI Agents:</strong> 3D floating boxes every 60 dots</div>
        <div>💫 <strong>Text:</strong> Bouncy glassmorphism names on active agent</div>
        <div style={{ marginTop: '8px', fontSize: '11px', color: '#cccccc' }}>
          Agent: {Math.floor(currentPosition / 60)} | Position: {Math.floor(currentPosition)} | GSAP Snap Active
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
          width: `${((currentPosition % 360) / 360) * 100}%`,
          borderRadius: '2px',
          transition: 'width 0.1s ease'
        }} />
      </div>
    </div>
  );
}