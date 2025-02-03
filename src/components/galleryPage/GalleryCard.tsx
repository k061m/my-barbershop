import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import type { GalleryItem } from '../../types';

// Define the props interface for the GalleryCard component
interface GalleryCardProps {
  image: GalleryItem;
  onClick: () => void;
}

export default function GalleryCard({ image, onClick }: GalleryCardProps) {
  // Access theme and language contexts
  const { theme } = useTheme();
  const { currentLanguage } = useLanguage();
  // State to track image loading errors
  const [imageError, setImageError] = useState(false);

  // Handler for image loading errors
  const handleImageError = () => {
    console.error(`Failed to load image: ${image.url}`);
    setImageError(true);
  };

  return (
    <div
      onClick={onClick}
      className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
      style={{ backgroundColor: theme.colors.background.card }}
    >
      {/* Image container */}
      <div className="aspect-square">
        {imageError ? (
          // Display fallback content if image fails to load
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">Image not available</span>
          </div>
        ) : (
          // Display the image
          <img
            src={image.url}
            alt={image.altText}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        )}
      </div>

      {/* Overlay with image details (visible on hover) */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex flex-col justify-end"
      >
        <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-xl font-bold mb-2">{image.title[currentLanguage]}</h3>
          <p className="text-sm line-clamp-2">{image.description[currentLanguage]}</p>
          
          {/* Related Services tags */}
          {image.relatedServices && image.relatedServices.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {image.relatedServices.map((service, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded-full text-xs bg-white bg-opacity-20"
                >
                  {service.split('/').pop()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Featured Badge (conditional rendering) */}
      {image.isFeatured && (
        <div 
          className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold"
          style={{ 
            backgroundColor: theme.colors.accent.primary,
            color: theme.colors.background.primary
          }}
        >
          Featured
        </div>
      )}

      {/* Category Badge */}
      <div 
        className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium capitalize"
        style={{ 
          backgroundColor: theme.colors.background.primary,
          color: theme.colors.text.primary
        }}
      >
        {image.category}
      </div>
    </div>
  );
}
