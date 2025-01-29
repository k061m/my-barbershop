import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { galleryService } from '../services/gallery.service';
import { GalleryImage, Language } from '../data/types';

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();
  const currentLang = i18n.language as Language;

  useEffect(() => {
    const fetchGallery = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('Fetching gallery data...');
        const galleryData = await galleryService.getImages();
        console.log('Fetched images:', galleryData.length);
        
        // Extract unique categories
        const uniqueCategories = ['all', ...new Set(galleryData.map(item => item.category))];
        console.log('Categories:', uniqueCategories);
        
        setCategories(uniqueCategories);
        setGalleryItems(galleryData);
      } catch (error) {
        console.error('Error fetching gallery:', error);
        setError('Failed to load gallery items. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Debug Info */}
      {import.meta.env.DEV && (
        <div className="mb-4 p-4 bg-base-200 rounded-lg">
          <p>Total Items: {galleryItems.length}</p>
          <p>Selected Category: {selectedCategory}</p>
          <p>Available Categories: {categories.join(', ')}</p>
          <p>Current Language: {currentLang}</p>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex justify-center mb-8 gap-2 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`btn ${
              selectedCategory === category
                ? 'btn-primary'
                : 'btn-outline'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
          >
            <figure className="relative aspect-square">
              <img
                src={item.url}
                alt={item.translations[currentLang]?.title || ''}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder.jpg';
                }}
              />
              <div className="absolute top-2 right-2">
                <div className="badge badge-primary">
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </div>
              </div>
            </figure>
            <div className="card-body">
              <h3 className="card-title">{item.translations[currentLang]?.title || ''}</h3>
              <p className="text-base-content/80">{item.translations[currentLang]?.description || ''}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No items found</h3>
          <p className="text-base-content/70">Try selecting a different category</p>
        </div>
      )}
    </div>
  );
} 