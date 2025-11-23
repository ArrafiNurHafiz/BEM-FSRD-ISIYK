import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiUsers, FiX } from 'react-icons/fi';
import api from '../../services/api';
import Notification from '../../components/admin/Notification';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rsvps, setRsvps] = useState([]);
  const [loadingRsvps, setLoadingRsvps] = useState(false);
  const [editing, setEditing] = useState(null);
  const [notification, setNotification] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    start_datetime: '',
    end_datetime: '',
    location: '',
    max_participants: '',
    status: 'draft',
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      showNotification('error', 'Gagal memuat kegiatan');
    } finally {
      setLoading(false);
    }
  };

  const fetchRsvps = async (eventId) => {
    setLoadingRsvps(true);
    try {
      const res = await api.get(`/events/${eventId}/rsvps`);
      setRsvps(res.data.data || []);
    } catch (error) {
      console.error('Error fetching RSVPs:', error);
      showNotification('error', 'Gagal memuat daftar RSVP');
    } finally {
      setLoadingRsvps(false);
    }
  };

  const handleViewRsvps = async (event) => {
    setSelectedEvent(event);
    setShowRsvpModal(true);
    await fetchRsvps(event.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });
    if (file) {
      formData.append('image', file);
    }

    try {
      if (editing) {
        await api.put(`/events/${editing.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showNotification('success', 'Kegiatan berhasil diperbarui!');
      } else {
        await api.post('/events', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showNotification('success', 'Kegiatan berhasil ditambahkan!');
      }
      setShowModal(false);
      setEditing(null);
      setForm({
        title: '',
        description: '',
        start_datetime: '',
        end_datetime: '',
        location: '',
        max_participants: '',
        status: 'draft',
      });
      setFile(null);
      fetchEvents();
    } catch (error) {
      showNotification('error', error.response?.data?.message || 'Gagal menyimpan kegiatan');
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description || '',
      start_datetime: item.start_datetime ? item.start_datetime.slice(0, 16) : '',
      end_datetime: item.end_datetime ? item.end_datetime.slice(0, 16) : '',
      location: item.location || '',
      max_participants: item.max_participants || '',
      status: item.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus kegiatan ini?')) return;
    try {
      await api.delete(`/events/${id}`);
      showNotification('success', 'Kegiatan berhasil dihapus!');
      fetchEvents();
    } catch (error) {
      showNotification('error', 'Gagal menghapus kegiatan');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kegiatan</h2>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center">
          <FiPlus className="mr-2" /> Tambah Kegiatan
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-white border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">RSVP</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{item.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(item.start_datetime).toLocaleDateString('id-ID')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleViewRsvps(item)}
                    className="flex items-center text-primary-600 hover:text-primary-800 text-sm"
                  >
                    <FiUsers className="mr-1" />
                    {item.rsvp_count || 0} peserta
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      item.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-primary-600 hover:text-primary-900 mr-4"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RSVP Modal */}
      {showRsvpModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Daftar RSVP - {selectedEvent.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Total: {rsvps.length} peserta
                  {selectedEvent.max_participants && ` / Maks: ${selectedEvent.max_participants}`}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowRsvpModal(false);
                  setSelectedEvent(null);
                  setRsvps([]);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-6">
              {loadingRsvps ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
                </div>
              ) : rsvps.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FiUsers className="mx-auto mb-4 text-gray-400" size={48} />
                  <p>Belum ada peserta yang melakukan RSVP</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telepon</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal RSVP</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {rsvps.map((rsvp, index) => (
                        <tr key={rsvp.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{rsvp.name}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{rsvp.email}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{rsvp.phone || '-'}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {new Date(rsvp.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                rsvp.status === 'confirmed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {rsvp.status === 'confirmed' ? 'Terkonfirmasi' : 'Dibatalkan'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {editing ? 'Edit Kegiatan' : 'Tambah Kegiatan'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditing(null);
                  setForm({
                    title: '',
                    description: '',
                    start_datetime: '',
                    end_datetime: '',
                    location: '',
                    max_participants: '',
                    status: 'draft',
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Judul"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input-field"
                required
              />
              <textarea
                placeholder="Deskripsi"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field"
                rows="4"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="datetime-local"
                  placeholder="Tanggal Mulai"
                  value={form.start_datetime}
                  onChange={(e) => setForm({ ...form, start_datetime: e.target.value })}
                  className="input-field"
                  required
                />
                <input
                  type="datetime-local"
                  placeholder="Tanggal Selesai"
                  value={form.end_datetime}
                  onChange={(e) => setForm({ ...form, end_datetime: e.target.value })}
                  className="input-field"
                />
              </div>
              <input
                type="text"
                placeholder="Lokasi"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="input-field"
              />
              <input
                type="number"
                placeholder="Maks Peserta"
                value={form.max_participants}
                onChange={(e) => setForm({ ...form, max_participants: e.target.value })}
                className="input-field"
              />
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="input-field"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="input-field"
              />
              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditing(null);
                    setForm({
                      title: '',
                      description: '',
                      start_datetime: '',
                      end_datetime: '',
                      location: '',
                      max_participants: '',
                      status: 'draft',
                    });
                  }}
                  className="btn-outline flex-1"
                >
                  Batal
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default AdminEvents;
