import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPackage,
  FiShoppingBag,
  FiImage,
  FiLogOut,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCheck,
  FiX,
  FiDollarSign,
  FiTruck,
  FiSave,
  FiGrid,
  FiUpload,
  FiBox
} from 'react-icons/fi';
import axios from 'axios';
import { supabase } from '../../config/supabase';
import { useItems } from '../../hooks/useItems';
import { useDeliveryPrices } from '../../hooks/useDeliveryPrices';
import { useCategoriesManagement } from '../../hooks/useCategoriesManagement';

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
      
      // Get token from session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
        return;
      }
      
      const token = session.access_token;
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
              active={activeTab === 'items'}
              onClick={() => setActiveTab('items')}
              icon={<FiBox />}
              label="Items"
            />
            <TabButton
              active={activeTab === 'categories'}
              onClick={() => setActiveTab('categories')}
              icon={<FiGrid />}
              label="Categories"
            />
            <TabButton
              active={activeTab === 'orders'}
              onClick={() => setActiveTab('orders')}
              icon={<FiShoppingBag />}
              label="Orders"
            />
            <TabButton
              active={activeTab === 'deliveryPrices'}
              onClick={() => setActiveTab('deliveryPrices')}
              icon={<FiTruck />}
              label="Delivery Prices"
            />
          </div>

          <div className="p-6">
            {activeTab === 'products' && <ProductsTab products={products} onRefresh={fetchData} />}
            {activeTab === 'orders' && <OrdersTab orders={orders} onRefresh={fetchData} />}
            {activeTab === 'categories' && <CategoriesTab onRefresh={fetchData} />}
            {activeTab === 'items' && <ItemsTab />}
            {activeTab === 'deliveryPrices' && <DeliveryPricesTab />}
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

