import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { t } = useTranslation();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen section-padding flex items-center justify-center">
        <div className="text-center max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-8xl mb-6"
          >
            🛒
          </motion.div>
          <h2 className="text-3xl font-display font-bold text-primary mb-4">
            {t('cart.empty')}
          </h2>
          <p className="text-text/60 mb-8">
            Start adding beautiful crochet items to your cart!
          </p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2">
            <FiShoppingBag />
            {t('cart.continueShopping')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen section-padding">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-display font-bold text-primary mb-8"
        >
          {t('cart.title')}
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <motion.div
                key={`${item.id}-${item.selectedColor}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-4 flex gap-4"
              >
                <Link
                  to={`/products/${item.id}`}
                  className="w-28 h-28 rounded-lg overflow-hidden flex-shrink-0"
                >
                  <img
                    src={item.product_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1595341595313-12e3e1a5f9b8?w=200'}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </Link>

                <div className="flex-grow">
                  <Link
                    to={`/products/${item.id}`}
                    className="font-display font-semibold text-lg hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                  
                  {item.selectedColor && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-text/60">Color:</span>
                      <div
                        className="w-6 h-6 rounded-full border-2 border-gray-200"
                        style={{ backgroundColor: item.selectedColor }}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.selectedColor, item.quantity - 1)}
                        className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 transition-colors font-bold"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.selectedColor, item.quantity + 1)}
                        className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 transition-colors font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id, item.selectedColor)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label={t('cart.remove')}
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6 sticky top-24"
            >
              <h2 className="text-2xl font-display font-bold text-primary mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-text/70">
                  <span>{t('cart.subtotal')}</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-text/70">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>{t('cart.total')}</span>
                  <span className="text-primary">${getCartTotal().toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="btn-primary w-full text-center block mb-3"
              >
                {t('cart.checkout')}
              </Link>

              <Link
                to="/products"
                className="block text-center text-primary hover:underline"
              >
                {t('cart.continueShopping')}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
