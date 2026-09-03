import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isEmergencyHover, setIsEmergencyHover] = useState(false);

  useEffect(() => {
    // Detect mobile / touch screen
    const checkTouch = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth < 1024
      );
    };

    if (checkTouch()) {
      setIsTouchDevice(true);
      return;
    }

    document.body.classList.add('custom-cursor-active');

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Immediate center dot
      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.08,
        ease: 'power2.out',
      });

      // Smooth delayed outer ring
      gsap.to(ring, {
        x: mouseX,
        y: mouseY,
        duration: 0.22,
        ease: 'power2.out',
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isEmergency = Boolean(
        target.closest('.emergency-cta') ||
        target.closest('[data-emergency="true"]') ||
        target.textContent?.includes('REQUEST HELP') ||
        target.textContent?.includes('SUBMIT EMERGENCY')
      );
      setIsEmergencyHover(isEmergency);

      const isInteractive = Boolean(
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('.interactive-card')
      );

      if (isEmergency) {
        gsap.to(ring, {
          scale: 1.8,
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          duration: 0.25,
        });
        gsap.to(dot, {
          backgroundColor: '#EF4444',
          scale: 1.4,
          duration: 0.2,
        });
      } else if (isInteractive) {
        gsap.to(ring, {
          scale: 1.4,
          borderColor: '#38BDF8',
          backgroundColor: 'rgba(56, 189, 248, 0.12)',
          duration: 0.2,
        });
        gsap.to(dot, {
          backgroundColor: '#38BDF8',
          scale: 0.8,
          duration: 0.2,
        });
      } else {
        gsap.to(ring, {
          scale: 1,
          borderColor: 'rgba(255, 255, 255, 0.4)',
          backgroundColor: 'transparent',
          duration: 0.2,
        });
        gsap.to(dot, {
          backgroundColor: '#FFFFFF',
          scale: 1,
          duration: 0.2,
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Center dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-2.5 h-2.5 rounded-full -translate-x-1/2 -translate-y-1/2 transition-colors duration-150 shadow-sm ${
          isEmergencyHover ? 'bg-emergency-500 shadow-emergency-glow' : 'bg-white shadow-tech-glow'
        }`}
      />
      {/* Delayed outer ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 w-8 h-8 rounded-full border -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
          isEmergencyHover
            ? 'border-emergency-500 bg-emergency-500/10 beacon-pulse'
            : 'border-white/40 bg-transparent'
        }`}
      />
    </div>
  );
};
