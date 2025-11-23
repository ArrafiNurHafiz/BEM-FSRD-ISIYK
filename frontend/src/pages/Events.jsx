import React, { useState, useEffect } from 'react';
import Calendar from '../components/Calendar';
import api from '../services/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/events?status=published');
      setEvents(res.data.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Gagal memuat data kegiatan. Silakan coba lagi.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-primary-50/30 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800 mx-auto mb-4"></div>
          <p className="text-gray-300">Memuat kalender kegiatan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-primary-50/30 to-white">
        <div className="text-center max-w-md px-4">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={fetchEvents}
            className="btn-primary"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0a1628' }}>
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-100 mb-4">
            Kalender Kegiatan
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-gold via-gold-dark to-gold rounded-full mx-auto"></div>
          <p className="text-gray-300 mt-4 text-lg">Lihat jadwal kegiatan BEM FSRD ISI Yogyakarta</p>
        </div>
        <Calendar events={events} />
      </div>
    </div>
  );
};

export default Events;

