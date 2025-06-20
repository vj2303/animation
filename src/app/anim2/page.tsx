'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './HorizontalScroll.module.css';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Left to Right SVG Component
const LeftToRightSVG = ({ svgRef }: { svgRef: React.RefObject<SVGSVGElement> }) => (
  <svg
    ref={svgRef}
    className={styles.pathSvg}
    width="1320"
    height="332"
    viewBox="0 0 1320 332"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1156.16 329.5C1042.27 225.915 848.467 62.8735 1317 28.5"
      stroke="white"
      strokeOpacity="0.8"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="8 12"
    />
    <path
      d="M867.134 319.5C801.16 226.445 776.57 35.7691 1206 17.5"
      stroke="white"
      strokeOpacity="0.7"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="8 12"
    />
    <path
      d="M580 318.5C585.833 221.983 706 24.8598 1140 8.5"
      stroke="white"
      strokeOpacity="0.6"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="8 12"
    />
    <path
      d="M288 319.5C389.5 211.027 682.6 -2.94021 1043 8.97788"
      stroke="white"
      strokeOpacity="0.5"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="8 12"
    />
    <path
      d="M2.99998 318.5C145.833 219.992 551 18.8817 1029 2.5"
      stroke="white"
      strokeOpacity="0.4"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="8 12"
    />
  </svg>
);

// Right to Left SVG Component
const RightToLeftSVG = ({ svgRef }: { svgRef: React.RefObject<SVGSVGElement> }) => (
  <svg
    ref={svgRef}
    className={styles.pathSvg}
    width="1320"
    height="332"
    viewBox="0 0 1320 332"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M163.84 329.5C277.726 225.915 471.533 62.8735 3 28.5"
      stroke="white"
      strokeOpacity="0.8"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="8 12"
    />
    <path
      d="M452.866 319.5C518.84 226.445 543.43 35.7691 114 17.5"
      stroke="white"
      strokeOpacity="0.7"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="8 12"
    />
    <path
      d="M740 318.5C734.167 221.983 614 24.8598 180 8.5"
      stroke="white"
      strokeOpacity="0.6"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="8 12"
    />
    <path
      d="M1032 319.5C930.5 211.027 637.4 -2.94021 277 8.97788"
      stroke="white"
      strokeOpacity="0.5"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="8 12"
    />
    <path
      d="M1317 318.5C1174.17 219.992 769 18.8817 291 2.5"
      stroke="white"
      strokeOpacity="0.4"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="8 12"
    />
  </svg>
);

// Section 1 Component
const Section1 = ({ isActive, isExiting }: { isActive: boolean; isExiting: boolean }) => (
  <div className={`${styles.sectionContent} ${isActive ? styles.sectionActive : ''} ${isExiting ? styles.sectionExiting : ''}`}>
    <div className={styles.sectionTitle}>Innovation Hub</div>
    <div className={styles.sectionDescription}>
      Leading the future with cutting-edge technology and breakthrough solutions
    </div>
    <div className={styles.sectionCards}>
      <div className={styles.sectionCard} style={{ top: '20%', left: '15%' }}>
        <h3>AI Solutions</h3>
        <p>Next-gen artificial intelligence</p>
      </div>
      <div className={styles.sectionCard} style={{ top: '60%', left: '70%' }}>
        <h3>Cloud Tech</h3>
        <p>Scalable cloud infrastructure</p>
      </div>
    </div>
  </div>
);

// Section 2 Component
const Section2 = ({ isActive, isExiting }: { isActive: boolean; isExiting: boolean }) => (
  <div className={`${styles.sectionContent} ${isActive ? styles.sectionActive : ''} ${isExiting ? styles.sectionExiting : ''}`}>
    <div className={styles.sectionTitle}>Design Studio</div>
    <div className={styles.sectionDescription}>
      Creating beautiful and functional experiences that users love
    </div>
    <div className={styles.sectionCards}>
      <div className={styles.sectionCard} style={{ top: '25%', left: '20%' }}>
        <h3>UI/UX</h3>
        <p>Intuitive user interfaces</p>
      </div>
      <div className={styles.sectionCard} style={{ top: '65%', left: '60%' }}>
        <h3>Branding</h3>
        <p>Memorable brand identity</p>
      </div>
    </div>
  </div>
);

