import React, { useEffect, useRef, useState } from 'react';

const StaggerAnimation = ({ 
  children, 
  staggerDelay = 100,
  animation = 'fadeInUp',
  className = ''
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
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  const childrenArray = React.Children.toArray(children);

  return (
    <div ref={elementRef} className={className}>
      {childrenArray.map((child, index) => (
        <div
          key={index}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible 
              ? 'translateY(0)' 
              : animation === 'fadeInUp' 
                ? 'translateY(30px)' 
                : animation === 'fadeInLeft'
                  ? 'translateX(-30px)'
                  : animation === 'fadeInRight'
                    ? 'translateX(30px)'
                    : 'scale(0.9)',
            transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
            transitionDelay: isVisible ? `${index * staggerDelay}ms` : '0ms',
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default StaggerAnimation;

