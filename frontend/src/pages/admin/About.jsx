import React, { useState, useEffect } from 'react';
import { FiEdit, FiSave, FiX } from 'react-icons/fi';
import api from '../../services/api';
import Notification from '../../components/admin/Notification';
import { getImageUrl } from '../../utils/imageUrl';

const AdminAbout = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [notification, setNotification] = useState(null);
  const [form, setForm] = useState({
    section_type: '',
    title: '',
    content: '',
    order_index: 0,
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchSections = async () => {
    try {
      const res = await api.get('/about');
      setSections(res.data.data || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
      showNotification('error', 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section) => {
    setEditing(section);
    setForm({
      section_type: section.section_type,
      title: section.title || '',
      content: section.content || '',
      order_index: section.order_index || 0,
    });
    if (section.image) {
      setPreview(getImageUrl(section.image));
    } else {
      setPreview(null);
    }
    setFile(null);
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({
      section_type: '',
      title: '',
      content: '',
      order_index: 0,
    });
    setFile(null);
    setPreview(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('section_type', form.section_type);
    formData.append('title', form.title);
    formData.append('content', form.content);
    formData.append('order_index', form.order_index);
    if (file) {
      formData.append('image', file);
    }

    try {
      await api.post('/about', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showNotification('success', editing ? 'Section berhasil diperbarui!' : 'Section berhasil ditambahkan!');
      handleCancel();
      fetchSections();
    } catch (error) {
      console.error('Error saving section:', error);
      showNotification('error', 'Gagal menyimpan section');
    }
  };

  const sectionTypes = [
    { value: 'history', label: 'Sejarah', icon: '📜' },
    { value: 'vision', label: 'Visi', icon: '🎯' },
    { value: 'mission', label: 'Misi', icon: '🎯' },
    { value: 'structure', label: 'Struktur', icon: '🏛️' },
  ];

  const getSectionLabel = (type) => {
    return sectionTypes.find(st => st.value === type)?.label || type;
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
      <Notification notification={notification} onClose={() => setNotification(null)} />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Kelola Halaman Tentang Kami</h2>
          <p className="text-gray-600 mt-1">Kelola sejarah, visi, misi, dan struktur organisasi</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing({ id: null, section_type: '', title: '', content: '', order_index: 0 })}
            className="btn-primary flex items-center gap-2"
          >
            <FiEdit />
            Tambah Section
          </button>
        )}
      </div>

      {/* Form */}
      {editing && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">
              {editing.id ? 'Edit Section' : 'Tambah Section Baru'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipe Section <span className="text-red-500">*</span>
              </label>
              <select
                value={form.section_type}
                onChange={(e) => setForm({ ...form, section_type: e.target.value })}
                className="input-field"
                required
                disabled={!!editing.id}
              >
                <option value="">Pilih Tipe Section</option>
                {sectionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Judul (Opsional)
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input-field"
                placeholder="Masukkan judul section"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Konten <span className="text-red-500">*</span>
                {(form.section_type === 'vision' || form.section_type === 'mission') && (
                  <span className="ml-2 text-xs text-gray-500 font-normal">
                    (Gunakan HTML untuk format daftar)
                  </span>
                )}
              </label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="input-field font-mono text-sm"
                rows={(form.section_type === 'vision' || form.section_type === 'mission') ? 8 : 10}
                required
                placeholder={
                  (form.section_type === 'vision' || form.section_type === 'mission')
                    ? 'Contoh: <ul><li>Visi 1</li><li>Visi 2</li></ul>'
                    : 'Masukkan konten section (HTML diperbolehkan)'
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                HTML diperbolehkan untuk formatting (misalnya: &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;p&gt;, dll)
                {(form.section_type === 'vision' || form.section_type === 'mission') && (
                  <span className="block mt-1">
                    Contoh untuk daftar: <code className="bg-gray-100 px-1 rounded">&lt;ul&gt;&lt;li&gt;Item 1&lt;/li&gt;&lt;li&gt;Item 2&lt;/li&gt;&lt;/ul&gt;</code>
                  </span>
                )}
              </p>
            </div>

            {form.section_type === 'history' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gambar (Opsional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="input-field"
                />
                {preview && (
                  <div className="mt-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full max-w-md h-64 object-cover rounded-lg shadow"
                    />
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urutan
              </label>
              <input
                type="number"
                value={form.order_index}
                onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })}
                className="input-field w-32"
                min="0"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={handleCancel} className="btn-outline flex-1">
                Batal
              </button>
              <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                <FiSave />
                {editing.id ? 'Perbarui Section' : 'Simpan Section'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sections List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Daftar Sections</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {sections.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>Belum ada section. Klik "Tambah Section" untuk menambahkan.</p>
            </div>
          ) : (
            sections.map((section) => (
              <div key={section.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-semibold">
                        {getSectionLabel(section.section_type)}
                      </span>
                      {section.title && (
                        <h4 className="text-lg font-semibold text-gray-900">{section.title}</h4>
                      )}
                    </div>
                    <div
                      className="text-gray-600 text-sm line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                    {section.image && (
                      <div className="mt-3">
                        <img
                          src={getImageUrl(section.image)}
                          alt={section.title || section.section_type}
                          className="w-32 h-32 object-cover rounded-lg shadow"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleEdit(section)}
                    className="ml-4 p-2 text-primary-800 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <FiEdit size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAbout;

