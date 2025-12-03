import React from 'react';

interface GallerySectionProps {
  images: string[] | undefined;
}

const GallerySection: React.FC<GallerySectionProps> = ({ images }) => {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Gallery</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group overflow-hidden rounded-lg shadow-md">
            <img
              src={image}
              alt={`User Image ${index + 1}`}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-80 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                View
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GallerySection;
