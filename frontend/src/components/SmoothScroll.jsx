import React, { useEffect } from 'react';

const SmoothScroll = ({ children }) => {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Enhanced smooth scroll with custom easing
    const handleSmoothScroll = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        const href = target.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            const startPosition = window.pageYOffset;
            const targetPosition = targetElement.offsetTop - 80; // Offset for header
            const distance = targetPosition - startPosition;
            const duration = 800;
            let start = null;

            const easeInOutCubic = (t) => {
              return t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
            };

            const animation = (currentTime) => {
              if (start === null) start = currentTime;
              const timeElapsed = currentTime - start;
              const progress = Math.min(timeElapsed / duration, 1);
              
              window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));

              if (timeElapsed < duration) {
                requestAnimationFrame(animation);
              }
            };

            requestAnimationFrame(animation);
          }
        }
      }
    };

    document.addEventListener('click', handleSmoothScroll);

    return () => {
      document.removeEventListener('click', handleSmoothScroll);
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;

