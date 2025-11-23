import React, { useState, useEffect, useRef } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiUpload, FiX, FiImage, FiArrowUp, FiArrowDown, FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../../services/api';
import Notification from '../../components/admin/Notification';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import HelpBadge from '../../components/admin/HelpBadge';
import { getImageUrl } from '../../utils/imageUrl';

const HeroSlider = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState(null);
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    link_url: '',
    link_text: 'Lihat Program',
    order_index: 0,
    is_active: true,
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const dropRef = useRef(null);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const res = await api.get('/hero-slider');
      setSliders(res.data.data || []);
    } catch (error) {
      showNotification('error', 'Gagal memuat hero slider');
    } finally {
      setLoading(false);
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile.type.startsWith('image/')) {
      showNotification('error', 'File harus berupa gambar');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      showNotification('error', 'Ukuran file maksimal 5MB');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !editing) {
      showNotification('error', 'Pilih gambar terlebih dahulu');
      return;
    }

    if (!form.title.trim()) {
      showNotification('error', 'Judul wajib diisi');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] !== null && form[key] !== undefined) {
        if (key === 'is_active') {
          formData.append(key, form[key] ? '1' : '0');
        } else {
          formData.append(key, form[key]);
        }
      }
    });
    if (file) {
      formData.append('image', file);
    }

    try {
      if (editing) {
        await api.put(`/hero-slider/${editing.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showNotification('success', 'Hero slider berhasil diperbarui!');
      } else {
        await api.post('/hero-slider', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showNotification('success', 'Hero slider berhasil ditambahkan!');
      }
      setShowModal(false);
      resetForm();
      fetchSliders();
    } catch (error) {
      showNotification('error', error.response?.data?.message || 'Gagal menyimpan hero slider');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditing(null);
    setForm({
      title: '',
      subtitle: '',
      link_url: '',
      link_text: 'Lihat Program',
      order_index: 0,
      is_active: true,
    });
    setFile(null);
    setPreview(null);
  };

  const handleEdit = (slider) => {
    setEditing(slider);
    setForm({
      title: slider.title || '',
      subtitle: slider.subtitle || '',
      link_url: slider.link_url || '',
      link_text: slider.link_text || 'Lihat Program',
      order_index: slider.order_index || 0,
      is_active: slider.is_active !== undefined ? slider.is_active : true,
    });
    if (slider.image_path) {
      setPreview(getImageUrl(slider.image_path));
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/hero-slider/${id}`);
      showNotification('success', 'Hero slider berhasil dihapus!');
      fetchSliders();
    } catch (error) {
      showNotification('error', error.response?.data?.message || 'Gagal menghapus hero slider');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleToggleActive = async (slider) => {
    try {
      const formData = new FormData();
      Object.keys(slider).forEach((key) => {
        if (slider[key] !== null && slider[key] !== undefined) {
          if (key === 'is_active') {
            formData.append(key, !slider.is_active ? '1' : '0');
          } else if (key !== 'image_path') {
            formData.append(key, slider[key]);
          }
        }
      });
      
      await api.put(`/hero-slider/${slider.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showNotification('success', `Hero slider ${!slider.is_active ? 'diaktifkan' : 'dinonaktifkan'}!`);
      fetchSliders();
    } catch (error) {
      showNotification('error', error.response?.data?.message || 'Gagal mengubah status');
    }
  };

  const handleOrderChange = async (slider, direction) => {
    const currentIndex = slider.order_index || 0;
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    try {
      const formData = new FormData();
      Object.keys(slider).forEach((key) => {
        if (slider[key] !== null && slider[key] !== undefined) {
          if (key === 'order_index') {
            formData.append(key, newIndex);
          } else if (key === 'is_active') {
            formData.append(key, slider[key] ? '1' : '0');
          } else if (key !== 'image_path') {
            formData.append(key, slider[key]);
          }
        }
      });
      
      await api.put(`/hero-slider/${slider.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchSliders();
    } catch (error) {
      showNotification('error', error.response?.data?.message || 'Gagal mengubah urutan');
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
      <Notification notification={notification} />
      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Hapus Hero Slider"
        message="Apakah Anda yakin ingin menghapus hero slider ini? Tindakan ini tidak dapat dibatalkan."
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Hero Slider</h2>
          <p className="text-gray-600 mt-1">
            Kelola gambar latar belakang hero slider di halaman beranda
            <HelpBadge
              title="Hero Slider"
              content="Hero slider adalah gambar besar yang ditampilkan di bagian atas halaman beranda. Anda dapat menambahkan beberapa slide dengan gambar, judul, dan tombol link."
            />
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus /> Tambah Slide
        </button>
      </div>

      {/* Sliders List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gambar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Judul
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subtitle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Urutan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sliders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <FiImage className="mx-auto text-4xl mb-4 text-gray-300" />
                    <p>Belum ada hero slider</p>
                    <p className="text-sm mt-2">Klik "Tambah Slide" untuk menambahkan slide baru</p>
                  </td>
                </tr>
              ) : (
                sliders.map((slider) => (
                  <tr key={slider.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-16 w-24 rounded overflow-hidden bg-gray-100">
                        {slider.image_path && (
                          <img
                            src={getImageUrl(slider.image_path)}
                            alt={slider.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{slider.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{slider.subtitle || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOrderChange(slider, 'up')}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Pindah ke atas"
                        >
                          <FiArrowUp size={16} />
                        </button>
                        <span className="text-sm text-gray-600">{slider.order_index || 0}</span>
                        <button
                          onClick={() => handleOrderChange(slider, 'down')}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Pindah ke bawah"
                        >
                          <FiArrowDown size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(slider)}
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          slider.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {slider.is_active ? <FiEye size={14} /> : <FiEyeOff size={14} />}
                        {slider.is_active ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(slider)}
                          className="text-primary-800 hover:text-primary-900 p-2 hover:bg-primary-50 rounded"
                          title="Edit"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(slider.id)}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded"
                          title="Hapus"
                        >
                          <FiTrash2 size={18} />
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {editing ? 'Edit Hero Slider' : 'Tambah Hero Slider'}
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
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gambar <span className="text-red-500">*</span>
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
                      : 'border-gray-300 hover:border-primary-400'
                  }`}
                >
                  {preview ? (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg mb-4"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setPreview(null);
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                      >
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <FiUpload className="mx-auto text-4xl text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2">
                        Drag & drop gambar di sini atau klik untuk memilih
                      </p>
                      <p className="text-sm text-gray-500">
                        Format: JPG, PNG, GIF, WEBP (Maks. 5MB)
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {!preview && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-4 btn-outline"
                    >
                      Pilih Gambar
                    </button>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="input-field"
                  placeholder="Contoh: Pameran Seni Rupa"
                  required
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="input-field"
                  placeholder="Contoh: Institut Seni Indonesia Yogyakarta"
                />
              </div>

              {/* Link URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link URL
                </label>
                <input
                  type="text"
                  value={form.link_url}
                  onChange={(e) => setForm({ ...form, link_url: e.target.value })}
                  className="input-field"
                  placeholder="Contoh: /program-kerja"
                />
              </div>

              {/* Link Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teks Tombol
                </label>
                <input
                  type="text"
                  value={form.link_text}
                  onChange={(e) => setForm({ ...form, link_text: e.target.value })}
                  className="input-field"
                  placeholder="Contoh: Lihat Program"
                />
              </div>

              {/* Order Index */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urutan Tampil
                </label>
                <input
                  type="number"
                  value={form.order_index}
                  onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })}
                  className="input-field"
                  min="0"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Angka lebih kecil akan ditampilkan lebih dulu
                </p>
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                  Aktifkan slide ini
                </label>
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
                >
                  Batal
                </button>
                <button type="submit" className="btn-primary flex-1" disabled={submitting}>
                  {submitting ? 'Menyimpan...' : editing ? 'Perbarui' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSlider;

