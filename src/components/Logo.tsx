import { Link } from 'react-router-dom';
import { brand } from '../config/brand';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: keyof typeof brand.logo;
}

export function Logo({ 
  className = '', 
  width = 150, 
  height = 50,
  variant = 'default'
}: LogoProps) {
  return (
    <Link to="/" className={`block ${className}`}>
      <img
        src={brand.logo[variant]}
        alt={`${brand.name} Logo`}
        width={width}
        height={height}
        className="object-contain"
      />
    </Link>
  );
} 
