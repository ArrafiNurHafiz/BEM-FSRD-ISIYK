import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome,
  FiFileText,
  FiCalendar,
  FiImage,
  FiMessageSquare,
  FiMail,
  FiLogOut,
  FiMenu,
  FiX,
  FiUser,
  FiInfo,
  FiBook,
  FiInbox,
} from 'react-icons/fi';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: FiHome },
    { path: '/admin/hero-slider', label: 'Hero Slider', icon: FiImage },
    { path: '/admin/sambutan-ketua', label: 'Sambutan Ketua', icon: FiUser },
    { path: '/admin/kabinet-sasmita', label: 'Kabinet Sasmita', icon: FiBook },
    { path: '/admin/berita', label: 'Berita', icon: FiFileText },
    { path: '/admin/program-kerja', label: 'Program Kerja', icon: FiFileText },
    { path: '/admin/kegiatan', label: 'Kegiatan', icon: FiCalendar },
    { path: '/admin/galeri', label: 'Galeri', icon: FiImage },
    { path: '/admin/tentang-kami', label: 'Tentang Kami', icon: FiInfo },
    { path: '/admin/organisasi', label: 'Struktur Organisasi', icon: FiUser },
    { path: '/admin/komentar', label: 'Komentar', icon: FiMessageSquare },
    { path: '/admin/pesan', label: 'Pesan', icon: FiMail },
    { path: '/admin/aspirasi', label: 'Aspirasi', icon: FiInbox },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary-900 text-white transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 flex flex-col overflow-hidden`}
      >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 border-b border-primary-800 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <img 
              src="/images/logo-isi.png" 
              alt="Logo ISI Yogyakarta"
              className="h-8 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <h2 className="text-xl font-bold">Admin Panel</h2>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.3) transparent' }}>
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-800 text-white'
                        : 'text-gray-300 hover:bg-primary-800 hover:text-white'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer - Fixed */}
        <div className="p-4 border-t border-primary-800 bg-primary-900 flex-shrink-0">
          <div className="mb-4 px-4 py-2">
            <p className="text-sm text-gray-300">Logged in as</p>
            <p className="font-semibold text-white">{user?.full_name || user?.username || 'Administrator'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-primary-800 hover:text-white transition-colors"
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>

        {/* Custom Scrollbar Styling */}
        <style>{`
          aside nav::-webkit-scrollbar {
            width: 6px;
          }
          aside nav::-webkit-scrollbar-track {
            background: transparent;
          }
          aside nav::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.3);
            border-radius: 3px;
          }
          aside nav::-webkit-scrollbar-thumb:hover {
            background-color: rgba(255, 255, 255, 0.5);
          }
        `}</style>
      </aside>

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-700"
            >
              <FiMenu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-primary-800">
              {menuItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
            <div></div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 bg-white">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;

