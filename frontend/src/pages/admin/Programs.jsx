import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import api from '../../services/api';

const AdminPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
    category_id: '',
    start_date: '',
    end_date: '',
    location: '',
    status: 'upcoming',
  });
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchPrograms();
    fetchCategories();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await api.get('/programs');
      setPrograms(res.data.data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories?type=program');
      setCategories(res.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
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
        await api.put(`/programs/${editing.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/programs', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setShowModal(false);
      setEditing(null);
      setForm({
        title: '',
        description: '',
        content: '',
        category_id: '',
        start_date: '',
        end_date: '',
        location: '',
        status: 'upcoming',
      });
      setFile(null);
      fetchPrograms();
    } catch (error) {
      alert('Error saving program');
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description || '',
      content: item.content || '',
      category_id: item.category_id,
      start_date: item.start_date || '',
      end_date: item.end_date || '',
      location: item.location || '',
      status: item.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus program ini?')) return;
    try {
      await api.delete(`/programs/${id}`);
      fetchPrograms();
    } catch (error) {
      alert('Error deleting program');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Program Kerja</h2>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center">
          <FiPlus className="mr-2" /> Tambah Program
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-white border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {programs.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{item.category_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
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

      {/* Modal - Similar to News modal but with program-specific fields */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">
              {editing ? 'Edit Program' : 'Tambah Program'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                rows="3"
              />
              <textarea
                placeholder="Content (HTML)"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="input-field"
                rows="8"
              />
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="input-field"
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  placeholder="Tanggal Mulai"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  className="input-field"
                />
                <input
                  type="date"
                  placeholder="Tanggal Selesai"
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
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
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="input-field"
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="input-field"
              />
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditing(null);
                    setForm({
                      title: '',
                      description: '',
                      content: '',
                      category_id: '',
                      start_date: '',
                      end_date: '',
                      location: '',
                      status: 'upcoming',
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
    </div>
  );
};

export default AdminPrograms;

