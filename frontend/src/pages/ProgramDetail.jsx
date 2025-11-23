import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiCalendar, FiMapPin } from 'react-icons/fi';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

const ProgramDetail = () => {
  const { slug } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgram();
  }, [slug]);

  const fetchProgram = async () => {
    try {
      setLoading(true);
      const res = await api.get('/programs');
      const found = res.data.data?.find(p => p.slug === slug);
      if (found) {
        const detailRes = await api.get(`/programs/${found.id}`);
        if (detailRes.data.success && detailRes.data.data) {
          setProgram(detailRes.data.data);
        } else {
          setProgram(null);
        }
      } else {
        setProgram(null);
      }
    } catch (error) {
      console.error('Error fetching program:', error);
      setProgram(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a1628' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat program...</p>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a1628' }}>
        <div className="text-center max-w-md px-4">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-300 mb-2">Program tidak ditemukan</h2>
          <p className="text-gray-600 mb-6">Program yang Anda cari mungkin telah dihapus atau tidak tersedia.</p>
          <a href="/program-kerja" className="btn-primary inline-block">
            Kembali ke Program Kerja
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0a1628' }}>
      <div className="container mx-auto px-4 max-w-5xl relative">
        <article>
          {/* Header - Enhanced */}
          <div className="mb-12 relative bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-gray-700/30 shadow-2xl overflow-hidden group hover:shadow-3xl transition-all duration-500">
            {/* Decorative corners */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary-500/20 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative">
              <span className="inline-block text-sm text-white font-bold bg-gradient-to-r from-primary-800 to-primary-700 px-5 py-2 rounded-full mb-6 shadow-lg backdrop-blur-sm border border-primary-600/30">
                {program.category_name}
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-bold mt-4 mb-8 bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 bg-clip-text text-transparent animate-gradient leading-tight">
                {program.title}
              </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-300">
              {program.start_date && (
                <div className="flex items-center bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                  <FiCalendar className="mr-2 text-primary-600" />
                  <span className="text-sm font-medium">
                    {new Date(program.start_date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                    {program.end_date && (
                      <> - {new Date(program.end_date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}</>
                    )}
                  </span>
                </div>
              )}
              {program.location && (
                <div className="flex items-center bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                  <FiMapPin className="mr-2 text-primary-600" />
                  <span className="text-sm font-medium">{program.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Image - Enhanced */}
          {program.image && (
            <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl border-4 border-white relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-gold/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img
                src={getImageUrl(program.image)}
                alt={program.title}
                className="w-full h-[500px] object-cover relative"
              />
            </div>
          )}

          {/* Description - Enhanced */}
          {program.description && (
            <div className="mb-12 relative bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/30 shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-primary-600 to-gold"></div>
              <p className="text-xl text-gray-300 leading-relaxed font-light">{program.description}</p>
            </div>
          )}

          {/* Content - Enhanced */}
          {program.content && (
            <div className="relative bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-gray-700/30 shadow-2xl overflow-hidden group hover:shadow-3xl transition-all duration-500">
              {/* Decorative accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-primary-600 to-gold"></div>
              
              <div
                className="prose prose-lg max-w-none text-gray-300 leading-relaxed relative"
                dangerouslySetInnerHTML={{ __html: program.content }}
              />
            </div>
          )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default ProgramDetail;

