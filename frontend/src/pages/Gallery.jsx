import React, { useState, useEffect } from 'react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBatch, setSelectedBatch] = useState(null); // Changed from selectedImage to selectedBatch
  const [batchImages, setBatchImages] = useState([]); // All images in the selected batch
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadingBatch, setLoadingBatch] = useState(false);

  useEffect(() => {
    fetchGallery();
    fetchCategories();
  }, [selectedCategory]);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const params = { 
        group_by_batch: 'true',
        limit: 1000
      };
      if (selectedCategory) {
        params.category = selectedCategory;
      }
      const res = await api.get('/gallery', { params });
      setGallery(res.data.data || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setGallery([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories?type=gallery');
      setCategories(res.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleImageClick = async (item) => {
    if (item.batch_id && item.batch_count > 1) {
      // If it's part of a batch, fetch all images in the batch
      setLoadingBatch(true);
      try {
        const res = await api.get(`/gallery/batch/${item.batch_id}`);
        setBatchImages(res.data.data || []);
        setCurrentImageIndex(0);
        setSelectedBatch({
          ...item,
          batchImages: res.data.data || []
        });
      } catch (error) {
        console.error('Error fetching batch images:', error);
        // Fallback to single image
        setBatchImages([item]);
        setSelectedBatch({ ...item, batchImages: [item] });
      } finally {
        setLoadingBatch(false);
      }
    } else {
      // Single image
      setBatchImages([item]);
      setSelectedBatch({ ...item, batchImages: [item] });
      setCurrentImageIndex(0);
    }
  };

  const handleNextImage = () => {
    if (batchImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % batchImages.length);
    }
  };

  const handlePrevImage = () => {
    if (batchImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + batchImages.length) % batchImages.length);
    }
  };

  const handleCloseModal = () => {
    setSelectedBatch(null);
    setBatchImages([]);
    setCurrentImageIndex(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedBatch) return;
      if (e.key === 'ArrowRight') handleNextImage();
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'Escape') handleCloseModal();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedBatch, batchImages]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a1628' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800 mx-auto mb-4"></div>
          <p className="text-gray-300">Memuat galeri...</p>
        </div>
      </div>
    );
  }

  const currentImage = batchImages[currentImageIndex];

  return (
    <div className="py-16 min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0a1628' }}>
      <div className="container mx-auto px-4 relative">
        {/* Header - Enhanced */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 bg-clip-text text-transparent animate-gradient">
            Galeri
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-gold via-gold-dark to-gold rounded-full mx-auto mb-6"></div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto backdrop-blur-sm bg-gray-800/30 px-6 py-3 rounded-2xl border border-gray-700/30 shadow-lg">
            Dokumentasi kegiatan dan momen spesial BEM FSRD ISI Yogyakarta
          </p>
        </div>

        {/* Category Filters - Enhanced */}
        <div className="mb-12 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm ${
              !selectedCategory
                ? 'bg-gradient-to-r from-primary-800 to-primary-700 text-white shadow-xl transform scale-105 border-2 border-primary-600'
                : 'bg-gray-800/80 text-gray-200 hover:bg-gray-700/50 border-2 border-gray-700 hover:border-primary-300 hover:shadow-lg hover:scale-105'
            }`}
          >
            Semua
          </button>
          {categories.map((cat, index) => {
            const colors = [
              'from-purple-500 to-purple-600',
              'from-pink-500 to-pink-600',
              'from-teal-500 to-teal-600',
              'from-orange-500 to-orange-600',
              'from-indigo-500 to-indigo-600',
              'from-blue-500 to-blue-600',
            ];
            const colorClass = colors[index % colors.length];
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm ${
                  selectedCategory === cat.slug
                    ? `bg-gradient-to-r ${colorClass} text-white shadow-xl transform scale-105 border-2 border-transparent`
                    : 'bg-gray-800/80 text-gray-200 hover:bg-gray-700/50 border-2 border-gray-700 hover:border-gray-300 hover:shadow-lg hover:scale-105'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid - Enhanced */}
        {gallery.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-block p-8 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-lg">
              <p className="text-gray-500 text-lg font-semibold">Belum ada gambar di galeri</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gallery.map((item, index) => {
              const borderColors = [
                'border-blue-300',
                'border-purple-300',
                'border-pink-300',
                'border-teal-300',
                'border-orange-300',
                'border-indigo-300',
              ];
              const borderColor = borderColors[index % borderColors.length];
              const isBatch = item.batch_id && item.batch_count > 1;
              
              return (
                <div
                  key={item.id}
                  className="relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden cursor-pointer group hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-gold/50 transform hover:-translate-y-2 hover:scale-[1.02]"
                  onClick={() => handleImageClick(item)}
                >
                  {/* Batch Badge - Enhanced */}
                  {isBatch && (
                    <div className="absolute top-3 right-3 z-10 backdrop-blur-md bg-gold/90 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl border border-gold/50">
                      +{item.batch_count} Foto
                    </div>
                  )}
                  
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={getImageUrl(item.image_path)}
                      alt={item.title || item.alt_text}
                      className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    {/* Title overlay on hover */}
                    {item.title && (
                      <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <div className="backdrop-blur-md bg-black/50 rounded-xl p-3 w-full border border-white/10">
                          <h3 className="font-bold text-sm text-white line-clamp-2">{item.title}</h3>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Batch/Image Modal */}
      {selectedBatch && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="max-w-6xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {loadingBatch ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : currentImage && (
              <>
                {/* Image Container */}
                <div className="relative mb-4">
                  {/* Close Button */}
                  <button
                    onClick={handleCloseModal}
                    className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                  >
                    <FiX size={24} />
                  </button>

                  {/* Navigation Arrows - Only show if multiple images */}
                  {batchImages.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
                      >
                        <FiChevronLeft size={24} />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
                      >
                        <FiChevronRight size={24} />
                      </button>
                    </>
                  )}

                  {/* Main Image */}
                  <img
                    src={getImageUrl(currentImage.image_path)}
                    alt={currentImage.title || currentImage.alt_text}
                    className="w-full h-auto rounded-lg shadow-2xl"
                  />

                  {/* Image Counter - Only show if multiple images */}
                  {batchImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium">
                      {currentImageIndex + 1} / {batchImages.length}
                    </div>
                  )}
                </div>

                {/* Image Info */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
                  {currentImage.title && (
                    <h3 className="text-2xl font-bold mb-2">{currentImage.title}</h3>
                  )}
                  {currentImage.description && (
                    <p className="text-gray-200 leading-relaxed mb-4">{currentImage.description}</p>
                  )}
                  {currentImage.category_name && (
                    <span className="inline-block bg-primary-600/50 px-3 py-1 rounded-full text-sm">
                      {currentImage.category_name}
                    </span>
                  )}
                </div>

                {/* Thumbnail Navigation - Only show if multiple images */}
                {batchImages.length > 1 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                    {batchImages.map((img, idx) => (
                      <button
                        key={img.id}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === currentImageIndex
                            ? 'border-primary-400 ring-2 ring-primary-400 scale-110'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={getImageUrl(img.image_path)}
                          alt={img.title || img.alt_text}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