// Section 3 Component
const Section3 = ({ isActive, isExiting }: { isActive: boolean; isExiting: boolean }) => (
  <div className={`${styles.sectionContent} ${isActive ? styles.sectionActive : ''} ${isExiting ? styles.sectionExiting : ''}`}>
    <div className={styles.sectionTitle}>Performance Lab</div>
    <div className={styles.sectionDescription}>
      Optimized for speed, efficiency, and unmatched performance
    </div>
    <div className={styles.sectionCards}>
      <div className={styles.sectionCard} style={{ top: '30%', left: '25%' }}>
        <h3>Speed</h3>
        <p>Lightning-fast loading</p>
      </div>
      <div className={styles.sectionCard} style={{ top: '50%', left: '65%' }}>
        <h3>Optimization</h3>
        <p>Resource efficiency</p>
      </div>
    </div>
  </div>
);

// Section 4 Component
const Section4 = ({ isActive, isExiting }: { isActive: boolean; isExiting: boolean }) => (
  <div className={`${styles.sectionContent} ${isActive ? styles.sectionActive : ''} ${isExiting ? styles.sectionExiting : ''}`}>
    <div className={styles.sectionTitle}>Quality Assurance</div>
    <div className={styles.sectionDescription}>
      Excellence in every detail we craft and deliver
    </div>
    <div className={styles.sectionCards}>
      <div className={styles.sectionCard} style={{ top: '20%', left: '30%' }}>
        <h3>Testing</h3>
        <p>Comprehensive QA processes</p>
      </div>
      <div className={styles.sectionCard} style={{ top: '70%', left: '55%' }}>
        <h3>Standards</h3>
        <p>Industry-leading quality</p>
      </div>
    </div>
  </div>
);

// Section 5 Component
const Section5 = ({ isActive, isExiting }: { isActive: boolean; isExiting: boolean }) => (
  <div className={`${styles.sectionContent} ${isActive ? styles.sectionActive : ''} ${isExiting ? styles.sectionExiting : ''}`}>
    <div className={styles.sectionTitle}>Vision Forward</div>
    <div className={styles.sectionDescription}>
      Shaping tomorrow's digital landscape with innovative solutions
    </div>
    <div className={styles.sectionCards}>
      <div className={styles.sectionCard} style={{ top: '35%', left: '20%' }}>
        <h3>Future Tech</h3>
        <p>Tomorrow's technology today</p>
      </div>
      <div className={styles.sectionCard} style={{ top: '55%', left: '70%' }}>
        <h3>Innovation</h3>
        <p>Breakthrough solutions</p>
      </div>
    </div>
  </div>
);

// Section 6 Component
const Section6 = ({ isActive, isExiting }: { isActive: boolean; isExiting: boolean }) => (
  <div className={`${styles.sectionContent} ${isActive ? styles.sectionActive : ''} ${isExiting ? styles.sectionExiting : ''}`}>
    <div className={styles.sectionTitle}>Global Impact</div>
    <div className={styles.sectionDescription}>
      Making a difference through technology and innovation worldwide
    </div>
    <div className={styles.sectionCards}>
      <div className={styles.sectionCard} style={{ top: '25%', left: '35%' }}>
        <h3>Reach</h3>
        <p>Global presence</p>
      </div>
      <div className={styles.sectionCard} style={{ top: '65%', left: '50%' }}>
        <h3>Impact</h3>
        <p>Meaningful change</p>
      </div>
    </div>
  </div>
);

// Section 7 Component
const Section7 = ({ isActive, isExiting }: { isActive: boolean; isExiting: boolean }) => (
  <div className={`${styles.sectionContent} ${isActive ? styles.sectionActive : ''} ${isExiting ? styles.sectionExiting : ''}`}>
    <div className={styles.sectionTitle}>Growth Engine</div>
    <div className={styles.sectionDescription}>
      Scaling solutions for exponential growth and global reach
    </div>
    <div className={styles.sectionCards}>
      <div className={styles.sectionCard} style={{ top: '40%', left: '25%' }}>
        <h3>Scale</h3>
        <p>Unlimited scalability</p>
      </div>
      <div className={styles.sectionCard} style={{ top: '60%', left: '65%' }}>
        <h3>Growth</h3>
        <p>Exponential expansion</p>
      </div>
    </div>
  </div>
);

// Section 8 Component
const Section8 = ({ isActive, isExiting }: { isActive: boolean; isExiting: boolean }) => (
  <div className={`${styles.sectionContent} ${isActive ? styles.sectionActive : ''} ${isExiting ? styles.sectionExiting : ''}`}>
    <div className={styles.sectionTitle}>Future Ready</div>
    <div className={styles.sectionDescription}>
      Building the next generation of products and experiences
    </div>
    <div className={styles.sectionCards}>
      <div className={styles.sectionCard} style={{ top: '30%', left: '40%' }}>
        <h3>Next-Gen</h3>
        <p>Future technologies</p>
      </div>
      <div className={styles.sectionCard} style={{ top: '70%', left: '60%' }}>
        <h3>Evolution</h3>
        <p>Continuous innovation</p>
      </div>
    </div>
  </div>
);

