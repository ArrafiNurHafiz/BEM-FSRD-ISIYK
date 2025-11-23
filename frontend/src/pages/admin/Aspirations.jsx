import React, { useState, useEffect } from 'react';
import { FiTrash2, FiMessageSquare, FiUser, FiMail, FiEye } from 'react-icons/fi';
import api from '../../services/api';
import Notification from '../../components/admin/Notification';

const AdminAspirations = () => {
  const [aspirations, setAspirations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('unread');
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    fetchAspirations();
  }, [filter]);

  const fetchAspirations = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/aspirations?status=${filter}`);
      setAspirations(res.data.data || []);
    } catch (error) {
      console.error('Error fetching aspirations:', error);
      showNotification('error', 'Gagal memuat aspirasi. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/aspirations/${id}/status`, { status });
      showNotification('success', 'Status aspirasi berhasil diperbarui.');
      fetchAspirations();
    } catch (error) {
      console.error('Error updating aspiration status:', error);
      showNotification('error', 'Gagal mengupdate status aspirasi.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus aspirasi ini?')) return;
    try {
      await api.delete(`/aspirations/${id}`);
      showNotification('success', 'Aspirasi berhasil dihapus.');
      fetchAspirations();
    } catch (error) {
      console.error('Error deleting aspiration:', error);
      showNotification('error', 'Gagal menghapus aspirasi.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800 mx-auto"></div>
        <p className="mt-4 text-gray-600">Memuat aspirasi...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kotak Aspirasi</h2>
          <p className="text-sm text-gray-600 mt-1">Kelola aspirasi, saran, dan masukan dari pengunjung</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'unread' 
                ? 'bg-primary-800 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Belum Dibaca
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'read' 
                ? 'bg-primary-800 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Sudah Dibaca
          </button>
          <button
            onClick={() => setFilter('addressed')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'addressed' 
                ? 'bg-primary-800 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Ditindaklanjuti
          </button>
        </div>
      </div>

      {aspirations.length === 0 ? (
        <div className="card p-12 text-center">
          <FiMessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 text-lg">
            {filter === 'unread' 
              ? 'Tidak ada aspirasi baru' 
              : filter === 'read'
              ? 'Tidak ada aspirasi yang sudah dibaca'
              : 'Tidak ada aspirasi yang sudah ditindaklanjuti'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {aspirations.map((aspiration) => (
            <div key={aspiration.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* Anonymous Badge */}
                  {aspiration.is_anonymous ? (
                    <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      <FiMessageSquare size={14} />
                      <span>Anonim</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <FiUser size={16} className="text-gray-500" />
                        <h4 className="font-semibold text-gray-800">
                          {aspiration.name || 'Tidak ada nama'}
                        </h4>
                      </div>
                      {aspiration.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FiMail size={14} className="text-gray-400" />
                          <span>{aspiration.email}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    aspiration.status === 'unread'
                      ? 'bg-yellow-100 text-yellow-800'
                      : aspiration.status === 'addressed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {aspiration.status === 'unread' 
                    ? 'Belum Dibaca' 
                    : aspiration.status === 'addressed'
                    ? 'Ditindaklanjuti'
                    : 'Sudah Dibaca'}
                </span>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 whitespace-pre-wrap">{aspiration.message}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {new Date(aspiration.created_at).toLocaleString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <div className="flex gap-2">
                  {aspiration.status === 'unread' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(aspiration.id, 'read')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 transition-colors"
                      >
                        <FiEye className="mr-1" /> Tandai Dibaca
                      </button>
                      <button
                        onClick={() => handleStatusChange(aspiration.id, 'addressed')}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 transition-colors"
                      >
                        <FiMessageSquare className="mr-1" /> Tandai Ditindaklanjuti
                      </button>
                    </>
                  )}
                  {aspiration.status === 'read' && (
                    <button
                      onClick={() => handleStatusChange(aspiration.id, 'addressed')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 transition-colors"
                    >
                      <FiMessageSquare className="mr-1" /> Tandai Ditindaklanjuti
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(aspiration.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2 transition-colors"
                  >
                    <FiTrash2 className="mr-1" /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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

export default AdminAspirations;

