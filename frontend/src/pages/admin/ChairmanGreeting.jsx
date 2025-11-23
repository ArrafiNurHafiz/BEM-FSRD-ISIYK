import React, { useState, useEffect } from 'react';
import { FiSave, FiUser, FiFileText, FiTrash2 } from 'react-icons/fi';
import api from '../../services/api';
import Notification from '../../components/admin/Notification';
import { getImageUrl } from '../../utils/imageUrl';

const AdminChairmanGreeting = () => {
  const [greeting, setGreeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [form, setForm] = useState({
    name: '',
    position: 'Ketua BEM FSRD ISI Yogyakarta',
    greeting: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchGreeting();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchGreeting = async () => {
    try {
      const res = await api.get('/chairman-greeting');
      if (res.data.success && res.data.data) {
        const data = res.data.data;
        setGreeting(data);
        setForm({
          name: data.name || '',
          position: data.position || 'Ketua BEM FSRD ISI Yogyakarta',
          greeting: data.greeting || '',
        });
        if (data.photo) {
          setPhotoPreview(getImageUrl(data.photo));
        }
        if (data.signature) {
          setSignaturePreview(getImageUrl(data.signature));
        }
      }
    } catch (error) {
      console.error('Error fetching greeting:', error);
      showNotification('error', 'Gagal memuat data sambutan');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setPhotoFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSignatureChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setSignatureFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('position', form.position);
    formData.append('greeting', form.greeting);
    if (photoFile) {
      formData.append('photo', photoFile);
    }
    if (signatureFile) {
      formData.append('signature', signatureFile);
    }

    try {
      await api.post('/chairman-greeting', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showNotification('success', 'Sambutan ketua BEM berhasil disimpan!');
      fetchGreeting();
      setPhotoFile(null);
      setSignatureFile(null);
    } catch (error) {
      console.error('Error saving greeting:', error);
      showNotification('error', 'Gagal menyimpan sambutan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!greeting) return;

    setDeleting(true);
    try {
      await api.delete('/chairman-greeting');
      showNotification('success', 'Sambutan ketua BEM berhasil dihapus!');
      setGreeting(null);
      setForm({
        name: '',
        position: 'Ketua BEM FSRD ISI Yogyakarta',
        greeting: '',
      });
      setPhotoPreview(null);
      setSignaturePreview(null);
      setPhotoFile(null);
      setSignatureFile(null);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting greeting:', error);
      showNotification('error', 'Gagal menghapus sambutan');
    } finally {
      setDeleting(false);
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
      <Notification notification={notification} onClose={() => setNotification(null)} />

      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Sambutan Ketua BEM</h2>
        <p className="text-gray-600 mt-1">Kelola sambutan ketua BEM yang ditampilkan di beranda</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto Ketua BEM
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="input-field"
            />
            {photoPreview && (
              <div className="mt-4">
                <img
                  src={photoPreview}
                  alt="Foto Ketua BEM"
                  className="w-48 h-48 object-cover rounded-lg shadow"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Ketua BEM <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
              placeholder="Masukkan nama ketua BEM"
              required
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jabatan
            </label>
            <input
              type="text"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              className="input-field"
                    placeholder="Ketua BEM FSRD ISI Yogyakarta"
            />
          </div>

          {/* Greeting */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sambutan <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.greeting}
              onChange={(e) => setForm({ ...form, greeting: e.target.value })}
              className="input-field"
              rows={12}
              required
              placeholder="Masukkan sambutan ketua BEM..."
            />
            <p className="text-xs text-gray-500 mt-1">
              HTML diperbolehkan untuk formatting (misalnya: &lt;p&gt;, &lt;br&gt;, &lt;strong&gt;, dll)
            </p>
          </div>

          {/* Signature */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanda Tangan (Opsional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleSignatureChange}
              className="input-field"
            />
            {signaturePreview && (
              <div className="mt-4">
                <img
                  src={signaturePreview}
                  alt="Tanda Tangan"
                  className="h-24 w-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <FiSave />
              {saving ? 'Menyimpan...' : 'Simpan Sambutan'}
            </button>
            {greeting && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={deleting}
                className="btn-outline flex items-center justify-center gap-2 px-6 text-red-600 border-red-300 hover:bg-red-50"
              >
                <FiTrash2 />
                Hapus
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Preview Info */}
      {greeting && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <FiFileText className="inline mr-2" />
            Sambutan akan ditampilkan di halaman beranda setelah disimpan.
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Konfirmasi Hapus</h3>
            <p className="text-gray-700 mb-6">
              Apakah Anda yakin ingin menghapus sambutan ketua BEM? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="btn-outline flex-1"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiTrash2 />
                {deleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChairmanGreeting;

