import React, { useEffect, useRef, useState } from 'react';

const SmoothParallax = ({ children, speed = 0.5, className = '' }) => {
  const [offsetY, setOffsetY] = useState(0);
  const elementRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (elementRef.current) {
            const rect = elementRef.current.getBoundingClientRect();
            const scrollY = window.scrollY;
            const elementTop = rect.top + scrollY;
            const windowHeight = window.innerHeight;
            
            // Calculate parallax offset
            const scrolled = scrollY - elementTop + windowHeight;
            setOffsetY(scrolled * speed);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        transform: `translateY(${offsetY}px)`,
        willChange: 'transform',
        backfaceVisibility: 'hidden',
      }}
    >
      {children}
    </div>
  );
};

export default SmoothParallax;
