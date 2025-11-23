import React, { useState } from 'react';

const HoverScale = ({ 
  children, 
  scale = 1.05, 
  duration = 0.3,
  className = '',
  onHover = null
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={className}
      onMouseEnter={() => {
        setIsHovered(true);
        if (onHover) onHover(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (onHover) onHover(false);
      }}
      style={{
        transform: isHovered ? `scale(${scale})` : 'scale(1)',
        transition: `transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1)`,
        cursor: 'pointer',
      }}
    >
      {children}
    </div>
  );
};

export default HoverScale;

