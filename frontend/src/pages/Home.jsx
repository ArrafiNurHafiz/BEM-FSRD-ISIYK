import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FiCalendar, FiArrowRight, FiImage, FiBriefcase, FiFileText, FiGrid, FiMapPin } from 'react-icons/fi';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';
import ScrollAnimation from '../components/ScrollAnimation';
import FadeInOnScroll from '../components/FadeInOnScroll';
import StaggerAnimation from '../components/StaggerAnimation';
import HoverScale from '../components/HoverScale';
import SmoothParallax from '../components/SmoothParallax';

const Home = () => {
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [sliderImages, setSliderImages] = useState([]);
  const [chairmanGreeting, setChairmanGreeting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, eventsRes, programsRes, galleryRes, sliderRes, greetingRes] = await Promise.all([
          api.get('/news?limit=6'),
          api.get('/events?status=published&upcoming=true&limit=5'),
          api.get('/programs?limit=4'),
          api.get('/gallery?limit=8'),
          api.get('/hero-slider?active=true'),
          api.get('/chairman-greeting'),
        ]);

        setNews(newsRes.data.data);
        setEvents(eventsRes.data.data);
        setPrograms(programsRes.data.data);
        setGallery(galleryRes.data.data);
        setSliderImages(sliderRes.data.data || []);
        if (greetingRes.data.success && greetingRes.data.data) {
          setChairmanGreeting(greetingRes.data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: sliderImages.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: sliderImages.length > 1,
    autoplaySpeed: 5000,
    fade: true,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Slider - Enhanced */}
      {sliderImages.length > 0 ? (
        <section className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
          <Slider {...sliderSettings}>
            {sliderImages.map((item, index) => (
              <div key={item.id} className="relative h-[600px] md:h-[700px] lg:h-[800px]">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${getImageUrl(item.image_path)})`,
                    backgroundColor: '#1e3a8a',
                  }}
                >
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/80"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 via-transparent to-transparent"></div>
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                </div>
                
                {/* Content with glassmorphism */}
                <div className="relative h-full flex items-center justify-center text-white">
                  <div className="text-center px-4 max-w-5xl mx-auto">
                    {item.subtitle && (
                      <FadeInOnScroll direction="up" delay={100}>
                        <div className="inline-block mb-6 px-6 py-2 rounded-full backdrop-blur-md bg-white/10 border border-gray-700/30 shadow-lg">
                          <span className="text-gold text-sm md:text-base font-semibold tracking-wider uppercase">
                            {item.subtitle}
                          </span>
                        </div>
                      </FadeInOnScroll>
                    )}
                    <FadeInOnScroll direction="up" delay={200}>
                      <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 drop-shadow-2xl leading-tight bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent animate-gradient">
                        {item.title}
                      </h2>
                    </FadeInOnScroll>
                    {item.link_url && (
                      <FadeInOnScroll direction="up" delay={300}>
                        <Link 
                          to={item.link_url} 
                          className="group inline-block px-8 py-4 bg-gradient-to-r from-gold via-gold-dark to-gold text-white font-semibold rounded-full shadow-2xl hover:shadow-gold/50 transform hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-gold/30"
                        >
                          {item.link_text || 'Lihat Program'}
                          <FiArrowRight className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </FadeInOnScroll>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>
      ) : (
        <section className="relative h-[600px] md:h-[700px] overflow-hidden" style={{ backgroundColor: '#0a1628' }}>
          <div className="relative h-full flex items-center justify-center text-white">
            <div className="text-center px-4 max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-display font-bold mb-6 drop-shadow-2xl bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent">
                BEM FSRD ISI Yogyakarta
              </h2>
              <p className="text-xl md:text-2xl mb-8 text-gray-100 drop-shadow-lg">
                Institut Seni Indonesia Yogyakarta
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Divider Line */}
      <div className="relative py-12">
        <div className="absolute inset-x-0 top-1/2 h-[2px] bg-gradient-to-r from-transparent via-gold/60 to-transparent"></div>
        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-gray-700/60 to-transparent"></div>
      </div>

      {/* Chairman Greeting - Enhanced */}
      {chairmanGreeting && (
        <FadeInOnScroll direction="up" distance={40} delay={100}>
          <section className="py-24 relative overflow-hidden" style={{ backgroundColor: '#0a1628' }}>
            <div className="container mx-auto px-4 relative">
              <div className="max-w-5xl mx-auto">
                {/* Glassmorphism Card */}
                <div className="relative bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-700/30 overflow-hidden group hover:shadow-3xl transition-all duration-500">
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary-500/20 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="flex flex-col md:flex-row gap-8 items-start relative">
                    {/* Photo with elegant frame */}
                    {chairmanGreeting.photo && (
                      <div className="flex-shrink-0 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-gold to-primary-600 rounded-2xl transform rotate-3 opacity-20 group-hover:rotate-6 group-hover:opacity-30 transition-all duration-500"></div>
                        <div className="relative">
                          <img
                            src={getImageUrl(chairmanGreeting.photo)}
                            alt={chairmanGreeting.name}
                            className="w-56 h-56 md:w-64 md:h-64 object-cover rounded-2xl shadow-2xl border-4 border-gray-700 transform group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-12 bg-gradient-to-b from-gold via-gold-dark to-primary-600 rounded-full"></div>
                        <div>
                          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-100 mb-2">
                            Sambutan Ketua BEM
                          </h2>
                          <div className="w-24 h-1 bg-gradient-to-r from-gold via-gold-dark to-gold rounded-full"></div>
                        </div>
                      </div>
                      
                      <div
                        className="prose max-w-none text-gray-300 leading-relaxed mb-8 text-base md:text-lg"
                        dangerouslySetInnerHTML={{ __html: chairmanGreeting.greeting }}
                      />
                      
                      <div className="border-t border-gradient-to-r from-transparent via-gray-200 to-transparent pt-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-px h-12 bg-gradient-to-b from-transparent via-gold to-transparent"></div>
                            <div>
                              <p className="font-bold text-gray-100 text-lg md:text-xl">
                                {chairmanGreeting.name}
                              </p>
                              <p className="text-gray-400 text-sm md:text-base mt-1">
                                {chairmanGreeting.position}
                              </p>
                            </div>
                          </div>
                          {chairmanGreeting.signature && (
                            <div className="flex-shrink-0">
                              <div className="backdrop-blur-sm rounded-lg p-3 border border-gray-700/50 shadow-lg" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
                                <img
                                  src={getImageUrl(chairmanGreeting.signature)}
                                  alt="Tanda Tangan"
                                  className="h-16 w-auto object-contain filter drop-shadow-lg"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeInOnScroll>
      )}

      {/* Divider Line */}
      <div className="relative py-12">
        <div className="absolute inset-x-0 top-1/2 h-[2px] bg-gradient-to-r from-transparent via-gold/60 to-transparent"></div>
        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-gray-700/60 to-transparent"></div>
      </div>

      {/* Quick Links - Enhanced Design */}
      <FadeInOnScroll direction="up" distance={40} delay={100}>
        <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#0a1628' }}>
          <div className="container mx-auto px-4 relative">
            {/* Section Header */}
            <FadeInOnScroll direction="up" delay={150}>
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-100 mb-3">
                  Navigasi Cepat
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-gold via-gold-dark to-gold rounded-full mx-auto"></div>
                <p className="text-gray-400 mt-4 text-lg">Akses informasi penting dengan mudah</p>
              </div>
            </FadeInOnScroll>

            <StaggerAnimation staggerDelay={100} animation="fadeInUp">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {/* Program Kerja */}
                <Link
                  to="/program-kerja"
                  className="group relative rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-700/50 hover:border-primary-300/50 transform hover:-translate-y-2"
                  style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 via-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Icon Container */}
                  <div className="relative mb-6 flex justify-center">
                    <div className="relative">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-primary-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 group-hover:scale-150"></div>
                      {/* Icon background */}
                      <div className="relative p-5 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 shadow-xl">
                        <FiBriefcase className="text-4xl text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative text-center">
                    <h3 className="text-xl font-bold text-gray-100 group-hover:text-primary-900 transition-colors duration-300 mb-2">
                      Program Kerja
                    </h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      Lihat program dan kegiatan kami
                    </p>
                  </div>
                  
                  {/* Arrow indicator */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <FiArrowRight className="text-white text-sm" />
                    </div>
                  </div>
                </Link>

                {/* Berita */}
                <Link
                  to="/berita"
                  className="group relative rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-700/50 hover:border-blue-300/50 transform hover:-translate-y-2"
                  style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative mb-6 flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 group-hover:scale-150"></div>
                      <div className="relative p-5 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 shadow-xl">
                        <FiFileText className="text-4xl text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative text-center">
                    <h3 className="text-xl font-bold text-gray-100 group-hover:text-blue-700 transition-colors duration-300 mb-2">
                      Berita
                    </h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      Informasi terkini dari BEM
                    </p>
                  </div>
                  
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <FiArrowRight className="text-white text-sm" />
                    </div>
                  </div>
                </Link>

                {/* Galeri */}
                <Link
                  to="/galeri"
                  className="group relative rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-700/50 hover:border-purple-300/50 transform hover:-translate-y-2"
                  style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative mb-6 flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 group-hover:scale-150"></div>
                      <div className="relative p-5 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 shadow-xl">
                        <FiGrid className="text-4xl text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative text-center">
                    <h3 className="text-xl font-bold text-gray-100 group-hover:text-purple-700 transition-colors duration-300 mb-2">
                      Galeri
                    </h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      Dokumentasi kegiatan kami
                    </p>
                  </div>
                  
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <FiArrowRight className="text-white text-sm" />
                    </div>
                  </div>
                </Link>

                {/* Kalender */}
                <Link
                  to="/kalender-kegiatan"
                  className="group relative rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-700/50 hover:border-gold/50 transform hover:-translate-y-2"
                  style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-gold-light/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative mb-6 flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gold rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 group-hover:scale-150"></div>
                      <div className="relative p-5 bg-gradient-to-br from-gold to-gold-dark rounded-2xl transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 shadow-xl">
                        <FiCalendar className="text-4xl text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative text-center">
                    <h3 className="text-xl font-bold text-gray-100 group-hover:text-gold-dark transition-colors duration-300 mb-2">
                      Kalender
                    </h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      Jadwal kegiatan BEM
                    </p>
                  </div>
                  
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                      <FiArrowRight className="text-white text-sm" />
                    </div>
                  </div>
                </Link>
              </div>
            </StaggerAnimation>
          </div>
        </section>
      </FadeInOnScroll>

      {/* Divider Line */}
      <div className="relative py-12">
        <div className="absolute inset-x-0 top-1/2 h-[2px] bg-gradient-to-r from-transparent via-gold/60 to-transparent"></div>
        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-gray-700/60 to-transparent"></div>
      </div>

      {/* Latest News - Enhanced */}
      <FadeInOnScroll direction="up" distance={50} delay={100}>
        <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#0a1628' }}>
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-64 h-64 bg-gold rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <FadeInOnScroll direction="up" delay={200}>
              <div className="flex items-center justify-between mb-12">
                <div className="relative">
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-100 mb-3 relative inline-block">
                    Berita Terbaru
                    {/* Underline with glow effect */}
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-gold via-gold-dark to-gold rounded-full"></div>
                    <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gold rounded-full blur-md opacity-60"></div>
                  </h2>
                </div>
                <Link 
                  to="/berita" 
                  className="group relative px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 overflow-hidden"
                  style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}
                >
                  {/* Hover background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {/* Border */}
                  <div className="absolute inset-0 rounded-xl border border-gray-700/50 group-hover:border-gold/50 transition-colors duration-300"></div>
                  <span className="relative text-gray-100 group-hover:text-gold transition-colors duration-300">Lihat Semua</span>
                  <FiArrowRight className="relative text-gray-100 group-hover:text-gold transform group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              </div>
            </FadeInOnScroll>
            
            <StaggerAnimation staggerDelay={100} animation="fadeInUp">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.map((item, index) => (
                  <HoverScale scale={1.03} key={item.id}>
                    <Link 
                      to={`/berita/${item.slug}`} 
                      className="group relative rounded-2xl overflow-visible transition-all duration-500 transform hover:-translate-y-2"
                      style={{ 
                        backgroundColor: 'rgba(30, 41, 59, 0.95)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      {/* Outer frame - thick visible border */}
                      <div 
                        className="absolute -inset-[2px] rounded-2xl transition-all duration-500 z-0 pointer-events-none"
                        style={{
                          background: 'linear-gradient(135deg, rgba(148, 163, 184, 0.9) 0%, rgba(148, 163, 184, 0.7) 50%, rgba(148, 163, 184, 0.9) 100%)',
                          padding: '2px',
                          borderRadius: '1rem',
                          boxShadow: '0 0 15px rgba(148, 163, 184, 0.3)'
                        }}
                      >
                        <div 
                          className="w-full h-full rounded-2xl"
                          style={{
                            backgroundColor: 'rgba(30, 41, 59, 0.95)',
                            backdropFilter: 'blur(10px)',
                          }}
                        ></div>
                      </div>
                      
                      {/* Hover frame - gold border */}
                      <div 
                        className="absolute -inset-[2px] rounded-2xl transition-all duration-500 z-0 pointer-events-none opacity-0 group-hover:opacity-100"
                        style={{
                          background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.95) 0%, rgba(234, 179, 8, 0.8) 50%, rgba(234, 179, 8, 0.95) 100%)',
                          padding: '2px',
                          borderRadius: '1rem',
                          boxShadow: '0 0 25px rgba(234, 179, 8, 0.6), 0 0 50px rgba(234, 179, 8, 0.4)'
                        }}
                      >
                        <div 
                          className="w-full h-full rounded-2xl"
                          style={{
                            backgroundColor: 'rgba(30, 41, 59, 0.95)',
                            backdropFilter: 'blur(10px)',
                          }}
                        ></div>
                      </div>
                      
                      {/* Content wrapper */}
                      <div 
                        className="relative z-10 rounded-2xl overflow-hidden" 
                        style={{ 
                          backgroundColor: 'rgba(30, 41, 59, 0.95)',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                      
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/15 via-transparent to-primary-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                      
                      {/* Corner accent frames */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gold/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gold/30 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
                      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-gold/30 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
                      
                      {item.featured_image && (
                        <div className="h-64 overflow-hidden relative">
                          <img
                            src={getImageUrl(item.featured_image)}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              console.error('Image load error:', item.featured_image);
                              e.target.style.display = 'none';
                            }}
                          />
                          {/* Multi-layer gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          {/* Category badge - Enhanced */}
                          <div className="absolute top-4 left-4 backdrop-blur-md px-4 py-2 rounded-full shadow-xl border border-gold/30 overflow-hidden group-hover:border-gold/60 transition-all duration-300" style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)' }}>
                            <div className="absolute inset-0 bg-gradient-to-r from-gold/10 to-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative text-xs text-gold font-bold uppercase tracking-wider">
                              {item.category_name}
                            </span>
                          </div>
                          
                          {/* Shine effect on hover */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </div>
                      )}
                      
                      <div className="p-6 relative z-10">
                        {/* Top decorative accent line */}
                        <div className="absolute top-0 left-6 w-20 h-1 bg-gradient-to-r from-gold via-primary-500 to-transparent rounded-full opacity-80"></div>
                        
                        <h3 className="text-xl font-bold mt-4 mb-3 text-gray-100 group-hover:text-gold transition-colors duration-300 line-clamp-2 leading-tight">
                          {item.title}
                        </h3>
                        
                        <p className="text-gray-400 text-sm line-clamp-3 mb-5 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                          {item.excerpt}
                        </p>
                        
                        {/* Bottom section with date and arrow */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50 group-hover:border-gold/30 transition-colors duration-300">
                          <div className="flex items-center gap-2">
                            <FiCalendar className="text-gold/60 group-hover:text-gold transition-colors duration-300" size={14} />
                            <p className="text-xs text-gray-500 group-hover:text-gray-400 font-medium transition-colors duration-300">
                              {new Date(item.created_at).toLocaleDateString('id-ID', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                          {/* Arrow indicator */}
                          <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                            <div className="w-8 h-8 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center shadow-lg">
                              <FiArrowRight className="text-white" size={14} />
                            </div>
                          </div>
                        </div>
                      </div>
                      </div>
                    </Link>
                  </HoverScale>
                ))}
            </div>
          </StaggerAnimation>
        </div>
      </section>
      </FadeInOnScroll>

      {/* Divider Line - Berita Terbaru ke Kegiatan Mendatang */}
      <div className="relative py-12">
        <div className="absolute inset-x-0 top-1/2 h-[2px] bg-gradient-to-r from-transparent via-gold/60 to-transparent"></div>
        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-gray-700/60 to-transparent"></div>
      </div>

      {/* Upcoming Events - Enhanced */}
      <FadeInOnScroll direction="up" distance={50} delay={150}>
        <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#0a1628' }}>
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 right-10 w-64 h-64 bg-primary-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <FadeInOnScroll direction="up" delay={200}>
              <div className="flex items-center justify-between mb-12">
                <div className="relative">
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-100 mb-3 relative inline-block">
                    Kegiatan Mendatang
                    {/* Underline with glow effect */}
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-gold via-gold-dark to-gold rounded-full"></div>
                    <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gold rounded-full blur-md opacity-60"></div>
                  </h2>
                </div>
                <Link 
                  to="/kalender-kegiatan" 
                  className="group relative px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 overflow-hidden"
                  style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}
                >
                  {/* Hover background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {/* Border */}
                  <div className="absolute inset-0 rounded-xl border border-gray-700/50 group-hover:border-gold/50 transition-colors duration-300"></div>
                  <span className="relative text-gray-100 group-hover:text-gold transition-colors duration-300">Lihat Semua</span>
                  <FiArrowRight className="relative text-gray-100 group-hover:text-gold transform group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              </div>
            </FadeInOnScroll>
            
            <StaggerAnimation staggerDelay={120} animation="fadeInUp">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.length > 0 ? (
                  events.map((event) => (
                    <HoverScale scale={1.03} key={event.id}>
                      <div 
                        className="group relative rounded-2xl overflow-visible transition-all duration-500 transform hover:-translate-y-2" 
                        style={{ 
                          backgroundColor: 'rgba(30, 41, 59, 0.95)',
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        {/* Outer frame - thin visible border */}
                        <div 
                          className="absolute -inset-[1px] rounded-2xl transition-all duration-500 z-0 pointer-events-none"
                          style={{
                            background: 'linear-gradient(135deg, rgba(148, 163, 184, 0.9) 0%, rgba(148, 163, 184, 0.7) 50%, rgba(148, 163, 184, 0.9) 100%)',
                            padding: '1px',
                            borderRadius: '1rem',
                            boxShadow: '0 0 15px rgba(148, 163, 184, 0.3)'
                          }}
                        >
                          <div 
                            className="w-full h-full rounded-2xl"
                            style={{
                              backgroundColor: 'rgba(30, 41, 59, 0.95)',
                              backdropFilter: 'blur(10px)',
                            }}
                          ></div>
                        </div>
                        
                        {/* Hover frame - gold border */}
                        <div 
                          className="absolute -inset-[1px] rounded-2xl transition-all duration-500 z-0 pointer-events-none opacity-0 group-hover:opacity-100"
                          style={{
                            background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.95) 0%, rgba(234, 179, 8, 0.8) 50%, rgba(234, 179, 8, 0.95) 100%)',
                            padding: '1px',
                            borderRadius: '1rem',
                            boxShadow: '0 0 25px rgba(234, 179, 8, 0.6), 0 0 50px rgba(234, 179, 8, 0.4)'
                          }}
                        >
                          <div 
                            className="w-full h-full rounded-2xl"
                            style={{
                              backgroundColor: 'rgba(30, 41, 59, 0.95)',
                              backdropFilter: 'blur(10px)',
                            }}
                          ></div>
                        </div>
                        
                        {/* Content wrapper */}
                        <div 
                          className="relative z-10 rounded-2xl overflow-hidden" 
                          style={{ 
                            backgroundColor: 'rgba(30, 41, 59, 0.95)',
                            backdropFilter: 'blur(10px)',
                          }}
                        >
                        
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                        
                        {/* Corner accent frames */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
                        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gold/30 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
                        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-gold/30 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
                        
                        {event.image && (
                          <div className="h-64 overflow-hidden relative">
                            <img
                              src={getImageUrl(event.image)}
                              alt={event.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            {/* Multi-layer gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            {/* Upcoming badge - Enhanced */}
                            <div className="absolute top-4 right-4 backdrop-blur-md bg-gold/90 px-4 py-2 rounded-full shadow-xl border border-gold/50 overflow-hidden group-hover:border-gold/80 group-hover:bg-gold transition-all duration-300">
                              <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <span className="relative text-xs font-bold text-white uppercase tracking-wider">Upcoming</span>
                            </div>
                            
                            {/* Date overlay - Enhanced */}
                            <div className="absolute bottom-4 left-4 right-4 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg border border-gray-700/50 overflow-hidden group-hover:border-gold/30 transition-all duration-300" style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)' }}>
                              <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <div className="relative flex items-center gap-2">
                                <FiCalendar className="text-gold group-hover:scale-110 transition-transform duration-300" size={18} />
                                <span className="text-sm font-bold text-gray-100">
                                  {new Date(event.start_datetime).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  })}
                                </span>
                              </div>
                            </div>
                            
                            {/* Shine effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          </div>
                        )}
                        
                        <div className="p-6 relative z-10">
                          {/* Top decorative accent line */}
                          <div className="absolute top-0 left-6 w-20 h-1 bg-gradient-to-r from-primary-500 via-gold to-transparent rounded-full opacity-80"></div>
                          
                          <h3 className="text-xl font-bold mb-3 mt-4 text-gray-100 group-hover:text-gold transition-colors duration-300 line-clamp-2 leading-tight">
                            {event.title}
                          </h3>
                          
                          <p className="text-gray-400 text-sm line-clamp-3 mb-5 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                            {event.description}
                          </p>
                          
                          {event.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-300 px-4 py-3 rounded-xl border border-gray-700/50 group-hover:border-gold/30 transition-all duration-300 mb-4" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
                              <FiMapPin className="text-gold flex-shrink-0 group-hover:scale-110 transition-transform duration-300" size={18} />
                              <span className="font-semibold group-hover:text-gray-100 transition-colors duration-300">{event.location}</span>
                            </div>
                          )}
                          
                          {/* Bottom accent line */}
                          <div className="pt-4 border-t border-gray-700/50 group-hover:border-gold/30 transition-colors duration-300">
                            <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-gold rounded-full flex items-center justify-center shadow-lg">
                                <FiArrowRight className="text-white" size={14} />
                              </div>
                            </div>
                          </div>
                        </div>
                        </div>
                      </div>
                    </HoverScale>
                ))
              ) : (
                  <div className="col-span-full text-center py-16">
                    <div className="inline-block p-6 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-lg" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
                      <FiCalendar className="mx-auto text-6xl text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg font-semibold">Belum ada kegiatan mendatang</p>
                    </div>
                  </div>
                )}
              </div>
            </StaggerAnimation>
          </div>
        </section>
      </FadeInOnScroll>

      {/* Divider Line - Kegiatan Mendatang ke Program Kerja */}
      <div className="relative py-12">
        <div className="absolute inset-x-0 top-1/2 h-[2px] bg-gradient-to-r from-transparent via-gold/60 to-transparent"></div>
        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-gray-700/60 to-transparent"></div>
      </div>

      {/* Programs - Enhanced */}
      <FadeInOnScroll direction="up" distance={50} delay={150}>
        <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#0a1628' }}>
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-64 h-64 bg-primary-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <FadeInOnScroll direction="up" delay={200}>
              <div className="flex items-center justify-between mb-12">
                <div className="relative">
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-100 mb-3 relative inline-block">
                    Program Kerja
                    {/* Underline with glow effect */}
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-gold via-gold-dark to-gold rounded-full"></div>
                    <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gold rounded-full blur-md opacity-60"></div>
                  </h2>
                </div>
                <Link 
                  to="/program-kerja" 
                  className="group relative px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 overflow-hidden"
                  style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}
                >
                  {/* Hover background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {/* Border */}
                  <div className="absolute inset-0 rounded-xl border border-gray-700/50 group-hover:border-gold/50 transition-colors duration-300"></div>
                  <span className="relative text-gray-100 group-hover:text-gold transition-colors duration-300">Lihat Semua</span>
                  <FiArrowRight className="relative text-gray-100 group-hover:text-gold transform group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              </div>
            </FadeInOnScroll>
            
            <StaggerAnimation staggerDelay={100} animation="fadeInUp">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {programs.map((program) => (
                  <HoverScale scale={1.05} key={program.id}>
                    <Link
                      to={`/program-kerja/${program.slug}`}
                      className="group relative rounded-2xl overflow-visible transition-all duration-500 transform hover:-translate-y-2"
                      style={{ 
                        backgroundColor: 'rgba(30, 41, 59, 0.95)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      {/* Outer frame - thick visible border */}
                      <div 
                        className="absolute -inset-[4px] rounded-2xl transition-all duration-500 z-0 pointer-events-none"
                        style={{
                          background: 'linear-gradient(135deg, rgba(148, 163, 184, 0.9) 0%, rgba(148, 163, 184, 0.7) 50%, rgba(148, 163, 184, 0.9) 100%)',
                          padding: '4px',
                          borderRadius: '1rem',
                          boxShadow: '0 0 15px rgba(148, 163, 184, 0.3)'
                        }}
                      >
                        <div 
                          className="w-full h-full rounded-2xl"
                          style={{
                            backgroundColor: 'rgba(30, 41, 59, 0.95)',
                            backdropFilter: 'blur(10px)',
                          }}
                        ></div>
                      </div>
                      
                      {/* Hover frame - gold border */}
                      <div 
                        className="absolute -inset-[4px] rounded-2xl transition-all duration-500 z-0 pointer-events-none opacity-0 group-hover:opacity-100"
                        style={{
                          background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.95) 0%, rgba(234, 179, 8, 0.8) 50%, rgba(234, 179, 8, 0.95) 100%)',
                          padding: '4px',
                          borderRadius: '1rem',
                          boxShadow: '0 0 25px rgba(234, 179, 8, 0.6), 0 0 50px rgba(234, 179, 8, 0.4)'
                        }}
                      >
                        <div 
                          className="w-full h-full rounded-2xl"
                          style={{
                            backgroundColor: 'rgba(30, 41, 59, 0.95)',
                            backdropFilter: 'blur(10px)',
                          }}
                        ></div>
                      </div>
                      
                      {/* Content wrapper */}
                      <div 
                        className="relative z-10 rounded-2xl overflow-hidden" 
                        style={{ 
                          backgroundColor: 'rgba(30, 41, 59, 0.95)',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                      
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                      
                      {/* Corner accent frames */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gold/30 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
                      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-gold/30 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
                      
                      {program.image && (
                        <div className="h-52 overflow-hidden relative">
                          <img
                            src={getImageUrl(program.image)}
                            alt={program.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          {/* Multi-layer gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          {/* Category badge - Enhanced */}
                          <div className="absolute top-4 left-4 backdrop-blur-md bg-primary-800/90 px-4 py-2 rounded-full shadow-lg border border-primary-700/50 overflow-hidden group-hover:border-primary-500/80 group-hover:bg-primary-700 transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative text-xs text-white font-bold uppercase tracking-wide">
                              {program.category_name}
                            </span>
                          </div>
                          
                          {/* Shine effect on hover */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </div>
                      )}
                      
                      <div className="p-6 relative z-10">
                        {/* Top decorative accent line */}
                        <div className="absolute top-0 left-6 w-16 h-1 bg-gradient-to-r from-primary-500 via-gold to-transparent rounded-full opacity-80"></div>
                        
                        <h3 className="text-lg font-bold mt-4 mb-4 text-gray-100 group-hover:text-gold transition-colors duration-300 line-clamp-2 leading-tight">
                          {program.title}
                        </h3>
                        
                        {/* Read more indicator - Enhanced */}
                        <div className="mt-4 pt-4 border-t border-gray-700/50 group-hover:border-gold/30 transition-colors duration-300">
                          <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                            <span className="text-sm font-semibold text-gray-400 group-hover:text-gold transition-colors duration-300">Lihat Detail</span>
                            <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                              <FiArrowRight className="text-white" size={12} />
                            </div>
                          </div>
                        </div>
                      </div>
                      </div>
                      {/* Close content wrapper */}
                    </Link>
                  </HoverScale>
                ))}
              </div>
            </StaggerAnimation>
          </div>
        </section>
      </FadeInOnScroll>

      {/* Divider Line */}
      <div className="relative py-12">
        <div className="absolute inset-x-0 top-1/2 h-[2px] bg-gradient-to-r from-transparent via-gold/60 to-transparent"></div>
        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-gray-700/60 to-transparent"></div>
      </div>

      {/* Gallery Preview */}
      <FadeInOnScroll direction="up" distance={50} delay={150}>
        <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#0a1628' }}>
        <div className="container mx-auto px-4 relative">
          <FadeInOnScroll direction="up" delay={200}>
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-display font-bold text-gray-100 mb-2">
                  Galeri
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-gold via-gold-dark to-gold rounded-full"></div>
              </div>
              <Link 
                to="/galeri" 
                className="text-gray-100 hover:text-gold font-semibold flex items-center group transition-colors px-4 py-2 rounded-lg hover:bg-primary-50"
              >
                Lihat Semua 
                <FiArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeInOnScroll>
          <StaggerAnimation staggerDelay={80} animation="fadeInUp">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {gallery.map((item, index) => (
                <HoverScale scale={1.05} key={item.id}>
                  <Link
                    to="/galeri"
                    className="group relative rounded-2xl overflow-visible transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple/20"
                    style={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    }}
                  >
                    {/* Outer frame - thick visible border */}
                    <div 
                      className="absolute -inset-[4px] rounded-2xl transition-all duration-500 z-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(135deg, rgba(148, 163, 184, 0.7) 0%, rgba(148, 163, 184, 0.5) 50%, rgba(148, 163, 184, 0.7) 100%)',
                        padding: '4px',
                        borderRadius: '1rem'
                      }}
                    >
                      <div 
                        className="w-full h-full rounded-2xl"
                        style={{
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        }}
                      ></div>
                    </div>
                    
                    {/* Hover frame - purple/gold border */}
                    <div 
                      className="absolute -inset-[4px] rounded-2xl transition-all duration-500 z-0 pointer-events-none opacity-0 group-hover:opacity-100"
                      style={{
                        background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.8) 0%, rgba(234, 179, 8, 0.8) 50%, rgba(147, 51, 234, 0.8) 100%)',
                        padding: '4px',
                        borderRadius: '1rem',
                        boxShadow: '0 0 25px rgba(147, 51, 234, 0.6), 0 0 50px rgba(234, 179, 8, 0.4)'
                      }}
                    >
                      <div 
                        className="w-full h-full rounded-2xl"
                        style={{
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        }}
                      ></div>
                    </div>
                    
                    {/* Content wrapper */}
                    <div className="relative z-10 rounded-2xl overflow-hidden" style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)' }}>
                      <div className="aspect-square overflow-hidden relative">
                        <img
                          src={getImageUrl(item.image_path)}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                        />
                        
                        {/* Enhanced gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-800/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Enhanced shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        
                        {/* Corner decorative elements */}
                        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-purple-400/0 group-hover:border-purple-400 transition-all duration-500 rounded-tl-lg"></div>
                        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-gold/0 group-hover:border-gold transition-all duration-500 rounded-tr-lg"></div>
                        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-gold/0 group-hover:border-gold transition-all duration-500 rounded-bl-lg"></div>
                        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-purple-400/0 group-hover:border-purple-400 transition-all duration-500 rounded-br-lg"></div>
                        
                        {/* Enhanced title overlay */}
                        <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                          <div className="backdrop-blur-md bg-gradient-to-r from-purple-900/90 to-purple-800/80 rounded-xl p-3 w-full border-2 border-purple-400/50 shadow-xl">
                            <p className="text-white text-sm font-bold line-clamp-2 drop-shadow-lg">{item.title}</p>
                          </div>
                        </div>
                        
                        {/* Enhanced image count badge */}
                        {item.batch_size > 1 && (
                          <div className="absolute top-3 right-3 backdrop-blur-md bg-gradient-to-r from-gold to-gold-dark px-3 py-1.5 rounded-full shadow-xl border-2 border-gold/70 group-hover:scale-110 transition-transform duration-300">
                            <span className="text-xs text-white font-bold drop-shadow-lg">
                              +{item.batch_size}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </HoverScale>
              ))}
            </div>
          </StaggerAnimation>
        </div>
      </section>
      </FadeInOnScroll>
    </div>
  );
};

export default Home;

