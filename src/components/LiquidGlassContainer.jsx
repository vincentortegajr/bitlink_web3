import React, { useId } from 'react';
import clsx from 'clsx';

/**
 * A React component that creates a container with a "liquid glass" visual effect.
 *
 * This component uses an SVG filter to apply a blur and color matrix effect, creating
 * a unique "liquid glass" appearance. It is useful for visually enhancing UI elements.
 *
 * @param {Object} props - The props for the component.
 * @param {React.ReactNode} props.children - The content to be rendered inside the container.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the container.
 * @param {number} [props.cornerRadius=24] - The border radius of the container, in pixels.
 * @param {Object} [props.props] - Additional props to spread onto the container's root element.
 * @returns {JSX.Element} The rendered LiquidGlassContainer component.
 */
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
