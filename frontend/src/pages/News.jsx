import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

const News = () => {
  const [searchParams] = useSearchParams();
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    fetchNews();
    fetchCategories();
  }, [page, selectedCategory, search]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        ...(selectedCategory && { category: selectedCategory }),
        ...(search && { search }),
      };
      const res = await api.get('/news', { params });
      setNews(res.data.data || []);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories?type=news');
      setCategories(res.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
      </div>
    );
  }

  return (
    <div className="py-16 min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0a1628' }}>
      <div className="container mx-auto px-4 relative">
        {/* Header - Enhanced */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 bg-clip-text text-transparent animate-gradient">
            Berita & Artikel
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-gold via-gold-dark to-gold rounded-full mx-auto mb-6"></div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto backdrop-blur-sm bg-gray-800/30 px-6 py-3 rounded-2xl border border-gray-700/30 shadow-lg">
            Berita terbaru dan informasi terkini dari BEM FSRD ISI Yogyakarta
          </p>
        </div>

        {/* Filters - Enhanced */}
        <div className="mb-12 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm ${
              !selectedCategory
                ? 'bg-gradient-to-r from-primary-800 to-primary-700 text-white shadow-xl transform scale-105 border-2 border-primary-600'
                : 'bg-gray-800/80 text-gray-200 hover:bg-white border-2 border-gray-700 hover:border-primary-300 hover:shadow-lg hover:scale-105'
            }`}
          >
            Semua
          </button>
          {categories.map((cat, index) => {
            const colors = [
              'from-blue-500 to-blue-600',
              'from-purple-500 to-purple-600',
              'from-pink-500 to-pink-600',
              'from-teal-500 to-teal-600',
              'from-orange-500 to-orange-600',
              'from-indigo-500 to-indigo-600',
            ];
            const colorClass = colors[index % colors.length];
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm ${
                  selectedCategory === cat.slug
                    ? `bg-gradient-to-r ${colorClass} text-white shadow-xl transform scale-105 border-2 border-transparent`
                    : 'bg-gray-800/80 text-gray-200 hover:bg-white border-2 border-gray-700 hover:border-gray-300 hover:shadow-lg hover:scale-105'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* News Grid - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {news.map((item, index) => {
            const cardColors = [
              { from: 'from-blue-50', to: 'to-white', border: 'border-blue-100', badge: 'bg-blue-600' },
              { from: 'from-purple-50', to: 'to-white', border: 'border-purple-100', badge: 'bg-purple-600' },
              { from: 'from-pink-50', to: 'to-white', border: 'border-pink-100', badge: 'bg-pink-600' },
              { from: 'from-teal-50', to: 'to-white', border: 'border-teal-100', badge: 'bg-teal-600' },
              { from: 'from-orange-50', to: 'to-white', border: 'border-orange-100', badge: 'bg-orange-600' },
              { from: 'from-indigo-50', to: 'to-white', border: 'border-indigo-100', badge: 'bg-indigo-600' },
            ];
            const cardColor = cardColors[index % cardColors.length];
            return (
              <Link 
                key={item.id} 
                to={`/berita/${item.slug}`} 
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-gray-700/50 hover:border-primary-300 transform hover:-translate-y-2"
              >
                {/* Decorative accent line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cardColor.from} ${cardColor.to}`}></div>
                
                {item.featured_image && (
                  <div className="h-56 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 relative">
                    <img
                      src={getImageUrl(item.featured_image)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        console.error('Image load error:', item.featured_image);
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Category badge */}
                    <div className={`absolute top-4 left-4 backdrop-blur-md ${cardColor.badge}/90 px-4 py-2 rounded-full shadow-lg border border-gray-700/30`}>
                      <span className="text-xs text-white font-bold uppercase tracking-wide">
                        {item.category_name}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-6 bg-gray-800/50 backdrop-blur-sm relative">
                  {/* Accent line inside */}
                  <div className={`absolute top-0 left-6 w-12 h-1 bg-gradient-to-r ${cardColor.from} ${cardColor.to} rounded-full`}></div>
                  
                  <h3 className="text-xl font-bold mt-4 mb-3 text-gray-100 group-hover:text-primary-800 transition-colors line-clamp-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 text-sm line-clamp-3 mb-4 leading-relaxed">{item.excerpt}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                    <p className="text-xs text-gray-400 font-semibold">
                      {new Date(item.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      <span className="text-primary-800 font-semibold text-xs">Baca →</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-700 hover:border-gold/50 transition-colors font-semibold"
            >
              Sebelumnya
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  page === i + 1 
                    ? 'bg-gradient-to-r from-primary-800 to-primary-700 text-white shadow-lg transform scale-110' 
                    : 'bg-gray-800 border border-gray-700 text-gray-200 hover:bg-gray-700 hover:border-gold/50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-700 hover:border-gold/50 transition-colors font-semibold"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;

