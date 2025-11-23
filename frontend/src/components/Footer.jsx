import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Footer = () => {
  const [socialMedia, setSocialMedia] = useState([]);

  useEffect(() => {
    api.get('/social-media')
      .then(res => setSocialMedia(res.data.data))
      .catch(() => {});
  }, []);

  return (
    <footer className="text-white relative overflow-hidden border-t border-white/20" style={{ backgroundColor: '#0a1628' }}>
      <div className="container mx-auto px-4 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="mb-4">
              <img 
                src="/images/logo-isi.png" 
                alt="Logo ISI Yogyakarta"
                className="h-12 w-auto object-contain mb-3"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <h3 className="text-xl font-display font-bold mb-4 text-gold">BEM FSRD ISI Yogyakarta</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Badan Eksekutif Mahasiswa FSRD Institut Seni Indonesia Yogyakarta
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-gold">Tautan Cepat</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/tentang-kami" className="text-gray-300 hover:text-gold transition-colors duration-200 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-gold mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link to="/program-kerja" className="text-gray-300 hover:text-gold transition-colors duration-200 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-gold mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  Program Kerja
                </Link>
              </li>
              <li>
                <Link to="/berita" className="text-gray-300 hover:text-gold transition-colors duration-200 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-gold mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  Berita
                </Link>
              </li>
              <li>
                <Link to="/galeri" className="text-gray-300 hover:text-gold transition-colors duration-200 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-gold mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  Galeri
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4 text-gold">Kontak</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mr-2 mt-1 text-gold"></i>
                <span>Institut Seni Indonesia<br />Yogyakarta, Indonesia</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-2 text-gold"></i>
                <a href="mailto:bem@isi.ac.id" className="hover:text-gold transition-colors">bem@isi.ac.id</a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4 text-gold">Media Sosial</h4>
            <div className="flex space-x-4">
              {socialMedia.map((sm) => (
                <a
                  key={sm.id}
                  href={sm.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-gold rounded-lg text-gray-300 hover:text-white transition-all duration-200 transform hover:scale-110 hover:rotate-6"
                  aria-label={sm.platform}
                >
                  <i className={`fab fa-${sm.icon}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-800/50 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} BEM FSRD Institut Seni Indonesia Yogyakarta. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

