const galleryImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1974&auto=format&fit=crop",
    title: "Modern Fade"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=2070&auto=format&fit=crop",
    title: "Classic Fade"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1988&auto=format&fit=crop",
    title: "Textured Crop"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop",
    title: "Beard Style"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1593702295094-ac9a661c3d7d?q=80&w=1974&auto=format&fit=crop",
    title: "Clean Cut"
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1520338801623-6b88fe32bbf2?q=80&w=2070&auto=format&fit=crop",
    title: "Slick Back"
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1519019121902-f0a7c22c4eb7?q=80&w=2069&auto=format&fit=crop",
    title: "Pompadour"
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?q=80&w=2067&auto=format&fit=crop",
    title: "Messy Texture"
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1523532888648-58ecda8416ca?q=80&w=2069&auto=format&fit=crop",
    title: "Classic Side Part"
  }
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-base-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-primary">Style Gallery</h1>
        <p className="text-center text-neutral mb-8">Get inspired by our collection of trending hairstyles</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map(image => (
            <div 
              key={image.id} 
              className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              <figure className="relative aspect-square">
                <img 
                  src={image.url} 
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h2 className="text-lg font-semibold text-white">{image.title}</h2>
                </div>
              </figure>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 