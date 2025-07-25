import React, { useId } from 'react';
import clsx from 'clsx';

const LiquidGlassContainer = ({ children, className = '', cornerRadius = 24, ...props }) => {
  const id = useId();
  return (
    <div
      className={clsx('relative overflow-hidden', className)}
      style={{ borderRadius: cornerRadius }}
      {...props}
    >
      <svg className="absolute inset-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <filter id={`liquid-glass-${id}`}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </svg>
      <div style={{ filter: `url(#liquid-glass-${id})`, WebkitFilter: `url(#liquid-glass-${id})` }}>
        {children}
      </div>
    </div>
  );
};

export default LiquidGlassContainer;
