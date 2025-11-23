import React, { useState, useEffect, useRef } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiUpload, FiX, FiImage, FiSearch } from 'react-icons/fi';
import api from '../../services/api';
import Notification from '../../components/admin/Notification';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import HelpBadge from '../../components/admin/HelpBadge';
import Tooltip from '../../components/admin/Tooltip';
import { getImageUrl } from '../../utils/imageUrl';

const AdminGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [filteredGallery, setFilteredGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category_id: '',
    alt_text: '',
  });
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [files, setFiles] = useState([]); // For multiple files
  const [previews, setPreviews] = useState([]); // For multiple previews
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadMode, setUploadMode] = useState('single'); // 'single' or 'multiple'
  const fileInputRef = useRef(null);
  const dropRef = useRef(null);

  useEffect(() => {
    fetchGallery();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterGallery();
  }, [gallery, searchQuery, categoryFilter]);

  const filterGallery = () => {
    let filtered = [...gallery];

    if (searchQuery) {
      filtered = filtered.filter(item =>
        (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(item => item.category_id == categoryFilter);
    }

    setFilteredGallery(filtered);
  };

  const fetchGallery = async () => {
    try {
      const res = await api.get('/gallery?limit=1000');
      setGallery(res.data.data || []);
    } catch (error) {
      showNotification('error', 'Gagal memuat galeri');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories?type=gallery');
      setCategories(res.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (uploadMode === 'multiple') {
        handleMultipleFiles(Array.from(e.dataTransfer.files));
      } else {
        handleFile(e.dataTransfer.files[0]);
      }
    }
  };

  const handleFile = (selectedFile) => {
    if (selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      showNotification('error', 'File harus berupa gambar');
    }
  };

  const handleMultipleFiles = (selectedFiles) => {
    const imageFiles = Array.from(selectedFiles).filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      showNotification('error', 'File harus berupa gambar');
      return;
    }

    if (imageFiles.length > 50) {
      showNotification('error', 'Maksimal 50 gambar sekaligus');
      return;
    }

    setFiles(imageFiles);
    
    // Create previews for all files
    const previewPromises = imageFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            url: reader.result,
            name: file.name,
            size: file.size
          });
        };
        reader.onerror = () => {
          resolve({
            url: null,
            name: file.name,
            size: file.size
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previewPromises).then((previewResults) => {
      setPreviews(previewResults.filter(p => p.url !== null));
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (uploadMode === 'multiple') {
        const selectedFiles = Array.from(e.target.files);
        handleMultipleFiles(selectedFiles);
      } else {
        // Single mode - only take first file
        handleFile(e.target.files[0]);
      }
    }
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editing) {
      // Single file edit mode
      if (!file && !editing) {
        showNotification('error', 'Pilih gambar terlebih dahulu');
        return;
      }

      setSubmitting(true);
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key]) {
          formData.append(key, form[key]);
        }
      });
      if (file) {
        formData.append('image', file);
      }

      try {
        await api.put(`/gallery/${editing.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showNotification('success', 'Item galeri berhasil diperbarui!');
        setShowModal(false);
        resetForm();
        fetchGallery();
      } catch (error) {
        showNotification('error', error.response?.data?.message || 'Gagal menyimpan item galeri');
      } finally {
        setSubmitting(false);
      }
    } else {
      // Create mode (single or multiple)
      if (uploadMode === 'multiple') {
        if (files.length === 0) {
          showNotification('error', 'Pilih gambar terlebih dahulu');
          return;
        }

        setSubmitting(true);
        const formData = new FormData();
        if (form.category_id) {
          formData.append('category_id', form.category_id);
        }
        if (form.title) {
          formData.append('default_title', form.title);
        }
        if (form.description) {
          formData.append('description', form.description);
        }
        
        // Append all files with same field name for batch upload
        files.forEach((file) => {
          formData.append('images', file);
        });

        try {
          const res = await api.post('/gallery/bulk', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          showNotification('success', `✅ ${res.data.data.count} gambar berhasil diupload sebagai satu batch dengan informasi yang sama!`);
          setShowModal(false);
          resetForm();
          fetchGallery();
        } catch (error) {
          showNotification('error', error.response?.data?.message || 'Gagal mengupload gambar');
        } finally {
          setSubmitting(false);
        }
      } else {
        // Single file mode
        if (!file) {
          showNotification('error', 'Pilih gambar terlebih dahulu');
          return;
        }

        setSubmitting(true);
        const formData = new FormData();
        Object.keys(form).forEach((key) => {
          if (form[key]) {
            formData.append(key, form[key]);
          }
        });
        formData.append('image', file);

        try {
          await api.post('/gallery', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          showNotification('success', 'Item galeri berhasil ditambahkan!');
          setShowModal(false);
          resetForm();
          fetchGallery();
        } catch (error) {
          showNotification('error', error.response?.data?.message || 'Gagal menyimpan item galeri');
        } finally {
          setSubmitting(false);
        }
      }
    }
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ title: '', description: '', category_id: '', alt_text: '' });
    setFile(null);
    setPreview(null);
    setFiles([]);
    setPreviews([]);
    setUploadMode('single');
  };

  const handleEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title || '',
      description: item.description || '',
      category_id: item.category_id || '',
      alt_text: item.alt_text || '',
    });
    if (item.image_path) {
      setPreview(getImageUrl(item.image_path));
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/gallery/${id}`);
      showNotification('success', 'Item galeri berhasil dihapus!');
      fetchGallery();
    } catch (error) {
      showNotification('error', 'Gagal menghapus item galeri');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Kelola Galeri</h2>
          <p className="text-gray-600 mt-1">Upload dan kelola foto/karya seni untuk ditampilkan di website</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <FiPlus size={20} />
          Upload Gambar
        </button>
      </div>

      {/* Search and Filter */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari gambar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-field md:w-48"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredGallery.length === 0 ? (
        <div className="card p-12 text-center">
          <FiImage className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500 mb-4">Belum ada gambar di galeri</p>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="btn-primary"
          >
            Upload Gambar Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredGallery.map((item) => (
            <div key={item.id} className="card overflow-hidden group relative">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={getImageUrl(item.image_path)}
                  alt={item.title || item.alt_text}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-1 line-clamp-1">{item.title || 'Tanpa Judul'}</h3>
                {item.category_name && (
                  <p className="text-xs text-gray-500 mb-2">{item.category_name}</p>
                )}
                <div className="flex gap-2">
                  <Tooltip content="Edit gambar">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 px-3 py-1.5 text-xs bg-primary-100 text-primary-700 rounded hover:bg-primary-200 transition-colors"
                    >
                      <FiEdit className="inline mr-1" size={12} />
                      Edit
                    </button>
                  </Tooltip>
                  <Tooltip content="Hapus gambar">
                    <button
                      onClick={() => setDeleteConfirm(item)}
                      className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      <FiTrash2 size={12} />
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {editing ? 'Edit Item Galeri' : 'Upload Gambar Baru'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Upload Mode Toggle */}
              {!editing && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mode Upload
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setUploadMode('single');
                        setFiles([]);
                        setPreviews([]);
                      }}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        uploadMode === 'single'
                          ? 'bg-primary-800 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Satu Gambar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadMode('multiple');
                        setFile(null);
                        setPreview(null);
                        setFiles([]);
                        setPreviews([]);
                        // Reset file input when switching to multiple mode
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        uploadMode === 'multiple'
                          ? 'bg-primary-800 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Banyak Gambar (Bulk Upload)
                    </button>
                  </div>
                </div>
              )}

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {uploadMode === 'multiple' ? 'Gambar (Maksimal 50)' : 'Gambar'} <span className="text-red-500">*</span>
                  <HelpBadge
                    title="Upload Gambar"
                    content={uploadMode === 'multiple' 
                      ? "Pilih banyak gambar sekaligus. Drag & drop atau klik untuk memilih. Format yang didukung: JPG, PNG, WebP. Ukuran maksimal: 5MB per gambar. Maksimal 50 gambar sekaligus."
                      : "Drag & drop gambar ke area ini atau klik untuk memilih file. Format yang didukung: JPG, PNG, WebP. Ukuran maksimal: 5MB."
                    }
                  />
                </label>
                <div
                  ref={dropRef}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {uploadMode === 'multiple' ? (
                    // Multiple files preview
                    previews.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {previews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview.url}
                                alt={preview.name}
                                className="w-full h-32 object-cover rounded-lg border"
                              />
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <FiX size={16} />
                              </button>
                              <p className="text-xs text-gray-600 mt-1 truncate" title={preview.name}>
                                {preview.name}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="pt-4 border-t">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-primary-800">
                              📦 Batch Upload: {previews.length} gambar akan diupload sebagai satu bagian
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 mb-3">
                            Semua gambar ini akan memiliki kategori, deskripsi, dan judul yang sama (dengan nomor urut)
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setFiles([]);
                              setPreviews([]);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Hapus Semua
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <FiUpload className="mx-auto text-gray-400 mb-3" size={32} />
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 5MB per gambar, Maksimal 50 gambar)</p>
                        <button
                          type="button"
                          onClick={() => {
                            // Ensure multiple attribute is set before opening file picker
                            if (fileInputRef.current) {
                              fileInputRef.current.setAttribute('multiple', 'multiple');
                              fileInputRef.current.click();
                            }
                          }}
                          className="mt-4 px-4 py-2 bg-primary-800 text-white rounded-lg hover:bg-primary-900 transition-colors"
                        >
                          Pilih Banyak File
                        </button>
                      </div>
                    )
                  ) : (
                    // Single file preview
                    preview ? (
                      <div className="relative inline-block">
                        <img
                          src={preview}
                          alt="Preview"
                          className="max-w-full max-h-64 object-contain rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFile(null);
                            setPreview(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <FiUpload className="mx-auto text-gray-400 mb-3" size={32} />
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 5MB)</p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-4 px-4 py-2 bg-primary-800 text-white rounded-lg hover:bg-primary-900 transition-colors"
                        >
                          Pilih File
                        </button>
                      </div>
                    )
                  )}
                </div>
                
                {/* File Input - Dynamic based on mode */}
                <input
                  key={uploadMode} // Force re-render when mode changes
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  {...(uploadMode === 'multiple' && { multiple: true })}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Batch Info - Show when multiple files selected */}
              {uploadMode === 'multiple' && files.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-5 mb-4 shadow-sm">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="bg-blue-600 rounded-lg p-2">
                      <FiImage className="text-white" size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-blue-900 mb-1">
                        📦 Batch Upload: {files.length} gambar sebagai satu bagian
                      </h4>
                      <p className="text-sm text-blue-700 leading-relaxed">
                        Semua {files.length} gambar yang Anda pilih akan di-upload sebagai <strong>satu batch</strong> dengan informasi yang sama:
                      </p>
                      <ul className="text-sm text-blue-700 mt-2 space-y-1 ml-4">
                        <li>• <strong>Kategori sama</strong> untuk semua gambar</li>
                        <li>• <strong>Deskripsi sama</strong> untuk semua gambar</li>
                        <li>• <strong>Judul dengan nomor urut</strong> (contoh: "Foto Kegiatan 1", "Foto Kegiatan 2", dst)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {uploadMode === 'multiple' 
                    ? 'Judul (Akan ditambahkan nomor urut untuk setiap gambar)' 
                    : 'Judul'}
                  <HelpBadge
                    title={uploadMode === 'multiple' ? "Judul untuk Semua Gambar" : "Judul Gambar"}
                    content={uploadMode === 'multiple' 
                      ? "Judul ini akan digunakan untuk semua gambar dalam batch ini dengan nomor urut (contoh: 'Foto Kegiatan 1', 'Foto Kegiatan 2', dst). Kosongkan untuk menggunakan nama file."
                      : "Berikan judul yang deskriptif untuk gambar. Judul akan membantu pengunjung memahami isi gambar."
                    }
                  />
                </label>
                <input
                  type="text"
                  placeholder={uploadMode === 'multiple' ? 'Contoh: Foto Kegiatan (akan menjadi: Foto Kegiatan 1, Foto Kegiatan 2, ...)' : 'Contoh: Pameran Seni Rupa 2024'}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="input-field"
                />
              </div>

              {/* Description - Show for both modes but especially important for multiple */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi
                  {uploadMode === 'multiple' && (
                    <span className="text-xs text-gray-500 ml-2">(Akan digunakan untuk semua gambar dalam batch ini)</span>
                  )}
                </label>
                <textarea
                  placeholder={uploadMode === 'multiple' 
                    ? 'Deskripsi yang akan digunakan untuk semua gambar dalam batch ini...'
                    : 'Deskripsi singkat tentang gambar...'}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-field"
                  rows={uploadMode === 'multiple' ? 4 : 3}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kategori
                  {uploadMode === 'multiple' && files.length > 0 && (
                    <span className="inline-flex items-center ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      📦 Akan digunakan untuk semua {files.length} gambar
                    </span>
                  )}
                </label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="input-field"
                >
                  <option value="">Pilih Kategori (Opsional)</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {uploadMode === 'multiple' && files.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Kategori yang dipilih akan diterapkan ke semua gambar dalam batch
                  </p>
                )}
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Alt Text (untuk SEO)
                  <HelpBadge
                    title="Alt Text"
                    content="Deskripsi singkat untuk aksesibilitas dan SEO. Penting untuk pengunjung yang menggunakan screen reader."
                  />
                </label>
                <input
                  type="text"
                  placeholder="Deskripsi singkat gambar"
                  value={form.alt_text}
                  onChange={(e) => setForm({ ...form, alt_text: e.target.value })}
                  className="input-field"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="btn-outline flex-1"
                  disabled={submitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={submitting || (uploadMode === 'single' && !file && !editing) || (uploadMode === 'multiple' && files.length === 0)}
                >
                  {submitting 
                    ? 'Menyimpan...' 
                    : editing 
                      ? 'Perbarui' 
                      : uploadMode === 'multiple'
                        ? `Upload ${files.length} Gambar`
                        : 'Upload Gambar'
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <ConfirmDialog
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleDelete(deleteConfirm.id)}
          title="Hapus Gambar?"
          message={`Apakah Anda yakin ingin menghapus gambar "${deleteConfirm.title || 'ini'}"? Tindakan ini tidak dapat dibatalkan.`}
          confirmText="Ya, Hapus"
          cancelText="Batal"
          type="danger"
        />
      )}

      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default AdminGallery;
