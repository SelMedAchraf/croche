import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPackage,
  FiShoppingBag,
  FiImage,
  FiMessageSquare,
  FiLogOut,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCheck,
  FiX
} from 'react-icons/fi';
import axios from 'axios';
import { supabase } from '../../config/supabase';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin/login');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('supabase.auth.token');
      
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const [productsRes, ordersRes] = await Promise.all([
        axios.get(`${apiUrl}/products`, config).catch(() => ({ data: [] })),
        axios.get(`${apiUrl}/orders`, config).catch(() => ({ data: [] }))
      ]);

      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('supabase.auth.token');
    navigate('/admin/login');
  };

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    revenue: orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-primary">
              Admin Dashboard
            </h1>
            <p className="text-sm text-text/60">Manage your crochet store</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<FiPackage className="w-8 h-8" />}
            title="Total Products"
            value={stats.totalProducts}
            color="bg-blue-500"
          />
          <StatCard
            icon={<FiShoppingBag className="w-8 h-8" />}
            title="Total Orders"
            value={stats.totalOrders}
            color="bg-green-500"
          />
          <StatCard
            icon={<FiCheck className="w-8 h-8" />}
            title="Pending Orders"
            value={stats.pendingOrders}
            color="bg-yellow-500"
          />
          <StatCard
            icon={<span className="text-2xl">💰</span>}
            title="Total Revenue"
            value={`$${stats.revenue.toFixed(2)}`}
            color="bg-purple-500"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex border-b overflow-x-auto">
            <TabButton
              active={activeTab === 'products'}
              onClick={() => setActiveTab('products')}
              icon={<FiPackage />}
              label="Products"
            />
            <TabButton
              active={activeTab === 'orders'}
              onClick={() => setActiveTab('orders')}
              icon={<FiShoppingBag />}
              label="Orders"
            />
            <TabButton
              active={activeTab === 'gallery'}
              onClick={() => setActiveTab('gallery')}
              icon={<FiImage />}
              label="Gallery"
            />
            <TabButton
              active={activeTab === 'testimonials'}
              onClick={() => setActiveTab('testimonials')}
              icon={<FiMessageSquare />}
              label="Testimonials"
            />
          </div>

          <div className="p-6">
            {activeTab === 'products' && <ProductsTab products={products} onRefresh={fetchData} />}
            {activeTab === 'orders' && <OrdersTab orders={orders} onRefresh={fetchData} />}
            {activeTab === 'gallery' && <GalleryTab />}
            {activeTab === 'testimonials' && <TestimonialsTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub Components
const StatCard = ({ icon, title, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-lg shadow-sm border p-6"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-text/60 mb-1">{title}</p>
        <p className="text-3xl font-bold text-primary">{value}</p>
      </div>
      <div className={`${color} text-white p-3 rounded-lg`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
      active
        ? 'text-primary border-b-2 border-primary'
        : 'text-text/60 hover:text-text'
    }`}
  >
    {icon}
    {label}
  </button>
);

const ProductsTab = ({ products, onRefresh }) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Products Management</h2>
      <button className="btn-primary flex items-center gap-2">
        <FiPlus />
        Add Product
      </button>
    </div>

    {products.length === 0 ? (
      <div className="text-center py-12 text-text/60">
        <FiPackage className="w-16 h-16 mx-auto mb-4 opacity-30" />
        <p>No products yet. Add your first product!</p>
      </div>
    ) : (
      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={product.product_images?.[0]?.image_url || 'https://via.placeholder.com/100'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-text/60">${product.price} • {product.category}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                <FiEdit />
              </button>
              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const OrdersTab = ({ orders, onRefresh }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Orders Management</h2>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-text/60">
          <FiShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{order.customer_name}</h3>
                  <p className="text-sm text-text/60">
                    {order.customer_phone} • {order.customer_city}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-primary">
                  ${order.total_amount}
                </span>
                <span className="text-sm text-text/60">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const GalleryTab = () => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Gallery Management</h2>
      <button className="btn-primary flex items-center gap-2">
        <FiPlus />
        Add Image
      </button>
    </div>
    <div className="text-center py-12 text-text/60">
      <FiImage className="w-16 h-16 mx-auto mb-4 opacity-30" />
      <p>Gallery management coming soon</p>
    </div>
  </div>
);

const TestimonialsTab = () => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Testimonials Management</h2>
      <button className="btn-primary flex items-center gap-2">
        <FiPlus />
        Add Testimonial
      </button>
    </div>
    <div className="text-center py-12 text-text/60">
      <FiMessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
      <p>Testimonials management coming soon</p>
    </div>
  </div>
);

export default AdminDashboard;
