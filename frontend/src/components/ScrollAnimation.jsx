import React, { useEffect, useRef, useState } from 'react';

const ScrollAnimation = ({ 
  children, 
  animation = 'fadeInUp', 
  delay = 0,
  duration = 0.8,
  threshold = 0.1 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold]);

  const animationClasses = {
    fadeInUp: 'animate-fade-in-up-scroll',
    fadeIn: 'animate-fade-in-scroll',
    slideInLeft: 'animate-slide-in-left-scroll',
    slideInRight: 'animate-slide-in-right-scroll',
    scaleIn: 'animate-scale-in-scroll',
    zoomIn: 'animate-zoom-in-scroll',
  };

  return (
    <div
      ref={elementRef}
      className={isVisible ? animationClasses[animation] || animationClasses.fadeInUp : 'opacity-0'}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}s`,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollAnimation;

