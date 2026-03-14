/**
 * Home — critical above-the-fold shell.
 *
 * NO framer-motion import here — the hero h1 (the LCP element) must paint
 * the instant React mounts, with zero extra JS to parse first.
 *
 * The below-the-fold content lives in HomeSections.jsx (lazy-loaded), which
 * is where framer-motion lives. It starts downloading immediately after the
 * hero is painted, so there is no perceptible delay for the user.
 */
import { useEffect, useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowRight, FiHeart } from 'react-icons/fi';
import axios from 'axios';

// Lazy — framer-motion and below-fold sections load AFTER hero paint
const HomeSections = lazy(() => import('./HomeSections'));

const Home = () => {
  const { t, i18n } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const controller = new AbortController();
    fetchHomeData(controller.signal);
    return () => controller.abort();
  }, []);

  const fetchHomeData = async (signal) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const productsRes = await axios.get(`${apiUrl}/products`, { signal }).catch((err) => {
        if (err.name === 'CanceledError' || axios.isCancel(err)) return { data: [] };
        throw err;
      });
      setFeaturedProducts(productsRes.data.slice(0, 6));
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.error('Error fetching home data:', error);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };


  return (
    <div className="min-h-screen">
      {/* ── Hero Section ── LCP element, no framer-motion ───────────────── */}
      <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary to-highlight/20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[5%] text-4xl sm:text-6xl">🧶</div>
          <div className="absolute top-[30%] right-[10%] text-2xl sm:text-4xl">🌸</div>
          <div className="absolute bottom-[20%] left-[15%] text-3xl sm:text-5xl">💐</div>
          <div className="absolute bottom-[35%] right-[25%] text-2xl sm:text-3xl">👜</div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* LCP element — pure CSS animation, zero JS library cost */}
          <h1 className="hero-fade-in text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-primary mb-6 break-words min-h-[1.5em]">
            {t('home.hero.title')}
          </h1>

          <p className="hero-fade-in animation-delay-200 text-xl md:text-2xl text-text/70 mb-8">
            {t('home.hero.subtitle')}
          </p>

          <div className="hero-fade-in animation-delay-400 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="btn-primary inline-flex items-center justify-center gap-2">
              {t('home.hero.shopNow')}
              <FiArrowRight className={isRTL ? 'rotate-180' : ''} />
            </Link>
            <Link to="/custom-orders" className="btn-secondary inline-flex items-center justify-center gap-2">
              {t('home.hero.customOrder')}
              <FiHeart />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Products Header ── LCP Target moved here for instant paint ─────────── */}
      <section className="bg-white pt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 hero-fade-in animation-delay-400">
            <h2 className="text-4xl font-display font-bold text-primary mb-4 break-words">
              {t('home.featured')}
            </h2>
            <div className="w-20 h-1 bg-highlight mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      {/* ── Below-the-fold Content (lazy) ─────────────────────────────────── */}
      <Suspense fallback={<div className="min-h-[600px] bg-white" />}>
        <HomeSections
          featuredProducts={featuredProducts}
          loading={loading}
          isRTL={isRTL}
        />
      </Suspense>

    </div>
  );
};

export default Home;
