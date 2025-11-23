import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiArrowRight, FiX, FiCalendar, FiMapPin, FiClock, FiUsers } from 'react-icons/fi';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';
import '../styles/Calendar.css';

const Calendar = ({ events: propEvents = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(propEvents);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    // If events are provided as props, use them; otherwise fetch
    if (propEvents.length > 0) {
      setEvents(propEvents);
      setLoading(false);
    } else {
      fetchEvents();
    }
  }, [currentDate, propEvents]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/events?status=published`);
      const allEvents = res.data.data || [];
      setEvents(allEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Adjust for Monday as first day (0 = Sunday, 1 = Monday, etc.)
    const adjustedStartingDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    
    const days = [];
    
    // Previous month days
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = adjustedStartingDay - 1; i >= 0; i--) {
      days.push({
        date: prevMonthDays - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, prevMonthDays - i)
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        isCurrentMonth: true,
        fullDate: new Date(year, month, i)
      });
    }
    
    // Next month days to fill the grid
    const remainingDays = 42 - days.length; // 6 rows x 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, i)
      });
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date || !events.length) return [];
    
    return events.filter(event => {
      const eventDate = new Date(event.start_datetime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  const days = getDaysInMonth(currentDate);
  const monthEvents = events.filter(event => {
    const eventDate = new Date(event.start_datetime);
    return eventDate.getMonth() === currentDate.getMonth() && 
           eventDate.getFullYear() === currentDate.getFullYear();
  }).sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Memuat kalender...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 py-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-dot-pattern opacity-5"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-900/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-800/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      {/* Classic Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-amber-50 mb-4 font-serif tracking-wide">Linimasa</h1>
              <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
                Menelusuri perjalanan dalam rentang waktu, sebagai catatan reflektif atas kerja, akal, dan dinamika gerakan yang terus berkembang.
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mb-6 bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 shadow-2xl border border-amber-900/30">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-amber-900/30 rounded-lg transition-colors text-amber-200 hover:text-amber-100"
                >
                  <FiChevronLeft size={20} />
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-amber-900/30 rounded-lg transition-colors text-amber-200 hover:text-amber-100"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
              <h2 className="text-xl font-bold text-amber-50 font-serif">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-semibold hover:from-amber-700 hover:to-amber-800 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-amber-500/30">
                Bulan
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-amber-900/30 shadow-2xl">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-amber-300 py-2 font-serif">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => {
                  const dayEvents = getEventsForDate(day.fullDate);
                  const isToday = day.fullDate.toDateString() === new Date().toDateString();
                  
                  return (
                    <div
                      key={idx}
                      className={`min-h-[100px] p-2 rounded-lg border ${
                        day.isCurrentMonth
                          ? isToday
                            ? 'bg-gradient-to-br from-amber-600/40 to-amber-700/40 border-amber-500 text-amber-50 shadow-lg ring-2 ring-amber-500/50'
                            : 'bg-gray-700/50 border-gray-600/50 text-gray-200 hover:bg-gray-700/70 hover:border-amber-900/50'
                          : 'bg-gray-800/30 border-gray-700/30 text-gray-500'
                      } transition-all cursor-pointer hover:shadow-md`}
                      onClick={() => day.isCurrentMonth && setSelectedDate(day.fullDate)}
                    >
                      <div className={`text-sm font-semibold mb-1 ${
                        day.isCurrentMonth 
                          ? isToday 
                            ? 'text-amber-50' 
                            : 'text-gray-200'
                          : 'text-gray-500'
                      }`}>
                        {day.date}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className="bg-gradient-to-r from-amber-700/80 to-amber-800/80 text-amber-50 text-xs p-1 rounded truncate hover:from-amber-600 hover:to-amber-700 transition-colors shadow-sm border border-amber-600/30 cursor-pointer"
                            title={event.title}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event);
                            }}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-amber-400 font-semibold">+{dayEvents.length - 2}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Events List */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 border border-amber-900/30 shadow-2xl sticky top-8">
              <h2 className="text-xl font-bold text-amber-50 mb-6 font-serif">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                {monthEvents.length === 0 ? (
                  <p className="text-gray-400 text-sm">Tidak ada kegiatan pada bulan ini</p>
                ) : (
                  monthEvents.map(event => {
                    const eventDate = new Date(event.start_datetime);
                    return (
                      <div
                        key={event.id}
                        className="bg-gradient-to-br from-gray-700/60 to-gray-700/40 hover:from-gray-700/80 hover:to-amber-900/30 p-4 rounded-lg border border-gray-600/30 hover:border-amber-900/50 transition-all cursor-pointer group shadow-lg hover:shadow-xl"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="text-xs text-amber-400 font-semibold mb-1">
                              {eventDate.toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="text-sm font-medium text-gray-200 group-hover:text-amber-50 transition-colors">
                              {event.title}
                            </div>
                            {event.location && (
                              <div className="text-xs text-gray-400 mt-1">{event.location}</div>
                            )}
                          </div>
                          <FiArrowRight className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto border border-amber-900/30"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-amber-900/50 to-amber-800/50 backdrop-blur-sm border-b border-amber-900/30 p-3 flex items-center justify-between">
              <h2 className="text-xl font-bold text-amber-50 font-serif line-clamp-2 pr-2">{selectedEvent.title}</h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 hover:bg-amber-900/30 rounded-lg transition-colors text-amber-200 hover:text-amber-100 flex-shrink-0"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4">
              {/* Event Image */}
              {selectedEvent.image && (
                <div className="rounded-lg overflow-hidden shadow-xl border border-amber-900/30">
                  <img
                    src={getImageUrl(selectedEvent.image)}
                    alt={selectedEvent.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Event Description */}
              {selectedEvent.description && (
                <div className="prose prose-invert max-w-none prose-sm">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              {/* Event Details */}
              <div className="space-y-3 pt-3 border-t border-gray-700/50">
                <div className="grid grid-cols-1 gap-3">
                  {/* Date & Time */}
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 bg-amber-900/30 rounded-lg flex-shrink-0">
                      <FiCalendar className="text-amber-400" size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-400 mb-1">Tanggal & Waktu</div>
                      <div className="text-amber-200 font-semibold text-sm">
                        {new Date(selectedEvent.start_datetime).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-gray-300 text-xs mt-1 flex items-center gap-1">
                        <FiClock size={12} />
                        {new Date(selectedEvent.start_datetime).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        {selectedEvent.end_datetime && (
                          <>
                            {' - '}
                            {new Date(selectedEvent.end_datetime).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  {selectedEvent.location && (
                    <div className="flex items-start gap-2">
                      <div className="p-1.5 bg-amber-900/30 rounded-lg flex-shrink-0">
                        <FiMapPin className="text-amber-400" size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-400 mb-1">Lokasi</div>
                        <div className="text-amber-200 font-semibold text-sm">{selectedEvent.location}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Participants */}
                {(selectedEvent.max_participants || selectedEvent.rsvp_count !== undefined) && (
                  <div className="flex items-start gap-2 pt-2">
                    <div className="p-1.5 bg-amber-900/30 rounded-lg flex-shrink-0">
                      <FiUsers className="text-amber-400" size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-400 mb-1">Peserta</div>
                      <div className="text-amber-200 font-semibold text-sm mb-2">
                        {selectedEvent.rsvp_count || 0}
                        {selectedEvent.max_participants && (
                          <> / {selectedEvent.max_participants}</>
                        )}
                        {!selectedEvent.max_participants && ' terdaftar'}
                      </div>
                      {selectedEvent.max_participants && selectedEvent.rsvp_count !== undefined && (
                        <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-amber-600 to-amber-700 h-1.5 rounded-full transition-all"
                            style={{
                              width: `${Math.min(((selectedEvent.rsvp_count || 0) / selectedEvent.max_participants) * 100, 100)}%`
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-sm border-t border-amber-900/30 p-3 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-5 py-2 text-sm bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-semibold hover:from-amber-700 hover:to-amber-800 transition-all transform hover:scale-105 shadow-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;

