'use client';

import React, { useState, useRef } from 'react';
import {
  Camera,
  UploadCloud,
  CheckCircle2,
  Trash2,
  Plus,
  RefreshCw,
  Image as ImageIcon,
  Link as LinkIcon,
  Server,
  AlertCircle,
  Eye,
} from 'lucide-react';

interface DirectImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  label?: string;
  helperText?: string;
  accentColor?: 'emerald' | 'blue' | 'rose' | 'slate';
  allowUrlFallback?: boolean;
  sampleImages?: { label: string; url: string }[];
}

export default function DirectImageUploader({
  images = [],
  onChange,
  multiple = true,
  maxFiles = 8,
  label = 'Inspection & Verification Photos',
  helperText = 'Upload directly from your device storage or camera. All photos are securely stored on the Findom server.',
  accentColor = 'emerald',
  allowUrlFallback = true,
  sampleImages = [],
}: DirectImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Color schemes
  const colorStyles = {
    emerald: {
      borderActive: 'border-emerald-500 bg-emerald-50/60',
      borderDefault: 'border-slate-300 hover:border-emerald-400 bg-slate-50/70 hover:bg-slate-50',
      iconBg: 'bg-emerald-100 text-emerald-700',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      focusRing: 'focus:ring-emerald-500',
    },
    blue: {
      borderActive: 'border-sky-500 bg-sky-50/60',
      borderDefault: 'border-slate-300 hover:border-sky-400 bg-slate-50/70 hover:bg-slate-50',
      iconBg: 'bg-sky-100 text-sky-700',
      buttonBg: 'bg-sky-600 hover:bg-sky-700 text-white',
      badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
      focusRing: 'focus:ring-sky-500',
    },
    rose: {
      borderActive: 'border-rose-500 bg-rose-50/60',
      borderDefault: 'border-rose-200 hover:border-rose-400 bg-rose-50/30 hover:bg-rose-50/60',
      iconBg: 'bg-rose-100 text-rose-700',
      buttonBg: 'bg-rose-600 hover:bg-rose-700 text-white',
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
      focusRing: 'focus:ring-rose-500',
    },
    slate: {
      borderActive: 'border-slate-900 bg-slate-100',
      borderDefault: 'border-slate-300 hover:border-slate-500 bg-slate-50 hover:bg-slate-100',
      iconBg: 'bg-slate-200 text-slate-800',
      buttonBg: 'bg-slate-900 hover:bg-slate-800 text-white',
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
      focusRing: 'focus:ring-slate-900',
    },
  }[accentColor];

  // Upload handler to /api/upload
  const handleUploadFiles = async (fileList: FileList | File[]) => {
    const rawFiles = Array.from(fileList);
    const validImageFiles = rawFiles.filter((f) => f.type.startsWith('image/'));

    if (validImageFiles.length === 0) {
      setErrorMessage('Please select valid image files (JPG, PNG, WEBP).');
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    if (!multiple && images.length >= 1) {
      // Single image mode replaces existing
      // proceed
    } else if (images.length + validImageFiles.length > maxFiles) {
      setErrorMessage(`Maximum limit of ${maxFiles} images reached.`);
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);
    setUploadMessage(`Uploading ${validImageFiles.length} photo(s) to Findom server...`);

    try {
      const formData = new FormData();
      validImageFiles.forEach((f) => formData.append('files', f));

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      if (data.success && data.files) {
        const newServerUrls = data.files.map((item: { url: string }) => item.url);
        
        if (!multiple) {
          onChange([newServerUrls[0]]);
        } else {
          onChange([...images, ...newServerUrls]);
        }

        setUploadMessage(`✓ Saved ${newServerUrls.length} image(s) directly to server storage!`);
        setTimeout(() => setUploadMessage(null), 4500);
      } else {
        throw new Error(data.error || 'Failed to save images on server');
      }
    } catch (err: any) {
      console.error('Direct image upload error:', err);
      setErrorMessage(err.message || 'Upload failed. Check your network connection.');
      setTimeout(() => setErrorMessage(null), 5000);
      setUploadMessage(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  // Add external URL
  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    if (!multiple) {
      onChange([urlInput.trim()]);
    } else {
      onChange([...images, urlInput.trim()]);
    }
    setUrlInput('');
  };

  // Remove photo
  const handleRemove = (indexToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-3">
      {/* Label and Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-slate-600" />
            <span>{label}</span>
          </label>
          <p className="text-[11px] text-slate-500 mt-0.5">{helperText}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            {images.length} / {maxFiles} Attached
          </span>
          {allowUrlFallback && (
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-[11px] text-brand-600 hover:text-brand-800 font-semibold underline underline-offset-2 transition"
            >
              {showUrlInput ? 'Hide URL link' : 'Paste link instead'}
            </button>
          )}
        </div>
      </div>

      {/* Main Direct Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-5 text-center transition relative ${
          isDragging ? colorStyles.borderActive : colorStyles.borderDefault
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          id={`direct-file-input-${label.replace(/\s+/g, '-').toLowerCase()}`}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleUploadFiles(e.target.files);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center pointer-events-auto">
          <div className={`w-12 h-12 rounded-2xl ${colorStyles.iconBg} flex items-center justify-center mb-2.5 shadow-xs`}>
            {isUploading ? (
              <RefreshCw className="w-6 h-6 animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
            {isUploading ? 'Uploading to Server...' : 'Choose Photos from Device Storage or Camera'}
          </h4>

          <p className="text-[11px] text-slate-500 mt-1 max-w-md">
            Drag &amp; drop inspection files here, or tap below to pick from your phone gallery, storage, or live camera.
          </p>

          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
            <label
              htmlFor={`direct-file-input-${label.replace(/\s+/g, '-').toLowerCase()}`}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition shadow-xs ${colorStyles.buttonBg}`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Select Images from Storage</span>
            </label>
          </div>

          <div className="mt-2.5 flex items-center gap-2 text-[10px] text-slate-400 font-medium">
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-mono">
              <Server className="w-2.5 h-2.5" /> Automatic Server Save (/api/uploads)
            </span>
            <span>•</span>
            <span>JPG, PNG, WEBP</span>
          </div>
        </div>
      </div>

      {/* Progress / Status / Error Messages */}
      {uploadMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{uploadMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Optional URL Paste Form (Collapsed by default) */}
      {showUrlInput && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 animate-in fade-in">
          <span className="block text-[11px] font-bold text-slate-600">
            Paste External Image URL (AWS S3, Imgur, Cloudinary)
          </span>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://example.com/fish-photo.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className={`flex-1 text-xs px-3.5 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 ${colorStyles.focusRing}`}
            />
            <button
              type="button"
              onClick={handleAddUrl}
              className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> Add URL
            </button>
          </div>
        </div>
      )}

      {/* Sample demo stock images quick-pick */}
      {sampleImages.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap pt-0.5">
          <span className="text-[10px] text-slate-400 font-medium">Demo stock shortcuts:</span>
          {sampleImages.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (!multiple) {
                  onChange([sample.url]);
                } else if (!images.includes(sample.url)) {
                  onChange([...images, sample.url]);
                }
              }}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
            >
              + {sample.label}
            </button>
          ))}
        </div>
      )}

      {/* Attached Images Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <ImageIcon className="w-3 h-3 text-slate-500" />
            <span>Attached Verification Photos ({images.length})</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((imgUrl, index) => {
              const isServerStored = imgUrl.startsWith('/api/uploads') || imgUrl.startsWith('/products');
              return (
                <div
                  key={index}
                  className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video shadow-2xs hover:shadow-sm transition"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt={`Verification ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Badges Overlay */}
                  <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 pointer-events-none">
                    <span className="bg-black/70 backdrop-blur-xs text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                      #{index + 1}
                    </span>
                    {isServerStored ? (
                      <span className="bg-emerald-600/90 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-xs">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Server File
                      </span>
                    ) : (
                      <span className="bg-slate-800/80 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-1">
                        <LinkIcon className="w-2.5 h-2.5" /> External URL
                      </span>
                    )}
                  </div>

                  {/* Actions Overlay */}
                  <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      type="button"
                      onClick={() => setPreviewModalUrl(imgUrl)}
                      className="p-1.5 bg-black/70 hover:bg-black text-white rounded-lg transition"
                      title="Inspect full image"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Bottom Filename / Path preview */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5 pt-4 text-[9px] text-white font-mono truncate">
                    {imgUrl.split('/').pop()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox / Preview Modal */}
      {previewModalUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewModalUrl(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-2 text-white text-xs border-b border-slate-800 mb-2">
              <span className="font-mono truncate">{previewModalUrl}</span>
              <button
                type="button"
                onClick={() => setPreviewModalUrl(null)}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-bold"
              >
                Close ✕
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewModalUrl}
              alt="Full Preview"
              className="w-full max-h-[75vh] object-contain rounded-xl bg-black"
            />
          </div>
        </div>
      )}
    </div>
  );
}