const HorizontalScrollEffect = () => {
  const [currentSection, setCurrentSection] = useState(1);
  const [previousSection, setPreviousSection] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathSvgRef = useRef<SVGSVGElement>(null);
  const lenisRef = useRef<any>(null);

  // Array of section components
  const sections = [Section1, Section2, Section3, Section4, Section5, Section6, Section7, Section8];

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const initLenis = async () => {
      const Lenis = (await import('@studio-freight/lenis')).default;
      lenisRef.current = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
      });

      function raf(time: number) {
        lenisRef.current?.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    };

    initLenis();

    let pathAnimationTl: gsap.core.Timeline | null = null;

    // Function to animate the entire SVG path
    const animateFullPath = () => {
      if (pathSvgRef.current && pathAnimationTl) {
        pathAnimationTl.kill();
      }

      if (pathSvgRef.current) {
        const paths = pathSvgRef.current.querySelectorAll('path');
        pathAnimationTl = gsap.timeline();

        // Store path lengths for later use
        const pathLengths: number[] = [];

        paths.forEach((path, index) => {
          const pathLength = path.getTotalLength();
          pathLengths.push(pathLength);
          
          // Set initial state
          gsap.set(path, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
          });

          // Animate the path drawing
          pathAnimationTl.to(path, {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: "power2.out",
          }, index * 0.2);
        });

        // After drawing, animate out each path individually
        paths.forEach((path, index) => {
          pathAnimationTl.to(path, {
            strokeDashoffset: -pathLengths[index],
            duration: 1,
            ease: "power2.in",
          }, "+=0.5");
        });
      }
    };

    // Create the main scroll trigger for the sticky section
    const scrollTrigger = ScrollTrigger.create({
      trigger: '.sticky',
      start: 'top top',
      end: '+=700%',
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        // Calculate current section based on progress
        const totalSections = 8;
        const newSection = Math.floor(self.progress * totalSections) + 1;
        
        // Update current section and trigger path animation when section changes
        if (newSection !== currentSection && newSection <= totalSections) {
          setIsTransitioning(true);
          setPreviousSection(currentSection);
          
          // Delay section change to allow exit animation
          setTimeout(() => {
            setCurrentSection(newSection);
            animateFullPath();
            
            // Clear transition state after enter animation
            setTimeout(() => {
              setIsTransitioning(false);
            }, 800);
          }, 400);
        }

        // Path stays visible and scales based on progress
        const pathOpacity = Math.max(0, Math.min(1, self.progress * 2));
        const pathScale = 0.7 + (pathOpacity * 0.3);
        if (pathSvgRef.current) {
          gsap.set(pathSvgRef.current, {
            opacity: pathOpacity,
            scale: pathScale,
          });
        }
      }
    });

    return () => {
      scrollTrigger.kill();
      if (pathAnimationTl) {
        pathAnimationTl.kill();
      }
      lenisRef.current?.destroy();
    };
  }, [currentSection]);

  // Get current and previous section components
  const CurrentSectionComponent = sections[currentSection - 1] || Section1;
  const PreviousSectionComponent = sections[previousSection - 1] || Section1;

  return (
    <div className={styles.container}>
      <section className={`${styles.sticky} sticky`}>
        {/* Section Indicator */}
        <div className={styles.sectionIndicator}>
          Section {currentSection} of {sections.length}
        </div>

        {/* Section Transitions Container */}
        <div className={styles.sectionsContainer}>
          {/* Previous Section (for exit animation) */}
          {isTransitioning && (
            <PreviousSectionComponent isActive={false} isExiting={true} />
          )}
          
          {/* Current Section */}
          <CurrentSectionComponent isActive={!isTransitioning} isExiting={false} />
        </div>

        {/* Particles */}
        <div className={styles.particlesContainer}>
          {Array.from({ length: 25 }, (_, index) => (
            <div key={index} className={styles.particle}></div>
          ))}
        </div>
      </section>

      <div className={styles.pathContainer}>
        {/* Alternate between left-to-right and right-to-left based on section */}
        {currentSection % 2 === 1 ? (
          <RightToLeftSVG svgRef={pathSvgRef} />
        ) : (
          <LeftToRightSVG svgRef={pathSvgRef} />
        )}
      </div>
    </div>
  );
};

export default HorizontalScrollEffect;