import React, { useState, useEffect } from 'react';
import { FiSave, FiFileText } from 'react-icons/fi';
import api from '../../services/api';
import Notification from '../../components/admin/Notification';

const AdminKabinetSasmita = () => {
  const [kabinetSasmita, setKabinetSasmita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [form, setForm] = useState({
    title: 'Mengenal Kabinet Sasmita',
    description: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchKabinetSasmita();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchKabinetSasmita = async () => {
    try {
      setLoading(true);
      const res = await api.get('/kabinet-sasmita');
      if (res.data.success && res.data.data) {
        const data = res.data.data;
        setKabinetSasmita(data);
        setForm({
          title: data.title || 'Mengenal Kabinet Sasmita',
          description: data.description || '',
        });
      } else {
        setKabinetSasmita(null);
        setForm({
          title: 'Mengenal Kabinet Sasmita',
          description: '',
        });
      }
    } catch (error) {
      console.error('Error fetching kabinet sasmita:', error);
      showNotification('error', 'Gagal memuat data deskripsi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.post('/kabinet-sasmita', form);
      showNotification('success', 'Deskripsi Kabinet Sasmita berhasil disimpan!');
      fetchKabinetSasmita();
    } catch (error) {
      console.error('Error saving kabinet sasmita:', error);
      showNotification('error', error.response?.data?.message || 'Gagal menyimpan deskripsi');
    } finally {
      setSaving(false);
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
        <h2 className="text-3xl font-bold text-gray-900">Deskripsi Kabinet Sasmita</h2>
        <p className="text-gray-600 mt-1">Kelola deskripsi Kabinet Sasmita yang ditampilkan di halaman Tentang Kami</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-field"
              placeholder="Mengenal Kabinet Sasmita"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field"
              rows={15}
              required
              placeholder="Masukkan deskripsi Kabinet Sasmita..."
            />
            <p className="text-xs text-gray-500 mt-1">
              HTML diperbolehkan untuk formatting (misalnya: &lt;p&gt;, &lt;br&gt;, &lt;strong&gt;, &lt;em&gt;, dll)
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <FiSave />
              {saving ? 'Menyimpan...' : 'Simpan Deskripsi'}
            </button>
          </div>
        </form>
      </div>

      {/* Preview Info */}
      {kabinetSasmita && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <FiFileText className="inline mr-2" />
            Deskripsi akan ditampilkan di halaman Tentang Kami setelah disimpan.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminKabinetSasmita;

