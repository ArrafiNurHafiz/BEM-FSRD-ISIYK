import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiCalendar, FiUser, FiEye } from 'react-icons/fi';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

const NewsDetail = () => {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({ name: '', email: '', content: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchNews();
  }, [slug]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      // Fetch all news and find by slug
      const res = await api.get('/news?limit=1000');
      const found = res.data.data?.find(n => n.slug === slug);
      if (found) {
        const detailRes = await api.get(`/news/${found.id}`);
        if (detailRes.data.success && detailRes.data.data) {
          setNews(detailRes.data.data);
          setComments(detailRes.data.data.comments || []);
        } else {
          setNews(null);
          setComments([]);
        }
      } else {
        setNews(null);
        setComments([]);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews(null);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/comments/news/${news.id}`, commentForm);
      setCommentForm({ name: '', email: '', content: '' });
      alert('Komentar berhasil dikirim. Menunggu persetujuan admin.');
      fetchNews();
    } catch (error) {
      alert('Gagal mengirim komentar. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat berita...</p>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center max-w-md px-4">
          <div className="text-gray-400 text-6xl mb-4">📰</div>
          <h2 className="text-2xl font-bold text-gray-300 mb-2">Berita tidak ditemukan</h2>
          <p className="text-gray-600 mb-6">Berita yang Anda cari mungkin telah dihapus atau tidak tersedia.</p>
          <a href="/berita" className="btn-primary inline-block">
            Kembali ke Berita
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0a1628' }}>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-dot-pattern opacity-15"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-200/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
      
      <div className="container mx-auto px-4 max-w-5xl relative">
        <article>
          {/* Header - Enhanced */}
          <div className="mb-12 relative bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-gray-700/30 shadow-2xl overflow-hidden group hover:shadow-3xl transition-all duration-500">
            {/* Decorative corners */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary-500/20 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative">
              <span className="inline-block text-sm text-white font-bold bg-gradient-to-r from-primary-800 to-primary-700 px-5 py-2 rounded-full mb-6 shadow-lg backdrop-blur-sm border border-primary-600/30">
                {news.category_name}
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-bold mt-4 mb-8 bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 bg-clip-text text-transparent animate-gradient leading-tight">
                {news.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-300">
                <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                  <FiCalendar className="mr-2 text-primary-600" />
                  <span className="text-sm font-medium">
                    {new Date(news.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                {news.author_name && (
                  <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                    <FiUser className="mr-2 text-primary-600" />
                    <span className="text-sm font-medium">{news.author_name}</span>
                  </div>
                )}
                <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                  <FiEye className="mr-2 text-primary-600" />
                  <span className="text-sm font-medium">{news.views} views</span>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image - Enhanced */}
          {news.featured_image && (
            <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl border-4 border-white relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-gold/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img
                src={getImageUrl(news.featured_image)}
                alt={news.title}
                className="w-full h-[500px] object-cover relative"
                onError={(e) => {
                  console.error('Image load error:', news.featured_image);
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Content - Enhanced */}
          <div className="relative bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 mb-12 border border-gray-700/30 shadow-2xl overflow-hidden group hover:shadow-3xl transition-all duration-500">
            {/* Decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-primary-600 to-gold"></div>
            
            <div
              className="prose prose-lg max-w-none text-gray-300 leading-relaxed relative"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </div>

          {/* Comments Section */}
          <div className="mt-12 border-t-2 border-primary-200 pt-8">
            <h3 className="text-2xl font-bold mb-6 text-primary-800">
              Komentar ({comments.length})
            </h3>

            {/* Comments List */}
            <div className="space-y-6 mb-8">
              {comments.map((comment, index) => {
                const colors = [
                  'from-blue-50 to-white border-blue-200',
                  'from-purple-50 to-white border-purple-200',
                  'from-pink-50 to-white border-pink-200',
                  'from-teal-50 to-white border-teal-200',
                ];
                const cardColor = colors[index % colors.length];
                return (
                  <div key={comment.id} className={`card-gradient bg-gradient-to-br ${cardColor} p-6`}>
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {comment.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary-800">{comment.name}</h4>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{comment.content}</p>
                  </div>
                );
              })}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="card-gradient bg-gradient-to-br from-white via-primary-50/30 to-white p-8 border-primary-200/50">
              <h4 className="text-xl font-semibold mb-6 text-primary-800">
                Tinggalkan Komentar
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Nama"
                  value={commentForm.name}
                  onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                  className="input-field bg-gray-800/80 backdrop-blur-sm border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={commentForm.email}
                  onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                  className="input-field bg-gray-800/80 backdrop-blur-sm border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              <textarea
                placeholder="Komentar"
                value={commentForm.content}
                onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                className="input-field mb-4 bg-gray-800/80 backdrop-blur-sm border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                rows="4"
                required
              />
              <button 
                type="submit" 
                className="btn-primary bg-gradient-to-r from-primary-800 to-primary-700 hover:from-primary-900 hover:to-primary-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
                disabled={submitting}
              >
                {submitting ? 'Mengirim...' : 'Kirim Komentar'}
              </button>
            </form>
          </div>
        </article>
      </div>
    </div>
  );
};

export default NewsDetail;

