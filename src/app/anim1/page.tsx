'use client'
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';

// Convert SVG path to 3D points
const convertSVGPathTo3D = (pathData, direction = 'ltr') => {
  // Parse the SVG path data
  const paths = pathData.match(/d="([^"]+)"/g);
  const allPoints = [];
  
  paths.forEach((path, pathIndex) => {
    const d = path.match(/d="([^"]+)"/)[1];
    const points = [];
    
    // Simple parser for cubic bezier curves (M and C commands)
    const commands = d.match(/[MLC][^MLC]*/g);
    
    commands.forEach(command => {
      const type = command[0];
      const coords = command.slice(1).trim().split(/[\s,]+/).map(Number);
      
      if (type === 'M') {
        // Move to
        points.push([coords[0], coords[1]]);
      } else if (type === 'C') {
        // Cubic bezier curve - sample points along the curve
        const startPoint = points[points.length - 1] || [0, 0];
        for (let t = 0.1; t <= 1; t += 0.1) {
          const x = Math.pow(1-t, 3) * startPoint[0] + 
                   3 * Math.pow(1-t, 2) * t * coords[0] + 
                   3 * (1-t) * Math.pow(t, 2) * coords[2] + 
                   Math.pow(t, 3) * coords[4];
          const y = Math.pow(1-t, 3) * startPoint[1] + 
                   3 * Math.pow(1-t, 2) * t * coords[1] + 
                   3 * (1-t) * Math.pow(t, 2) * coords[3] + 
                   Math.pow(t, 3) * coords[5];
          points.push([x, y]);
        }
      }
    });
    
    // Convert 2D points to 3D with some depth variation
    const points3D = points.map((point, index) => {
      const x = direction === 'ltr' ? (point[0] - 660) / 100 : (660 - point[0]) / 100;
      const y = 0; // Keep roads on ground level
      const z = (332 - point[1]) / 50; // Convert Y to Z depth
      return new THREE.Vector3(x, y + pathIndex * 0.1, z);
    });
    
    allPoints.push(points3D);
  });
  
  return allPoints;
};

// Road component
const Road = ({ pathData, direction, color = '#666666', opacity = 0.3 }) => {
  const roadPaths = useMemo(() => {
    return convertSVGPathTo3D(pathData, direction);
  }, [pathData, direction]);

  return (
    <group>
      {roadPaths.map((points, index) => (
        <Line
          key={index}
          points={points}
          color={color}
          lineWidth={3}
          transparent
          opacity={opacity}
          dashed
          dashScale={0.5}
          dashSize={0.1}
          gapSize={0.5}
        />
      ))}
    </group>
  );
};

// Animated camera component
const CameraController = ({ scrollX }) => {
  const { camera } = useThree();
  
  useFrame(() => {
    // Move camera along the path based on scroll
    camera.position.x = scrollX / 100;
    camera.position.y = 2;
    camera.position.z = 5;
    
    // Look ahead on the path
    camera.lookAt(scrollX / 100 + 2, 0, 0);
  });
  
  return null;
};

// Particle system for atmosphere
const Particles = () => {
  const particlesRef = useRef();
  const particleCount = 1000;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = Math.random() * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    
    return positions;
  }, []);
  
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.elapsedTime * 0.05;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.05}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// Main component
const RoadAnimation = () => {
  const [scrollX, setScrollX] = useState(0);
  const containerRef = useRef();
  
  // Handle horizontal scroll
  useEffect(() => {
    const handleScroll = (e) => {
      e.preventDefault();
      const delta = e.deltaX || e.deltaY;
      setScrollX(prev => prev + delta * 0.5);
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleScroll, { passive: false });
      return () => container.removeEventListener('wheel', handleScroll);
    }
  }, []);

  // Ensure full screen coverage on mount
  useEffect(() => {
    // Remove any default body margins/padding
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    
    return () => {
      // Cleanup on unmount
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  // SVG path data
  const leftToRightPath = `
    <path d="M163.84 329.5C277.726 225.915 471.533 62.8735 3 28.5" stroke="url(#paint0_linear_12_221)" stroke-opacity="0.26" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 50"/>
    <path d="M452.866 319.5C518.84 226.445 543.43 35.7691 114 17.5" stroke="url(#paint1_linear_12_221)" stroke-opacity="0.53" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 50"/>
    <path d="M740 318.5C734.167 221.983 614 24.8598 180 8.5" stroke="url(#paint2_linear_12_221)" stroke-opacity="0.38" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 50"/>
    <path d="M1032 319.5C930.5 211.027 637.4 -2.94021 277 8.97788" stroke="url(#paint3_linear_12_221)" stroke-opacity="0.23" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 50"/>
    <path d="M1317 318.5C1174.17 219.992 769 18.8817 291 2.5" stroke="url(#paint4_linear_12_221)" stroke-opacity="0.15" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 50"/>
  `;
  
  const rightToLeftPath = `
    <path d="M1156.16 329.5C1042.27 225.915 848.467 62.8735 1317 28.5" stroke="url(#paint0_linear_16_400)" stroke-opacity="0.26" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 50"/>
    <path d="M867.134 319.5C801.16 226.445 776.57 35.7691 1206 17.5" stroke="url(#paint1_linear_16_400)" stroke-opacity="0.53" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 50"/>
    <path d="M580 318.5C585.833 221.983 706 24.8598 1140 8.5" stroke="url(#paint2_linear_16_400)" stroke-opacity="0.38" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 50"/>
    <path d="M288 319.5C389.5 211.027 682.6 -2.94021 1043 8.97788" stroke="url(#paint3_linear_16_400)" stroke-opacity="0.23" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 50"/>
    <path d="M2.99998 318.5C145.833 219.992 551 18.8817 1029 2.5" stroke="url(#paint4_linear_16_400)" stroke-opacity="0.15" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 50"/>
  `;
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full bg-black overflow-hidden cursor-grab active:cursor-grabbing"
      style={{ 
        margin: 0, 
        padding: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0
      }}
    >
      <div className="absolute top-4 left-4 z-10 text-white font-mono text-sm">
        <p>Scroll horizontally to travel along the road</p>
        <p>Position: {Math.round(scrollX)}</p>
      </div>
      
      <Canvas
        camera={{ position: [0, 2, 5], fov: 75 }}
        style={{ 
          background: 'linear-gradient(to bottom, #000411, #000)',
          width: '100vw',
          height: '100vh',
          position: 'absolute',
          top: 0,
          left: 0
        }}
        gl={{ alpha: false, antialias: true }}
        dpr={[1, 2]}
      >
        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <pointLight position={[-10, 10, -10]} intensity={0.3} color="#4444ff" />
        
        {/* Roads */}
        <Road 
          pathData={leftToRightPath} 
          direction="ltr" 
          color="#666666" 
          opacity={0.8} 
        />
        <Road 
          pathData={rightToLeftPath} 
          direction="rtl" 
          color="#888888" 
          opacity={0.6} 
        />
        
        {/* Atmospheric particles */}
        <Particles />
        
        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <planeGeometry args={[200, 200]} />
          <meshLambertMaterial color="#111111" transparent opacity={0.5} />
        </mesh>
        
        {/* Animated camera */}
        <CameraController scrollX={scrollX} />
      </Canvas>
    </div>
  );
};

export default RoadAnimation;




