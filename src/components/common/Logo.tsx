import { Link } from 'react-router-dom';
import { brand } from '../../config/ui.config';
import { logger } from '../../utils/debug';
import { useEffect, useState } from 'react';

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
  const [error, setError] = useState(false);

  useEffect(() => {
    // Preload the logo image
    const img = new Image();
    img.src = brand.logo[variant];
    
    img.onload = () => {
      logger.debug('Logo loaded successfully', {
        component: 'Logo',
        data: { variant, src: img.src }
      });
    };

    img.onerror = () => {
      logger.error('Failed to load logo', {
        component: 'Logo',
        data: { variant, src: img.src }
      });
      setError(true);
    };
  }, [variant]);

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
        onError={() => setError(true)}
      />
    </Link>
  );
} 
