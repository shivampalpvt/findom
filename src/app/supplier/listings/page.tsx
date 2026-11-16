'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  IndianRupee,
  Layers,
  ArrowUpDown,
  Sparkles,
  X,
  AlertCircle,
  UploadCloud,
  CheckCircle2,
  Camera,
  Image as ImageIcon,
  RefreshCw,
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';
import PortalHeader from '@/components/PortalHeader';
import { MASTER_PRODUCTS, CATEGORIES } from '@/lib/mock-data';
import { SupplierListing } from '@/lib/types';

export default function SupplierListingsPage() {
  const { currentUser, listings, addListing, updateListing, deleteListing } = useMarketplace();

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'inactive'>('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<SupplierListing | null>(null);

  // Direct image upload states
  const [uploadFileName, setUploadFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [useUrlMode, setUseUrlMode] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    productId: MASTER_PRODUCTS[0].id,
    variety: '',
    sizeGrade: '2.5 - 3.0 Inches',
    pricePerUnit: 450,
    minOrderQty: 10,
    availableQty: 100,
    imageUrl: MASTER_PRODUCTS[0].default_image || '/products/rimless-aquarium-tank.jpg',
    isActive: true,
  });

  const supplierListings = listings.filter((l) =>
    currentUser ? l.supplier_id === currentUser.id : true
  );

  const filteredListings = supplierListings.filter((item) => {
    const matchesSearch =
      (item.product?.common_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.variety || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.size_grade || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat =
      selectedCategory === 'all' || item.product?.category_id === selectedCategory;

    let matchesStock = true;
    if (stockFilter === 'in_stock') matchesStock = item.available_qty > 20 && item.is_active;
    if (stockFilter === 'low_stock') matchesStock = item.available_qty <= 20 && item.is_active;
    if (stockFilter === 'inactive') matchesStock = !item.is_active;

    return matchesSearch && matchesCat && matchesStock;
  });

  // Client-side image file processor with canvas optimization
  const processImageFile = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, WEBP).');
      return;
    }
    setIsProcessingImage(true);
    setUploadFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawUrl = e.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setFormData((prev) => ({ ...prev, imageUrl: compressed }));
        } else {
          setFormData((prev) => ({ ...prev, imageUrl: rawUrl }));
        }
        setIsProcessingImage(false);
      };
      img.onerror = () => {
        setFormData((prev) => ({ ...prev, imageUrl: rawUrl }));
        setIsProcessingImage(false);
      };
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleOpenAdd = () => {
    setEditingListing(null);
    setUploadFileName('');
    setUseUrlMode(false);
    const defaultProduct = MASTER_PRODUCTS[0];
    setFormData({
      productId: defaultProduct.id,
      variety: '',
      sizeGrade: '2.5 - 3.0 Inches',
      pricePerUnit: 350,
      minOrderQty: 10,
      availableQty: 150,
      imageUrl: defaultProduct.default_image || '/products/rimless-aquarium-tank.jpg',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (listing: SupplierListing) => {
    setEditingListing(listing);
    setUploadFileName('');
    setUseUrlMode(false);
    setFormData({
      productId: listing.product_id,
      variety: listing.variety,
      sizeGrade: listing.size_grade,
      pricePerUnit: listing.price_per_unit,
      minOrderQty: listing.min_order_qty,
      availableQty: listing.available_qty,
      imageUrl: listing.images[0] || listing.product?.default_image || '/products/rimless-aquarium-tank.jpg',
      isActive: listing.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = MASTER_PRODUCTS.find((p) => p.id === formData.productId) || MASTER_PRODUCTS[0];
    const finalImage = formData.imageUrl.trim() || product.default_image || '/products/rimless-aquarium-tank.jpg';

    if (editingListing) {
      updateListing(editingListing.id, {
        product_id: formData.productId,
        product,
        variety: formData.variety || product.common_name,
        size_grade: formData.sizeGrade,
        price_per_unit: Number(formData.pricePerUnit),
        min_order_qty: Number(formData.minOrderQty),
        available_qty: Number(formData.availableQty),
        images: [finalImage],
        is_active: formData.isActive,
      });
    } else {
      addListing({
        supplier_id: currentUser?.id || 'sup-1',
        supplier: currentUser || undefined,
        product_id: formData.productId,
        product,
        variety: formData.variety || product.common_name,
        size_grade: formData.sizeGrade,
        price_per_unit: Number(formData.pricePerUnit),
        min_order_qty: Number(formData.minOrderQty),
        available_qty: Number(formData.availableQty),
        images: [finalImage],
        is_active: formData.isActive,
        location_city: currentUser?.city || 'Mumbai',
        location_state: currentUser?.state || 'Maharashtra',
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <PortalHeader
        portal="supplier"
        title="Inventory & Fish Listings"
        subtitle="Manage wholesale stock lots, set MOQs, pricing per specimen, and commercial availability"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Top Controls & Add Button */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search species, strain, or grade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-700 font-medium focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Aquatic Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Stock State Filter */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="w-full sm:w-auto text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-700 font-medium focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Availability</option>
              <option value="in_stock">Healthy Stock (&gt;20)</option>
              <option value="low_stock">Low Stock (≤20)</option>
              <option value="inactive">Paused / Inactive</option>
            </select>
          </div>

          <button
            onClick={handleOpenAdd}
            className="w-full md:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Fish Listing
          </button>
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Specimen & Strain</th>
                  <th className="py-3 px-4">Size / Grade</th>
                  <th className="py-3 px-4">Price per Piece (₹)</th>
                  <th className="py-3 px-4">Min Order (MOQ)</th>
                  <th className="py-3 px-4">Available Tank Stock</th>
                  <th className="py-3 px-4">Listing Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredListings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-slate-700">No fish listings found</p>
                      <p className="text-xs text-slate-400 mt-0.5">Try altering your search or add a new batch</p>
                    </td>
                  </tr>
                ) : (
                  filteredListings.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.images[0] || 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=200&q=80'}
                            alt={item.variety}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-100 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-sm">
                              {item.product?.common_name || item.variety}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium">
                              Variety: {item.variety}
                            </p>
                            <p className="text-[10px] text-slate-400 italic">
                              {item.product?.scientific_name}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        <span className="bg-slate-100 px-2 py-1 rounded-md text-[11px]">
                          {item.size_grade}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                        ₹{item.price_per_unit.toLocaleString('en-IN')}
                        <span className="text-[10px] font-normal text-slate-400 block">/ piece</span>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {item.min_order_qty} pieces
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-black text-sm ${
                              item.available_qty <= 10
                                ? 'text-rose-600'
                                : item.available_qty <= 30
                                ? 'text-amber-600'
                                : 'text-slate-900'
                            }`}
                          >
                            {item.available_qty}
                          </span>
                          <span className="text-slate-400 text-[10px]">in tanks</span>
                        </div>
                        {item.available_qty <= 10 && (
                          <span className="text-[10px] text-rose-600 font-bold block">Low Stock Alert</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => updateListing(item.id, { is_active: !item.is_active })}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition ${
                            item.is_active
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {item.is_active ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Active for Sale
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                              Paused
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition"
                            title="Edit Listing Details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove listing "${item.variety}"?`)) {
                                deleteListing(item.id);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Listing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  {editingListing ? 'Edit Fish Listing' : 'Publish New Wholesale Fish Lot'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Master Species
                </label>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                >
                  {MASTER_PRODUCTS.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.common_name} ({prod.scientific_name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Breeder Variety / Strain Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Red Marlboro High-Body, Albino Full Red Trio, Big Ear Dumbo..."
                  value={formData.variety}
                  onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Size / Grading
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2.5 - 3.0 Inches, Show Grade Trio"
                    value={formData.sizeGrade}
                    onChange={(e) => setFormData({ ...formData, sizeGrade: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Wholesale Price (₹ / piece)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.pricePerUnit}
                    onChange={(e) => setFormData({ ...formData, pricePerUnit: Number(e.target.value) })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Minimum Order Qty (MOQ)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.minOrderQty}
                    onChange={(e) => setFormData({ ...formData, minOrderQty: Number(e.target.value) })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Available Tank Inventory
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.availableQty}
                    onChange={(e) => setFormData({ ...formData, availableQty: Number(e.target.value) })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-xs">
                    Product / Specimen Photo *
                  </label>
                  <button
                    type="button"
                    onClick={() => setUseUrlMode(!useUrlMode)}
                    className="text-[11px] text-brand-600 hover:text-brand-700 font-semibold transition"
                  >
                    {useUrlMode ? '← Direct File Upload' : 'Or paste URL instead'}
                  </button>
                </div>

                {!useUrlMode ? (
                  <div>
                    {formData.imageUrl ? (
                      <div className="border-2 border-slate-200 rounded-2xl p-3 bg-slate-50 flex items-center gap-3.5">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 relative">
                          <img
                            src={formData.imageUrl}
                            alt="Uploaded Specimen"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Photo Ready for Listing</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mb-2 truncate">
                            {uploadFileName || 'Specimen image loaded'}
                          </p>
                          <div className="flex items-center gap-2">
                            <label className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer transition shadow-2xs inline-flex items-center gap-1.5">
                              <Camera className="w-3.5 h-3.5 text-slate-600" />
                              <span>Upload New Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, imageUrl: '' });
                                setUploadFileName('');
                              }}
                              className="px-2.5 py-1.5 text-xs text-red-600 hover:text-red-700 font-semibold transition"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleFileDrop}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center cursor-pointer transition ${
                          isDragging
                            ? 'border-brand-500 bg-brand-50/50'
                            : 'border-slate-300 hover:border-slate-400 bg-slate-50/60 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-2">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          Click to upload photo from your device
                        </span>
                        <span className="text-[11px] text-slate-500 mt-0.5">
                          or drag &amp; drop live fish / product photo here
                        </span>
                        <span className="text-[10px] text-slate-400 mt-2 font-mono">
                          JPG, PNG, WEBP (Direct phone/camera upload supported)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    )}
                    {isProcessingImage && (
                      <p className="text-[11px] text-brand-600 font-medium mt-1 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" /> Processing image from device...
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      placeholder="Paste image URL (https://...)"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    {formData.imageUrl && (
                      <div className="mt-2 flex items-center gap-2.5 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                        <img src={formData.imageUrl} alt="Preview" className="w-10 h-10 rounded-lg object-cover" />
                        <span className="text-[11px] text-slate-600 truncate">URL Image Preview</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <label htmlFor="isActive" className="font-semibold text-slate-700">
                  Immediately visible to verified retail aquarium stores
                </label>
              </div>

              <div className="p-4 border-t border-slate-200 -mx-6 -mb-6 mt-6 bg-slate-50 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition"
                >
                  {editingListing ? 'Save Changes' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
