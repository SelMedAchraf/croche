import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiHeart, FiMail, FiUser } from 'react-icons/fi';

const CustomOrders = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    colors: '',
    budget: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Custom order request:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        description: '',
        colors: '',
        budget: ''
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen section-padding">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-display font-bold text-primary mb-4">
            {t('customOrders.title')}
          </h1>
          <p className="text-xl text-text/70 max-w-2xl mx-auto">
            {t('customOrders.subtitle')}
          </p>
          <div className="w-20 h-1 bg-highlight mx-auto rounded-full mt-6"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="card p-8"
          >
            <h2 className="text-2xl font-display font-semibold text-primary mb-6">
              {t('customOrders.formTitle')}
            </h2>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiHeart className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-semibold text-primary mb-2">
                  {t('customOrders.success')}
                </h3>
                <p className="text-text/70">
                  We'll get back to you soon!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {t('checkout.name')} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Your name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="+212 XXX-XXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {t('customOrders.description')} *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="input-field resize-none"
                    placeholder="Describe what you'd like us to create..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {t('customOrders.preferredColors')}
                  </label>
                  <input
                    type="text"
                    name="colors"
                    value={formData.colors}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Pink, white, lavender..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {t('customOrders.budget')}
                  </label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="$50 - $100"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-4 text-lg"
                >
                  {t('customOrders.submit')}
                </button>
              </form>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="card p-8 bg-gradient-to-br from-primary/10 to-highlight/10">
              <h3 className="text-2xl font-display font-semibold text-primary mb-4">
                Why Custom Orders?
              </h3>
              <ul className="space-y-3 text-text/70">
                <li className="flex items-start gap-3">
                  <span className="text-primary text-xl">✨</span>
                  <span>Unique designs tailored to your preferences</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary text-xl">🎨</span>
                  <span>Choose your favorite colors and patterns</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary text-xl">💝</span>
                  <span>Perfect for special occasions and gifts</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary text-xl">🤝</span>
                  <span>Work directly with the artist</span>
                </li>
              </ul>
            </div>

            <div className="card p-8">
              <h3 className="text-xl font-display font-semibold text-primary mb-4">
                How It Works
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Submit Your Request</h4>
                    <p className="text-sm text-text/70">Fill out the form with your idea</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Consultation</h4>
                    <p className="text-sm text-text/70">We'll discuss the details and pricing</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Creation</h4>
                    <p className="text-sm text-text/70">Your unique piece is handmade with love</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Delivery</h4>
                    <p className="text-sm text-text/70">Receive your special creation</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CustomOrders;
