import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const SlideGallery = ({ images, title, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen || !images || images.length === 0) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors duration-200"
          >
            <X size={32} />
          </button>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200 z-10"
              >
                <ChevronLeft size={48} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200 z-10"
              >
                <ChevronRight size={48} />
              </button>
            </>
          )}

          {/* Main image */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={`${images[currentIndex].asset.url}?auto=format&fit=max&w=1920&h=1080&q=90`}
              alt={images[currentIndex].alt || `${title} - Gallery Image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {/* Image caption */}
            {images[currentIndex].caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
                <p className="text-center">{images[currentIndex].caption}</p>
              </div>
            )}
          </div>

          {/* Thumbnail navigation */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentIndex
                      ? 'border-white scale-110'
                      : 'border-gray-500 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={`${image.asset.url}?auto=format&fit=crop&w=100&h=100&q=80`}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Image counter */}
          <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
            {currentIndex + 1} / {images.length}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SlideGallery;