const ProductsTab = ({ products, onRefresh }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    price: '',
    category: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${apiUrl}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert('Please select a valid image file');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const uploadImage = async () => {
    if (!selectedImage) return imagePreview || '';

    setUploading(true);
    try {
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, selectedImage);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert('Session expired. Please login again.');
      navigate('/admin/login');
      return;
    }
    const token = session.access_token;
    
    try {
      const imageUrl = await uploadImage();
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category
      };

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      if (editingProduct) {
        // Update product
        await axios.put(
          `${apiUrl}/products/${editingProduct.id}`,
          productData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Update image if new one was uploaded
        if (imageUrl && imageUrl !== imagePreview) {
          // Delete old images
          await axios.delete(
            `${apiUrl}/products/${editingProduct.id}/images`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          // Add new image
          await axios.post(
            `${apiUrl}/products/${editingProduct.id}/images`,
            { image_url: imageUrl, is_primary: true },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      } else {
        // Create product
        const response = await axios.post(
          `${apiUrl}/products`,
          productData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Add image
        const productId = response.data.id;
        if (imageUrl) {
          await axios.post(
            `${apiUrl}/products/${productId}/images`,
            { image_url: imageUrl, is_primary: true },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      setShowModal(false);
      setEditingProduct(null);
      setFormData({ 
        price: '', 
        category: categories.length > 0 ? categories[0].name : '' 
      });
      setSelectedImage(null);
      setImagePreview(null);
      setDragActive(false);
      onRefresh();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      price: product.price.toString(),
      category: product.category
    });
    setImagePreview(product.product_images?.[0]?.image_url || '');
    setSelectedImage(null);
    setDragActive(false);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Session expired. Please login again.');
        navigate('/admin/login');
        return;
      }
      const token = session.access_token;
      
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        await axios.delete(`${apiUrl}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        onRefresh();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Products Management</h2>
        <button 
          onClick={() => {
            setEditingProduct(null);
            setFormData({ 
              name: '', 
              price: '', 
              category: categories.length > 0 ? categories[0].name : '' 
            });
            setSelectedImage(null);
            setImagePreview(null);
            setDragActive(false);
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
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
                  alt="Product"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">{product.category}</h3>
                <p className="text-sm text-text/60">{product.price} DA</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(product)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <FiEdit />
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price (DA) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Image *</label>
                {!imagePreview ? (
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-300 hover:border-primary/50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required={!editingProduct}
                    />
                    <FiUpload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-600 mb-1 font-medium">
                      Drop your image here, or <span className="text-primary">browse</span>
                    </p>
                    <p className="text-sm text-gray-400">Supports: JPG, PNG, GIF</p>
                  </div>
                ) : (
                  <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <label className="bg-white/90 hover:bg-white p-2 rounded-lg cursor-pointer shadow-lg transition-all">
                        <FiUpload />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="bg-red-500/90 hover:bg-red-500 text-white p-2 rounded-lg shadow-lg transition-all"
                      >
                        <FiX />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                    setFormData({ 
                      name: '', 
                      price: '', 
                      category: categories.length > 0 ? categories[0].name : '' 
                    });
                    setSelectedImage(null);
                    setImagePreview(null);
                    setDragActive(false);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 btn-primary"
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

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

const CategoriesTab = ({ onRefresh }) => {
  const navigate = useNavigate();
  const { categories, loading, createCategory, updateCategory, deleteCategory } = useCategoriesManagement();
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get token from session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert('Session expired. Please login again.');
      navigate('/admin/login');
      return;
    }
    const token = session.access_token;
    
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData, token);
        // Refresh products data to show updated category names
        onRefresh();
      } else {
        await createCategory(formData, token);
      }
      setShowModal(false);
      setEditingCategory(null);
      setFormData({ name: '' });
    } catch (error) {
      alert(error.message || 'Failed to save category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      // Get token from session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Session expired. Please login again.');
        navigate('/admin/login');
        return;
      }
      const token = session.access_token;
      
      try {
        await deleteCategory(id, token);
      } catch (error) {
        alert(error.message || 'Failed to delete category');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Categories Management</h2>
        <button 
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '' });
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus />
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-text/60">
          <FiGrid className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>No categories yet. Add your first category!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{category.name}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="e.g., Crochet Flowers"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCategory(null);
                    setFormData({ name: '' });
                  }}
                  className="px-4 py-2 text-text/70 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ItemsTab = () => {
  const { items, loading, createItem, updateItem, deleteItem } = useItems();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'flower',
    image_url: '',
    price: ''
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert('Please select a valid image file');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const uploadImage = async () => {
    if (!selectedImage) return formData.image_url;

    setUploading(true);
    try {
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('item-images')
        .upload(filePath, selectedImage);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('item-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get token from session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert('Session expired. Please login again.');
      navigate('/admin/login');
      return;
    }
    const token = session.access_token;
    
    try {
      const imageUrl = await uploadImage();
      const dataToSubmit = { ...formData, image_url: imageUrl };
      
      if (editingItem) {
        await updateItem(editingItem.id, dataToSubmit, token);
      } else {
        await createItem(dataToSubmit, token);
      }
      setShowModal(false);
      setEditingItem(null);
      setFormData({ name: '', category: 'flower', image_url: '', price: '' });
      setSelectedImage(null);
      setImagePreview(null);
      setDragActive(false);
    } catch (error) {
      alert('Failed to save item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      image_url: item.image_url,
      price: item.price.toString()
    });
    setImagePreview(item.image_url);
    setSelectedImage(null);
    setDragActive(false);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      // Get token from session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Session expired. Please login again.');
        navigate('/admin/login');
        return;
      }
      const token = session.access_token;
      
      try {
        await deleteItem(id, token);
      } catch (error) {
        alert('Failed to delete item');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Items Management</h2>
        <button 
          onClick={() => {
            setEditingItem(null);
            setFormData({ name: '', category: 'flower', image_url: '', price: '' });
            setSelectedImage(null);
            setImagePreview(null);
            setDragActive(false);
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus />
          Add Item
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-text/60">
          <FiBox className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>No items yet. Add your first item!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-text/60">{item.category}</p>
                  </div>
                  <span className="text-lg font-bold text-primary">{item.price} DA</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg flex items-center justify-center gap-1"
                  >
                    <FiEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center gap-1"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">
              {editingItem ? 'Edit Item' : 'Add Item'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none"
                    required
                  >
                    <option value="flower">Flower</option>
                    <option value="packaging">Packaging</option>
                    <option value="accessory">Accessory</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Image *</label>
                {!imagePreview ? (
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-300 hover:border-primary/50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required={!editingItem && !formData.image_url}
                    />
                    <FiUpload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-600 mb-1 font-medium">
                      Drop your image here, or <span className="text-primary">browse</span>
                    </p>
                    <p className="text-sm text-gray-400">Supports: JPG, PNG, GIF (Max 5MB)</p>
                  </div>
                ) : (
                  <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <label className="bg-white/90 hover:bg-white p-2 rounded-lg cursor-pointer shadow-lg transition-all flex items-center gap-1 text-sm">
                        <FiEdit className="w-4 h-4" />
                        <span>Change</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="bg-red-500/90 hover:bg-red-500 text-white p-2 rounded-lg shadow-lg transition-all"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {selectedImage && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white px-3 py-2 text-xs">
                        <p className="truncate">{selectedImage.name}</p>
                        <p className="text-gray-300">
                          {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price (DA) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1" disabled={uploading}>
                  {uploading ? 'Uploading...' : editingItem ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                    setSelectedImage(null);
                    setImagePreview(null);
                    setDragActive(false);
                    setFormData({ name: '', category: 'flower', image_url: '', price: '' });
                  }}
                  className="btn-secondary flex-1"
                  disabled={uploading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const DeliveryPricesTab = () => {
  const navigate = useNavigate();
  const { deliveryPrices, loading, updateDeliveryPrice } = useDeliveryPrices();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (price) => {
    setEditingId(price.id);
    setEditForm({
      wilaya_name: price.wilaya_name,
      home_delivery_price: price.home_delivery_price.toString(),
      stopdesk_delivery_price: price.stopdesk_delivery_price.toString()
    });
  };

  const handleSave = async (id) => {
    // Get token from session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert('Session expired. Please login again.');
      navigate('/admin/login');
      return;
    }
    const token = session.access_token;
    
    try {
      await updateDeliveryPrice(id, editForm, token);
      setEditingId(null);
    } catch (error) {
      alert('Failed to update delivery price');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Delivery Prices (World Express)</h2>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold">Code</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Wilaya</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Home Delivery (DA)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Stop Desk (DA)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveryPrices.map((price) => (
                <tr key={price.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{price.wilaya_code}</td>
                  <td className="px-4 py-3 text-sm font-medium">{price.wilaya_name}</td>
                  <td className="px-4 py-3 text-sm">
                    {editingId === price.id ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.home_delivery_price}
                        onChange={(e) => setEditForm({ ...editForm, home_delivery_price: e.target.value })}
                        className="input-field py-1 px-2 w-24"
                      />
                    ) : (
                      `${price.home_delivery_price} DA`
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {editingId === price.id ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.stopdesk_delivery_price}
                        onChange={(e) => setEditForm({ ...editForm, stopdesk_delivery_price: e.target.value })}
                        className="input-field py-1 px-2 w-24"
                      />
                    ) : (
                      `${price.stopdesk_delivery_price} DA`
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {editingId === price.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(price.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        >
                          <FiSave />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          <FiX />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(price)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <FiEdit />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
