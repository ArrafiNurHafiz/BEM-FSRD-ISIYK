import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div
      style={{
        opacity: isTransitioning ? 0 : 1,
        transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
        transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;

