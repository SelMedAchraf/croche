import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import axios from 'axios';

const Testimonials = () => {
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${apiUrl}/testimonials`);
      setTestimonials(response.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      // Placeholder testimonials
      setTestimonials([
        {
          id: 1,
          customer_name: 'Sarah Johnson',
          message: 'Absolutely beautiful work! The crochet flower bouquet I ordered was perfect for my wedding. Every detail was exactly as I imagined.',
          rating: 5
        },
        {
          id: 2,
          customer_name: 'Maria Garcia',
          message: 'I ordered a custom bag and I could not be happier! The quality is outstanding and the colors are exactly what I wanted. Highly recommend!',
          rating: 5
        },
        {
          id: 3,
          customer_name: 'Emma Wilson',
          message: 'The keychains make perfect gifts! I have ordered several for friends and family. Always beautifully packaged and delivered on time.',
          rating: 5
        },
        {
          id: 4,
          customer_name: 'Sophie Martin',
          message: 'Love my crochet items! They are so well made and the artist is very responsive to custom requests. Will definitely order again!',
          rating: 5
        },
        {
          id: 5,
          customer_name: 'Lisa Anderson',
          message: 'The attention to detail is incredible. Each piece feels like a work of art. Thank you for creating such beautiful handmade treasures!',
          rating: 5
        },
        {
          id: 6,
          customer_name: 'Anna Brown',
          message: 'Fast shipping and excellent quality! The crochet flowers look so realistic and beautiful. They brighten up my home every day.',
          rating: 5
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen section-padding">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-display font-bold text-primary mb-4">
            {t('home.testimonialsTitle')}
          </h1>
          <p className="text-xl text-text/70 max-w-2xl mx-auto">
            See what our happy customers say about their handmade crochet items
          </p>
          <div className="w-20 h-1 bg-highlight mx-auto rounded-full mt-6"></div>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-20 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-2xl ${
                        i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                
                <p className="text-text/70 mb-6 italic leading-relaxed">
                  "{testimonial.message}"
                </p>
                
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-highlight rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {testimonial.customer_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-primary">
                      {testimonial.customer_name}
                    </p>
                    <p className="text-sm text-text/60">Verified Customer</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center card p-12 bg-gradient-to-br from-primary/10 to-highlight/10"
        >
          <h2 className="text-3xl font-display font-bold text-primary mb-4">
            Want to Share Your Experience?
          </h2>
          <p className="text-text/70 mb-6 max-w-2xl mx-auto">
            We'd love to hear from you! Your feedback helps us improve and inspires others to 
            discover the beauty of handmade crochet.
          </p>
          <a
            href="mailto:contact@crocheella.com"
            className="btn-primary inline-block"
          >
            Send Us Your Review
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Testimonials;
