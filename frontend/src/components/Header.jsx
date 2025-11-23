import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiSearch } from 'react-icons/fi';
import api from '../services/api';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [socialMedia, setSocialMedia] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/social-media')
      .then(res => setSocialMedia(res.data.data))
      .catch(() => {});
  }, []);

  // Auto-hide header on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show header at the top
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else {
        // Hide when scrolling down, show when scrolling up
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY) {
          setIsVisible(true);
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/berita?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header 
      className={`shadow-2xl fixed top-0 left-0 right-0 z-50 border-b border-gray-700/30 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{ backgroundColor: '#0a1628' }}
    >
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="flex items-center justify-center">
                <img 
                  src="/images/logo-isi.png" 
                  alt="Logo ISI Yogyakarta"
                  className="h-14 md:h-16 w-auto object-contain group-hover:opacity-90 transition-opacity"
                  onError={(e) => {
                    // Fallback jika gambar tidak bisa dimuat
                    e.target.style.display = 'none';
                    const fallback = e.target.nextElementSibling;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="w-14 h-14 bg-gray-800 border border-gray-700 rounded-lg hidden items-center justify-center shadow-lg">
                  <span className="text-gold font-bold text-lg">ISI</span>
                </div>
              </div>
              <div className="hidden md:block border-l border-gray-700 pl-3">
                <h1 className="text-base font-bold text-gray-100 group-hover:text-gold transition-colors leading-tight">
                  BEM FSRD ISI Yogyakarta
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">Institut Seni Indonesia Yogyakarta</p>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {socialMedia.map((sm) => (
              <a
                key={sm.id}
                href={sm.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold transition-colors"
                aria-label={sm.platform}
              >
                <i className={`fab fa-${sm.icon}`}></i>
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center justify-between py-4">
          <button
            className="md:hidden text-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          <ul
            className={`${
              isMenuOpen ? 'block' : 'hidden'
            } md:flex md:items-center md:space-x-6 absolute md:static top-full left-0 right-0 bg-gray-900/95 backdrop-blur-md md:bg-transparent shadow-lg md:shadow-none p-4 md:p-0 z-50`}
          >
            <li>
              <Link
                to="/"
                className="block py-2 px-3 text-gray-300 hover:text-gold hover:bg-gray-800/50 rounded-lg font-medium transition-all duration-200 relative group"
                onClick={() => setIsMenuOpen(false)}
              >
                Beranda
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
            <li>
              <Link
                to="/tentang-kami"
                className="block py-2 px-3 text-gray-300 hover:text-gold hover:bg-gray-800/50 rounded-lg font-medium transition-all duration-200 relative group"
                onClick={() => setIsMenuOpen(false)}
              >
                Tentang Kami
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
            <li>
              <Link
                to="/program-kerja"
                className="block py-2 px-3 text-gray-300 hover:text-gold hover:bg-gray-800/50 rounded-lg font-medium transition-all duration-200 relative group"
                onClick={() => setIsMenuOpen(false)}
              >
                Program Kerja
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
            <li>
              <Link
                to="/berita"
                className="block py-2 px-3 text-gray-300 hover:text-gold hover:bg-gray-800/50 rounded-lg font-medium transition-all duration-200 relative group"
                onClick={() => setIsMenuOpen(false)}
              >
                Berita
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
            <li>
              <Link
                to="/galeri"
                className="block py-2 px-3 text-gray-300 hover:text-gold hover:bg-gray-800/50 rounded-lg font-medium transition-all duration-200 relative group"
                onClick={() => setIsMenuOpen(false)}
              >
                Galeri
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
            <li>
              <Link
                to="/kalender-kegiatan"
                className="block py-2 px-3 text-gray-300 hover:text-gold hover:bg-gray-800/50 rounded-lg font-medium transition-all duration-200 relative group"
                onClick={() => setIsMenuOpen(false)}
              >
                Kalender
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
            <li>
              <Link
                to="/kontak"
                className="block py-2 px-3 text-gray-300 hover:text-gold hover:bg-gray-800/50 rounded-lg font-medium transition-all duration-200 relative group"
                onClick={() => setIsMenuOpen(false)}
              >
                Kontak
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
          </ul>

          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Cari..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 pl-10 bg-gray-800/50 border border-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold/50 transition-all duration-200 w-48 placeholder:text-gray-500"
              />
              <FiSearch className="absolute left-3 text-gray-400" />
            </div>
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-gradient-to-r from-gold to-gold-dark text-gray-900 rounded-lg hover:from-gold-dark hover:to-gold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <FiSearch />
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
};

export default Header;

