import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import axios from 'axios';

const Gallery = () => {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${apiUrl}/gallery`);
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      // Use placeholder images if API fails
      setImages([
        { id: 1, image_url: 'https://images.unsplash.com/photo-1606997724049-c0c1b0be2a8a?w=600', title: 'Crochet Flowers' },
        { id: 2, image_url: 'https://images.unsplash.com/photo-1595341595313-12e3e1a5f9b8?w=600', title: 'Crochet Bag' },
        { id: 3, image_url: 'https://images.unsplash.com/photo-1591020615994-02e2e05c9e06?w=600', title: 'Keychains' },
        { id: 4, image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600', title: 'Custom Work' },
        { id: 5, image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600', title: 'Colorful Pieces' },
        { id: 6, image_url: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600', title: 'Hand Crafted' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-display font-bold text-primary mb-4">
            {t('home.galleryTitle')}
          </h1>
          <p className="text-xl text-text/70 max-w-2xl mx-auto">
            Explore our collection of handmade crochet creations
          </p>
          <div className="w-20 h-1 bg-highlight mx-auto rounded-full mt-6"></div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="break-inside-avoid"
              >
                <div className="card overflow-hidden group cursor-pointer">
                  <div className="relative overflow-hidden">
                    <img
                      src={image.image_url}
                      alt={image.title || 'Gallery image'}
                      className="w-full h-auto group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    {image.title && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <h3 className="text-white font-semibold">{image.title}</h3>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
