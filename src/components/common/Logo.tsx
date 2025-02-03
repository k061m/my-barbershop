import { Link } from 'react-router-dom';
import { brand } from '../../config/ui.config';
import { logger } from '../../utils/debug';
import { useEffect, useState } from 'react';

// Define the props interface for the Logo component
interface LogoProps {
  className?: string;
  width?: number | 'auto' | 'full';
  height?: number | 'auto' | 'full';
  variant?: keyof typeof brand.logo;
  padding?: number | string;
  containerClassName?: string;
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

export function Logo({ 
  className = '', 
  width = 'auto', 
  height = 'auto',
  variant = 'default',
  padding,
  containerClassName = '',
  fit = 'contain'
}: LogoProps) {
  // State to track if there's an error loading the logo
  const [error, setError] = useState(false);

  useEffect(() => {
    // Preload the logo image to handle loading errors
    const img = new Image();
    img.src = brand.logo[variant];
    
    img.onload = () => {
      // Log successful logo load
      logger.debug('Logo loaded successfully', {
        component: 'Logo',
        data: { variant, src: img.src }
      });
    };

    img.onerror = () => {
      // Log error and update state if logo fails to load
      logger.error('Failed to load logo', {
        component: 'Logo',
        data: { variant, src: img.src }
      });
      setError(true);
    };
  }, [variant]); // Re-run effect if variant changes

  // Define container styles based on props
  const containerStyle = {
    padding: padding,
    width: width === 'full' ? '100%' : typeof width === 'number' ? `${width}px` : width,
    height: height === 'full' ? '100%' : typeof height === 'number' ? `${height}px` : height,
  };

  // Fallback content if logo fails to load
  if (error) {
    logger.warn('Using fallback text for logo', { component: 'Logo' });
    return (
      <Link 
        to="/" 
        className={`inline-flex items-center justify-center ${containerClassName}`}
        style={containerStyle}
      >
        <span className="text-xl font-bold">{brand.name}</span>
      </Link>
    );
  }

  // Render the logo image
  return (
    <Link 
      to="/" 
      className={`inline-flex items-center justify-center ${containerClassName}`}
      style={containerStyle}
    >
      <img
        src={brand.logo[variant]}
        alt={`${brand.name} Logo`}
        className={`object-${fit} w-full h-full ${className}`}
        onError={() => setError(true)} // Set error state if image fails to load
      />
    </Link>
  );
}
