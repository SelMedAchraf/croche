import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiZoomIn, FiX } from 'react-icons/fi';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${apiUrl}/products/${id}`);
      setProduct(response.data);
      
      if (response.data.colors && response.data.colors.length > 0) {
        setSelectedColor(response.data.colors[0]);
      }

      // Fetch related products
      const relatedRes = await axios.get(`${apiUrl}/products?category=${response.data.category}`);
      setRelatedProducts(relatedRes.data.filter(p => p.id !== id).slice(0, 4));
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
    // Show success notification (you can add a toast notification here)
    alert('Added to cart!');
  };

  if (loading) {
    return (
      <div className="min-h-screen section-padding flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary mx-auto mb-4"></div>
          <p className="text-text/60">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen section-padding flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-primary mb-4">Product not found</h2>
          <Link to="/products" className="btn-primary">
            {t('common.backHome')}
          </Link>
        </div>
      </div>
    );
  }

  const images = product.product_images?.length > 0
    ? product.product_images.map(img => img.image_url)
    : ['https://images.unsplash.com/photo-1595341595313-12e3e1a5f9b8?w=800'];

  const isOutOfStock = product.stock_quantity === 0;

  return (
    <div className="min-h-screen section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-text/60">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-primary">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-text">{product.category}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl mb-4 group">
                <img
                  src={images[selectedImage]}
                  alt="Product"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setIsZoomed(true)}
                  className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiZoomIn className="w-5 h-5 text-primary" />
                </button>
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-display font-bold text-primary mb-4">
              {product.category}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-primary">
                ${product.price}
              </span>
              <span className="px-3 py-1 bg-accent text-text rounded-full text-sm">
                {product.category}
              </span>
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">\n                <h3 className="font-semibold mb-3">{t('productDetails.colors')}</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-full border-4 transition-all ${
                        selectedColor === color ? 'border-primary scale-110' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">{t('productDetails.quantity')}</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors font-bold"
                >
                  -
                </button>
                <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors font-bold"
                >
                  +
                </button>
              </div>
              {!isOutOfStock && (
                <p className="text-sm text-text/60 mt-2">
                  {product.stock_quantity} items available
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-highlight hover:shadow-xl'
                }`}
              >
                <FiShoppingCart />
                {isOutOfStock ? t('products.outOfStock') : t('productDetails.addToCart')}
              </button>
              <button
                className="w-14 h-14 rounded-lg bg-secondary hover:bg-accent transition-colors flex items-center justify-center"
                aria-label="Add to wishlist"
              >
                <FiHeart className="w-6 h-6 text-primary" />
              </button>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-text/70 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-display font-bold text-primary mb-8 text-center">
              {t('productDetails.relatedProducts')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <Link
                  key={relatedProduct.id}
                  to={`/products/${relatedProduct.id}`}
                  className="card group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={relatedProduct.product_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1595341595313-12e3e1a5f9b8?w=400'}
                      alt="Product"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {relatedProduct.category}
                    </h3>
                    <p className="text-primary font-bold">${relatedProduct.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <button
              className="absolute top-4 right-4 text-white bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
              onClick={() => setIsZoomed(false)}
            >
              <FiX className="w-6 h-6" />
            </button>
            <img
              src={images[selectedImage]}
              alt="Product"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetails;
