import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { galleryService } from '../services/gallery.service';
import type { GalleryItem, GalleryCategory } from '../types';
import GalleryCard from '../components/gallery/GalleryCard';

const categories: ('All' | GalleryCategory)[] = ['All', 'haircuts', 'beards', 'styling', 'grooming'];

export default function GalleryPage() {
  const { theme } = useTheme();
  const { currentLanguage } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<'All' | GalleryCategory>('All');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    try {
      setLoading(true);
      const galleryImages = await galleryService.getImages();
      
      // Transform image URLs to use the correct public path
      const transformedImages = galleryImages.map(image => ({
        ...image,
        url: image.url.startsWith('http') ? image.url : image.url.startsWith('/') ? image.url : `/${image.url}`
      }));
      
      setImages(transformedImages);
      setError(null);
    } catch (err) {
      console.error('Error loading gallery images:', err);
      setError('Failed to load gallery images. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = selectedCategory === 'All'
    ? images
    : images.filter(img => img.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.background.primary }}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderColor: theme.colors.accent.primary }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.background.primary }}>
        <div className="text-center p-8 rounded-lg" style={{ backgroundColor: theme.colors.background.card }}>
          <div className="text-xl mb-4" style={{ color: theme.colors.status.error }}>{error}</div>
          <button
            onClick={() => loadGalleryImages()}
            className="px-6 py-2 rounded-lg font-medium transition-colors hover:opacity-90"
            style={{ 
              backgroundColor: theme.colors.accent.primary,
              color: theme.colors.background.primary
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: theme.colors.background.primary }}>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: theme.colors.text.primary }}>
          Style Gallery
        </h1>
        
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center mb-8 gap-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category ? 'font-bold' : ''
              }`}
              style={{ 
                backgroundColor: selectedCategory === category ? theme.colors.accent.primary : theme.colors.background.card,
                color: selectedCategory === category ? theme.colors.background.primary : theme.colors.text.primary
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <GalleryCard
              key={image.id}
              image={image}
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>

        {/* No Results Message */}
        {filteredImages.length === 0 && (
          <div className="text-center py-8">
            <p style={{ color: theme.colors.text.secondary }}>
              No images found for category: {selectedCategory}
            </p>
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
            onClick={() => setSelectedImage(null)}
          >
            <div 
              className="max-w-4xl w-full rounded-lg overflow-hidden"
              onClick={e => e.stopPropagation()}
              style={{ backgroundColor: theme.colors.background.card }}
            >
              {/* Modal Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image */}
                <div className="aspect-square">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.altText}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: theme.colors.text.primary }}>
                      {selectedImage.title[currentLanguage]}
                    </h3>
                    <p style={{ color: theme.colors.text.secondary }}>
                      {selectedImage.description[currentLanguage]}
                    </p>
                  </div>

                  {/* Category */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2" style={{ color: theme.colors.text.primary }}>
                      Category
                    </h4>
                    <span
                      className="px-3 py-1 rounded-full text-sm"
                      style={{ 
                        backgroundColor: theme.colors.background.secondary,
                        color: theme.colors.text.secondary
                      }}
                    >
                      {selectedImage.category}
                    </span>
                  </div>

                  {/* Related Services */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2" style={{ color: theme.colors.text.primary }}>
                      Related Services
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedImage.relatedServices.map((service, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-sm"
                          style={{ 
                            backgroundColor: theme.colors.background.secondary,
                            color: theme.colors.text.secondary
                          }}
                        >
                          {service.split('/').pop()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Book Now Button */}
                  <button
                    className="w-full py-3 rounded-lg font-medium transition-colors hover:opacity-90"
                    style={{ 
                      backgroundColor: theme.colors.accent.primary,
                      color: theme.colors.background.primary
                    }}
                  >
                    Book This Style
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 