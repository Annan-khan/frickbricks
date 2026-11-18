'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  Layers,
  Image as ImageIcon,
  ShoppingBag,
  Plus,
  Trash2,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Product, Category, Banner } from '@/types';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'banners' | 'orders'>('products');

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [newCat, setNewCat] = useState({ name: '', image: '', description: '' });
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    oldPrice: '',
    stock: '',
    categoryId: '',
    images: [] as string[],
    isFeatured: false
  });
  const [newBanner, setNewBanner] = useState({ title: '', imageUrl: '', linkUrl: '', order: 0 });
  const [uploadingImage, setUploadingImage] = useState(false);

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [cRes, pRes, bRes, oRes] = await Promise.all([
        fetch('/api/categories').then((r) => r.json()),
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/banners').then((r) => r.json()),
        fetch('/api/orders').then((r) => r.json())
      ]);

      if (cRes.success) setCategories(cRes.data);
      if (pRes.success) setProducts(pRes.data);
      if (bRes.success) setBanners(bRes.data);
      if (oRes.success) setOrders(oRes.data);
    } catch (err: any) {
      console.error(err);
      showMsg('Failed to load data from database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Generic File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'product' | 'category' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (target === 'product') {
          setNewProduct((prev) => ({ ...prev, images: [...prev.images, data.url] }));
        } else if (target === 'category') {
          setNewCat((prev) => ({ ...prev, image: data.url }));
        } else if (target === 'banner') {
          setNewBanner((prev) => ({ ...prev, imageUrl: data.url }));
        }
        showMsg('Image uploaded successfully!');
      } else {
        showMsg(data.message || 'Image upload failed', 'error');
      }
    } catch (err) {
      showMsg('Upload error', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Add Category Handler
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name.trim()) return;

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCat)
      });
      const data = await res.json();
      if (data.success) {
        showMsg(`Category "${newCat.name}" created!`);
        setNewCat({ name: '', image: '', description: '' });
        loadAllData();
      } else {
        showMsg(data.message, 'error');
      }
    } catch (err) {
      showMsg('Error creating category', 'error');
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showMsg('Category deleted');
        loadAllData();
      }
    } catch (err) {
      showMsg('Failed to delete category', 'error');
    }
  };

  // Add Product Handler
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.categoryId) {
      showMsg('Please fill in required fields (Name, Price, Category)', 'error');
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      const data = await res.json();
      if (data.success) {
        showMsg(`Product "${newProduct.name}" created successfully!`);
        setNewProduct({
          name: '',
          description: '',
          price: '',
          oldPrice: '',
          stock: '',
          categoryId: '',
          images: [],
          isFeatured: false
        });
        loadAllData();
      } else {
        showMsg(data.message, 'error');
      }
    } catch (err) {
      showMsg('Error adding product', 'error');
    }
  };

  // Quick Stock Update
  const handleUpdateStock = async (id: string, newStock: number) => {
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, stock: newStock })
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
        );
        showMsg('Stock updated');
      }
    } catch (err) {
      showMsg('Failed to update stock', 'error');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showMsg('Product deleted');
        loadAllData();
      }
    } catch (err) {
      showMsg('Failed to delete product', 'error');
    }
  };

  // Add Banner Handler
  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanner.imageUrl) {
      showMsg('Please upload a banner image', 'error');
      return;
    }

    try {
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBanner)
      });
      const data = await res.json();
      if (data.success) {
        showMsg('Banner created successfully!');
        setNewBanner({ title: '', imageUrl: '', linkUrl: '', order: 0 });
        loadAllData();
      } else {
        showMsg(data.message, 'error');
      }
    } catch (err) {
      showMsg('Error creating banner', 'error');
    }
  };

  // Delete Banner
  const handleDeleteBanner = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    try {
      const res = await fetch(`/api/banners?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showMsg('Banner deleted');
        loadAllData();
      }
    } catch (err) {
      showMsg('Failed to delete banner', 'error');
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
        );
        showMsg('Order status updated!');
      } else {
        showMsg(data.message || 'Failed to update order status', 'error');
      }
    } catch (err) {
      showMsg('Failed to update order status', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span className="text-[#d91e18]">FIGBRICKS</span> Store Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your categories, products, inventory stock, banners & orders
          </p>
        </div>

        <button
          onClick={loadAllData}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-xs font-semibold transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Notification Toast */}
      {message && (
        <div
          className={`mb-6 p-3 rounded-lg flex items-center gap-2 text-xs font-medium ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
          {message.text}
        </div>
      )}

      {/* Nav Tabs */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('products')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition ${
            activeTab === 'products'
              ? 'border-[#d91e18] text-[#d91e18]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Package className="w-4 h-4" />
          Products & Stock ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition ${
            activeTab === 'categories'
              ? 'border-[#d91e18] text-[#d91e18]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          Categories ({categories.length})
        </button>

        <button
          onClick={() => setActiveTab('banners')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition ${
            activeTab === 'banners'
              ? 'border-[#d91e18] text-[#d91e18]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Hero Banners ({banners.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition ${
            activeTab === 'orders'
              ? 'border-[#d91e18] text-[#d91e18]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Orders ({orders.length})
        </button>
      </div>

      {/* TAB 1: PRODUCTS & STOCK MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-8">
          {/* Add Product Form */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#d91e18]" />
              Add New Product (with Image Upload & Stock)
            </h2>

            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kakashi Hatake"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d91e18] focus:border-[#d91e18]" style={{ color: '#111827', backgroundColor: '#ffffff' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                <select
                  required
                  value={newProduct.categoryId}
                  onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d91e18] focus:border-[#d91e18]" style={{ color: '#111827', backgroundColor: '#ffffff' }}
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Selling Price (৳) *</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="250"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d91e18] focus:border-[#d91e18]" style={{ color: '#111827', backgroundColor: '#ffffff' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Old Price / Crossed Out (৳)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="300"
                  value={newProduct.oldPrice}
                  onChange={(e) => setNewProduct({ ...newProduct, oldPrice: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d91e18] focus:border-[#d91e18]" style={{ color: '#111827', backgroundColor: '#ffffff' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Inventory Stock *</label>
                <input
                  type="number"
                  required
                  placeholder="15"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d91e18] focus:border-[#d91e18]" style={{ color: '#111827', backgroundColor: '#ffffff' }}
                />
              </div>

              {/* Upload Image Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Upload Product Image</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'product')}
                    className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-[#d91e18] hover:file:bg-red-100"
                  />
                  {uploadingImage && <span className="text-[10px] text-gray-500">Uploading...</span>}
                </div>
              </div>

              {/* Uploaded Images Preview */}
              {newProduct.images.length > 0 && (
                <div className="md:col-span-2 lg:col-span-3 flex gap-2 items-center">
                  <span className="text-xs text-gray-500">Attached Images:</span>
                  {newProduct.images.map((img, idx) => (
                    <div key={idx} className="relative w-12 h-12 border rounded p-0.5 bg-gray-50">
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>
              )}

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  placeholder="Collectible minifigure details, included parts & accessories..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d91e18] focus:border-[#d91e18]" style={{ color: '#111827', backgroundColor: '#ffffff' }}
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <button
                  type="submit"
                  className="bg-[#d91e18] hover:bg-[#b81410] text-white px-6 py-2.5 rounded text-xs font-bold transition shadow-sm active:scale-95"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>

          {/* Product List Table with Stock Controls */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-xs text-gray-700 uppercase tracking-wider">
              Existing Products Catalog
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-100 text-gray-700 uppercase font-semibold">
                  <tr>
                    <th className="p-3">Image</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock Quantity</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="p-3">
                        <div className="w-10 h-10 rounded border bg-white p-0.5 flex items-center justify-center">
                          <img
                            src={p.images?.[0] || '/uploads/media_1794749390582_47ddaf52.jpg'}
                            alt=""
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-gray-900">{p.name}</td>
                      <td className="p-3">{p.category?.name || 'General'}</td>
                      <td className="p-3 font-bold text-gray-900">৳ {p.price}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            defaultValue={p.stock}
                            onBlur={(e) => handleUpdateStock(p.id, parseInt(e.target.value) || 0)}
                            className="w-16 p-1.5 border border-gray-300 rounded text-sm font-semibold text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#d91e18]" style={{ color: '#111827', backgroundColor: '#ffffff' }}
                          />
                          <span className="text-[10px] text-gray-400">units</span>
                        </div>
                      </td>
                      <td className="p-3">
                        {p.stock > 0 ? (
                          <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold">
                            In Stock
                          </span>
                        ) : (
                          <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold">
                            Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-gray-400">
                        No products created yet. Add your first product above!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-8">
          {/* Add Category Form */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-2xl">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#d91e18]" />
              Create New Category (Add as many as you want)
            </h2>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dragon Ball Z, Marvel, Star Wars"
                  value={newCat.name}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d91e18] focus:border-[#d91e18]" style={{ color: '#111827', backgroundColor: '#ffffff' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category Tile Banner / Logo Image</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'category')}
                    className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-[#d91e18] hover:file:bg-red-100"
                  />
                  {uploadingImage && <span className="text-[10px] text-gray-500">Uploading...</span>}
                </div>
                {newCat.image && (
                  <div className="mt-2 w-28 h-16 rounded overflow-hidden border">
                    <img src={newCat.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="Short tagline or notes"
                  value={newCat.description}
                  onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d91e18] focus:border-[#d91e18]" style={{ color: '#111827', backgroundColor: '#ffffff' }}
                />
              </div>

              <button
                type="submit"
                className="bg-[#d91e18] hover:bg-[#b81410] text-white px-5 py-2.5 rounded text-xs font-bold transition shadow-sm"
              >
                Create Category
              </button>
            </form>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((c) => (
              <div key={c.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="h-28 bg-black relative flex items-center justify-center">
                  {c.image ? (
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover opacity-80" />
                  ) : (
                    <span className="text-white font-bold text-sm">{c.name}</span>
                  )}
                  <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                    Slug: {c.slug}
                  </span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{c.name}</h3>
                    <p className="text-[11px] text-gray-500">
                      {c._count?.products ?? 0} products
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(c.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HERO BANNERS MANAGEMENT */}
      {activeTab === 'banners' && (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-2xl">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#d91e18]" />
              Upload Hero Slider Banner (Controlled from Admin)
            </h2>

            <form onSubmit={handleAddBanner} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Banner Title / Heading (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Welcome to FigBricks — New Naruto Drop"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d91e18] focus:border-[#d91e18]" style={{ color: '#111827', backgroundColor: '#ffffff' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Upload Banner Image *</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'banner')}
                    className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-[#d91e18] hover:file:bg-red-100"
                  />
                  {uploadingImage && <span className="text-[10px] text-gray-500">Uploading...</span>}
                </div>
                {newBanner.imageUrl && (
                  <div className="mt-3 w-full max-w-md h-28 rounded overflow-hidden border bg-black">
                    <img src={newBanner.imageUrl} alt="" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Destination URL (Optional)</label>
                <input
                  type="text"
                  placeholder="/products?category=naruto"
                  value={newBanner.linkUrl}
                  onChange={(e) => setNewBanner({ ...newBanner, linkUrl: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d91e18] focus:border-[#d91e18]" style={{ color: '#111827', backgroundColor: '#ffffff' }}
                />
              </div>

              <button
                type="submit"
                className="bg-[#d91e18] hover:bg-[#b81410] text-white px-5 py-2.5 rounded text-xs font-bold transition shadow-sm"
              >
                Publish Banner
              </button>
            </form>
          </div>

          {/* Active Banners Display */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Current Hero Banners</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banners.map((b) => (
                <div key={b.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="h-44 bg-black relative flex items-center justify-center">
                    <img src={b.imageUrl} alt={b.title || ''} className="w-full h-full object-contain" />
                    {b.title && (
                      <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {b.title}
                      </span>
                    )}
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500 truncate max-w-xs">
                      Link: {b.linkUrl || 'None'}
                    </span>
                    <button
                      onClick={() => handleDeleteBanner(b.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete Banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {banners.length === 0 && (
                <p className="text-xs text-gray-400">
                  Using default fallback banner. Upload your custom banner above!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ORDERS & CUSTOMER PURCHASES */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-xs text-gray-700 uppercase tracking-wider">
            Customer Orders Received
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-100 text-gray-700 uppercase font-semibold">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Address</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="p-3 font-mono font-bold text-[#d91e18]">#{o.id.slice(0, 8)}</td>
                    <td className="p-3 font-semibold text-gray-900">{o.customerName}</td>
                    <td className="p-3">{o.customerPhone}</td>
                    <td className="p-3 max-w-xs truncate">{o.address}</td>
                    <td className="p-3 max-w-xs">
                      {o.items && o.items.length > 0 ? (
                        <div className="space-y-0.5 text-[11px]">
                          {o.items.map((item: any, i: number) => (
                            <div key={i} className="text-gray-700">
                              <span className="font-semibold text-gray-900">{item.quantity}x</span> {item.product?.name || 'Item'} (৳{item.price})
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No items</span>
                      )}
                    </td>
                    <td className="p-3 font-bold text-gray-900">৳ {o.totalAmount}</td>
                    <td className="p-3">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className="bg-white text-gray-900 border border-gray-300 px-2 py-1 rounded text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#d91e18]"
                        style={{ color: '#111827', backgroundColor: '#ffffff' }}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="p-3 text-[11px] text-gray-400">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-gray-400">
                      No customer orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
