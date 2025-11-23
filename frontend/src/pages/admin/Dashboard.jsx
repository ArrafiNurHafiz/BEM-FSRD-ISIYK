import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiFileText, FiCalendar, FiImage, FiMessageSquare, FiMail, FiPlus, FiTrendingUp, FiClock, FiInfo, FiInbox } from 'react-icons/fi';
import api from '../../services/api';
import HelpBadge from '../../components/admin/HelpBadge';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    news: 0,
    events: 0,
    gallery: 0,
    comments: 0,
    messages: 0,
    aspirations: 0,
  });
  const [recentNews, setRecentNews] = useState([]);
  const [pendingComments, setPendingComments] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentData();
  }, []);

  const fetchStats = async () => {
    try {
      const [newsRes, eventsRes, galleryRes, messagesRes, aspirationsRes] = await Promise.all([
        api.get('/news?limit=1'),
        api.get('/events?limit=1'),
        api.get('/gallery?limit=1'),
        api.get('/contact?status=unread&limit=1'),
        api.get('/aspirations?status=unread&limit=1'),
      ]);

      setStats({
        news: newsRes.data.pagination?.total || newsRes.data.data?.length || 0,
        events: eventsRes.data.data?.length || 0,
        gallery: galleryRes.data.pagination?.total || galleryRes.data.data?.length || 0,
        comments: 0, // Will be fetched separately
        messages: messagesRes.data.pagination?.total || messagesRes.data.data?.length || 0,
        aspirations: aspirationsRes.data.pagination?.total || aspirationsRes.data.data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentData = async () => {
    try {
      const [newsRes] = await Promise.all([
        api.get('/news?limit=5'),
      ]);
      setRecentNews(newsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching recent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      label: 'Berita', 
      value: stats.news, 
      icon: FiFileText, 
      color: 'bg-blue-500', 
      link: '/admin/berita',
      help: 'Kelola berita dan artikel. Anda bisa menambah, mengedit, atau menghapus berita di sini.'
    },
    { 
      label: 'Kegiatan', 
      value: stats.events, 
      icon: FiCalendar, 
      color: 'bg-green-500', 
      link: '/admin/kegiatan',
      help: 'Kelola kalender kegiatan. Tambahkan event baru, edit jadwal, atau hapus kegiatan yang sudah selesai.'
    },
    { 
      label: 'Galeri', 
      value: stats.gallery, 
      icon: FiImage, 
      color: 'bg-purple-500', 
      link: '/admin/galeri',
      help: 'Upload dan kelola foto/karya seni. Drag & drop gambar untuk upload yang lebih mudah.'
    },
    { 
      label: 'Komentar', 
      value: pendingComments, 
      icon: FiMessageSquare, 
      color: 'bg-yellow-500', 
      link: '/admin/komentar',
      help: 'Moderasi komentar dari pengunjung. Approve komentar yang sesuai atau reject yang tidak pantas.'
    },
    { 
      label: 'Pesan', 
      value: stats.messages, 
      icon: FiMail, 
      color: 'bg-red-500', 
      link: '/admin/pesan',
      help: 'Lihat dan balas pesan dari form kontak. Pesan baru akan muncul di sini.'
    },
    { 
      label: 'Aspirasi', 
      value: stats.aspirations, 
      icon: FiInbox, 
      color: 'bg-purple-500', 
      link: '/admin/aspirasi',
      help: 'Kelola aspirasi, saran, dan masukan dari pengunjung. Aspirasi anonim juga akan muncul di sini.'
    },
  ];

  const quickActions = [
    { label: 'Tambah Berita Baru', icon: FiPlus, action: () => navigate('/admin/berita'), color: 'bg-blue-500' },
    { label: 'Tambah Kegiatan', icon: FiCalendar, action: () => navigate('/admin/kegiatan'), color: 'bg-green-500' },
    { label: 'Upload ke Galeri', icon: FiImage, action: () => navigate('/admin/galeri'), color: 'bg-purple-500' },
  ];

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Selamat datang! Kelola konten website Anda di sini.</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FiTrendingUp className="text-primary-800" />
          Aksi Cepat
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={action.action}
                className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-3`}
              >
                <Icon size={20} />
                <span className="font-medium">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Ringkasan Konten</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                to={card.link}
                className="card p-6 hover:shadow-lg transition-all hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <p className="text-gray-600 text-sm font-medium">{card.label}</p>
                    <HelpBadge title={card.label} content={card.help} />
                  </div>
                  <div className={`${card.color} p-3 rounded-lg text-white`}>
                    <Icon size={20} />
                  </div>
                </div>
                <p className="text-4xl font-bold text-primary-800">{card.value}</p>
                <p className="text-sm text-gray-500 mt-2">Klik untuk kelola →</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent News */}
      {recentNews.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FiClock className="text-primary-800" />
              Berita Terbaru
            </h3>
            <Link to="/admin/berita" className="text-primary-800 hover:text-primary-900 text-sm font-medium">
              Lihat Semua →
            </Link>
          </div>
          <div className="space-y-3">
            {recentNews.slice(0, 5).map((item) => (
              <Link
                key={item.id}
                to={`/admin/berita`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 line-clamp-1">{item.title}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(item.created_at).toLocaleDateString('id-ID')} • {item.category_name}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    item.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {item.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <FiInfo className="text-gold" />
          Tips untuk Pemula
        </h3>
        <ul className="space-y-2 text-blue-800 text-sm">
          <li>• Klik pada kartu statistik untuk langsung ke halaman kelola konten</li>
          <li>• Gunakan tombol "Aksi Cepat" di atas untuk menambah konten baru dengan cepat</li>
          <li>• Klik ikon <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-200 text-blue-600">?</span> untuk melihat panduan</li>
          <li>• Simpan sebagai "Draft" terlebih dahulu sebelum publish untuk review</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;

