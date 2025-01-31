import { useState, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import type { GalleryItem } from '../../types';

interface GalleryProps {
  images: GalleryItem[];
  loading?: boolean;
}

interface ImageModalProps {
  image: GalleryItem;
  onClose: () => void;
}

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

interface GalleryItemProps {
  image: GalleryItem;
  onClick: () => void;
}

const ImageModal = ({ image, onClose }: ImageModalProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
      onClick={handleClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative max-w-4xl w-full">
        <img
          src={image.image.url}
          alt={image.translations.en.title}
          className="w-full h-auto rounded-lg"
          id="modal-title"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 rounded-b-lg">
          <h3 className="text-white font-semibold">{image.translations.en.title}</h3>
          <p className="text-white text-sm">{image.translations.en.description}</p>
        </div>
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-opacity"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  const { theme } = useTheme();
  
  return (
    <div className="flex flex-wrap gap-4 mb-8" role="tablist">
      <button
        key="all"
        onClick={() => onSelectCategory('')}
        className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
        style={{ 
          backgroundColor: selectedCategory === '' ? theme.colors.accent.primary : theme.colors.background.card,
          color: selectedCategory === '' ? theme.colors.background.primary : theme.colors.text.primary
        }}
        role="tab"
        aria-selected={selectedCategory === ''}
        aria-controls="gallery-grid"
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
          style={{ 
            backgroundColor: selectedCategory === category ? theme.colors.accent.primary : theme.colors.background.card,
            color: selectedCategory === category ? theme.colors.background.primary : theme.colors.text.primary
          }}
          role="tab"
          aria-selected={selectedCategory === category}
          aria-controls="gallery-grid"
        >
          {category}
        </button>
      ))}
    </div>
  );
};

const GalleryItem = ({ image, onClick }: GalleryItemProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
      onClick={onClick}
      onKeyPress={handleKeyPress}
      role="button"
      tabIndex={0}
      aria-label={`View ${image.translations.en.title}`}
    >
      <img
        src={image.image.url}
        alt={image.translations.en.title}
        className="w-full h-full object-cover transition-transform group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-end">
        <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <h3 className="font-semibold">{image.translations.en.title}</h3>
          <p className="text-sm">{image.translations.en.description}</p>
        </div>
      </div>
    </div>
  );
};

export default function Gallery({ images, loading = false }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { theme } = useTheme();

  const categories = Array.from(new Set(images.map(img => img.category)));
  const filteredImages = selectedCategory 
    ? images.filter(img => img.category === selectedCategory)
    : images;

  const handleImageClick = useCallback((image: GalleryItem) => {
    setSelectedImage(image);
  }, []);

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div 
              className="loading loading-spinner loading-lg"
              style={{ color: theme.colors.accent.primary }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 
          className="text-2xl font-bold mb-8" 
          style={{ color: theme.colors.text.primary }}
        >
          Our Gallery
        </h2>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div 
          id="gallery-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          role="tabpanel"
        >
          {filteredImages.map((image) => (
            <GalleryItem
              key={image.id}
              image={image}
              onClick={() => handleImageClick(image)}
            />
          ))}
        </div>

        {selectedImage && (
          <ImageModal
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </div>
    </div>
  );
} 