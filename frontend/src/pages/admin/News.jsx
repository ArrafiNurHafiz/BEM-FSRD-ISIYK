import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiEye, FiEyeOff, FiSearch, FiX, FiUpload, FiImage } from 'react-icons/fi';
import api from '../../services/api';
import Notification from '../../components/admin/Notification';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import HelpBadge from '../../components/admin/HelpBadge';
import Tooltip from '../../components/admin/Tooltip';
import { getImageUrl } from '../../utils/imageUrl';

const AdminNews = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category_id: '',
    status: 'draft',
  });
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchNews();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterNews();
  }, [news, searchQuery, statusFilter]);

  const filterNews = () => {
    let filtered = [...news];

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category_name && item.category_name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredNews(filtered);
  };

  const fetchNews = async () => {
    try {
      // Admin can see all statuses (draft + published)
      const res = await api.get('/news?status=all&limit=1000');
      setNews(res.data.data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      // Don't show notification on initial load, just set empty array
      if (news.length > 0) {
        showNotification('error', 'Gagal memuat data berita. Silakan refresh halaman.');
      }
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories?type=news');
      setCategories(res.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Don't show notification for categories, just log
      // Categories are optional for news
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) {
        formData.append(key, form[key]);
      }
    });
    if (file) {
      formData.append('featured_image', file);
    }

    try {
      if (editing) {
        await api.put(`/news/${editing.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showNotification('success', 'Berita berhasil diperbarui!');
      } else {
        await api.post('/news', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showNotification('success', 'Berita berhasil ditambahkan!');
      }
      setShowModal(false);
      resetForm();
      fetchNews();
    } catch (error) {
      console.error('Error saving news:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Gagal menyimpan berita. Periksa koneksi dan coba lagi.';
      showNotification('error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ title: '', excerpt: '', content: '', category_id: '', status: 'draft' });
    setFile(null);
    setPreview(null);
  };

  const handleEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title,
      excerpt: item.excerpt || '',
      content: item.content,
      category_id: item.category_id || '',
      status: item.status,
    });
    if (item.featured_image) {
      setPreview(getImageUrl(item.featured_image));
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/news/${id}`);
      showNotification('success', 'Berita berhasil dihapus!');
      fetchNews();
    } catch (error) {
      showNotification('error', 'Gagal menghapus berita');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
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
          <h2 className="text-3xl font-bold text-gray-900">Kelola Berita</h2>
          <p className="text-gray-600 mt-1">Tambah, edit, atau hapus berita dan artikel</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <FiPlus size={20} />
          Tambah Berita Baru
        </button>
      </div>

      {/* Search and Filter */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field md:w-48"
          >
            <option value="all">Semua Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* News List */}
      <div className="card overflow-hidden">
        {filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada berita ditemukan</p>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="btn-primary mt-4"
            >
              Tambah Berita Pertama
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNews.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      {item.excerpt && (
                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">{item.excerpt}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.category_name || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          item.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.status === 'published' ? (
                          <span className="flex items-center gap-1">
                            <FiEye size={12} />
                            Published
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <FiEyeOff size={12} />
                            Draft
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip content="Edit berita">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <FiEdit size={18} />
                          </button>
                        </Tooltip>
                        <Tooltip content="Hapus berita">
                          <button
                            onClick={() => setDeleteConfirm(item)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-8 py-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold">
                {editing ? 'Edit Berita' : 'Tambah Berita Baru'}
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

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Judul Berita <span className="text-red-500">*</span>
                  <HelpBadge
                    title="Judul Berita"
                    content="Masukkan judul yang menarik dan deskriptif. Judul akan muncul di halaman beranda dan halaman detail berita."
                  />
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Pameran Seni Rupa Mahasiswa 2024"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ringkasan (Excerpt)
                  <HelpBadge
                    title="Ringkasan"
                    content="Ringkasan singkat berita yang akan muncul di halaman beranda. Usahakan maksimal 150 karakter."
                  />
                </label>
                <textarea
                  placeholder="Ringkasan singkat berita..."
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="input-field"
                  rows="3"
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">{form.excerpt.length}/200 karakter</p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kategori
                  <HelpBadge
                    title="Kategori"
                    content="Pilih kategori yang sesuai. Kategori membantu pengunjung menemukan berita terkait."
                  />
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
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gambar Utama
                  <HelpBadge
                    title="Gambar Utama"
                    content="Upload gambar yang menarik untuk berita. Ukuran disarankan: 1200x630px. Format: JPG, PNG, atau WebP."
                  />
                </label>
                <div className="space-y-4">
                  {preview && (
                    <div className="relative inline-block">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-w-full h-48 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setPreview(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  )}
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiUpload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Isi Berita <span className="text-red-500">*</span>
                  <HelpBadge
                    title="Isi Berita"
                    content="Tuliskan isi berita lengkap. Anda bisa menggunakan HTML untuk formatting. Tips: Gunakan tag <p> untuk paragraf, <strong> untuk teks tebal, <em> untuk teks miring."
                  />
                </label>
                <textarea
                  placeholder="<p>Paragraf pertama...</p><p>Paragraf kedua...</p>"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="input-field font-mono text-sm"
                  rows="12"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Gunakan HTML untuk formatting. Contoh: &lt;p&gt;teks&lt;/p&gt; untuk paragraf
                </p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                  <HelpBadge
                    title="Status"
                    content="Draft: Berita tersimpan tapi tidak ditampilkan ke publik. Published: Berita langsung tampil di website."
                  />
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="input-field"
                >
                  <option value="draft">💾 Draft (Simpan sebagai draft)</option>
                  <option value="published">🌐 Published (Tampilkan ke publik)</option>
                </select>
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
                  disabled={submitting}
                >
                  {submitting ? 'Menyimpan...' : editing ? 'Perbarui Berita' : 'Simpan Berita'}
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
          title="Hapus Berita?"
          message={`Apakah Anda yakin ingin menghapus berita "${deleteConfirm.title}"? Tindakan ini tidak dapat dibatalkan.`}
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

export default AdminNews;
