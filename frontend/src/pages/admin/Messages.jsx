import React, { useState, useEffect } from 'react';
import { FiTrash2, FiMail } from 'react-icons/fi';
import api from '../../services/api';
import Notification from '../../components/admin/Notification';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('unread');
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/contact?status=${filter}`);
      setMessages(res.data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      showNotification('error', 'Gagal memuat pesan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/contact/${id}/status`, { status });
      showNotification('success', 'Status pesan berhasil diperbarui.');
      fetchMessages();
    } catch (error) {
      console.error('Error updating message status:', error);
      showNotification('error', 'Gagal mengupdate status pesan.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus pesan ini?')) return;
    try {
      await api.delete(`/contact/${id}`);
      showNotification('success', 'Pesan berhasil dihapus.');
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      showNotification('error', 'Gagal menghapus pesan.');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Pesan Kontak</h2>
          <p className="text-sm text-gray-600 mt-1">Kelola pesan dari form kontak pengunjung</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'unread' ? 'bg-primary-800 text-white' : 'bg-gray-200'
            }`}
          >
            Belum Dibaca
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'read' ? 'bg-primary-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Sudah Dibaca
          </button>
          <button
            onClick={() => setFilter('replied')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'replied' ? 'bg-primary-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Terbalas
          </button>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="card p-12 text-center">
          <FiMail className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 text-lg">
            {filter === 'unread' 
              ? 'Tidak ada pesan baru' 
              : filter === 'read'
              ? 'Tidak ada pesan yang sudah dibaca'
              : 'Tidak ada pesan yang sudah dibalas'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
          <div key={message.id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-gray-800">{message.name}</h4>
                <p className="text-sm text-gray-500">{message.email}</p>
                {message.subject && (
                  <p className="text-sm font-semibold mt-2 text-gray-700">{message.subject}</p>
                )}
              </div>
              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  message.status === 'unread'
                    ? 'bg-yellow-100 text-yellow-800'
                    : message.status === 'replied'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.status === 'unread' 
                  ? 'Belum Dibaca' 
                  : message.status === 'replied'
                  ? 'Terbalas'
                  : 'Sudah Dibaca'}
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {new Date(message.created_at).toLocaleString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <div className="flex gap-2">
              {message.status === 'unread' && (
                <button
                  onClick={() => handleStatusChange(message.id, 'read')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 transition-colors"
                >
                  <FiMail className="mr-1" /> Tandai Dibaca
                </button>
              )}
              <button
                onClick={() => handleDelete(message.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2 transition-colors"
              >
                <FiTrash2 className="mr-1" /> Hapus
              </button>
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

export default AdminMessages;

