import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiX, FiUpload, FiUsers } from 'react-icons/fi';
import api from '../../services/api';
import Notification from '../../components/admin/Notification';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import HelpBadge from '../../components/admin/HelpBadge';
import Tooltip from '../../components/admin/Tooltip';
import { getImageUrl } from '../../utils/imageUrl';

const AdminOrganization = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState(null);
  const [form, setForm] = useState({
    name: '',
    position: '',
    division: '',
    bio: '',
    email: '',
    phone: '',
    order_index: 0,
    status: 'active',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await api.get('/organization');
      if (res.data && res.data.success) {
        setMembers(res.data.data || []);
      } else {
        setMembers([]);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      let errorMessage = 'Gagal memuat struktur organisasi';
      
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        errorMessage = 'Server tidak dapat dijangkau. Pastikan backend server berjalan di port 5000.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showNotification('error', errorMessage);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] !== '' && form[key] !== null) {
        formData.append(key, form[key]);
      }
    });
    if (file) {
      formData.append('photo', file);
    }

    try {
      if (editing) {
        await api.put(`/organization/${editing.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showNotification('success', 'Anggota berhasil diperbarui!');
      } else {
        await api.post('/organization', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showNotification('success', 'Anggota berhasil ditambahkan!');
      }
      setShowModal(false);
      resetForm();
      fetchMembers();
    } catch (error) {
      console.error('Error saving member:', error);
      let errorMessage = 'Gagal menyimpan data';
      
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        errorMessage = 'Server tidak dapat dijangkau. Pastikan backend server berjalan.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showNotification('error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditing(null);
    setForm({
      name: '',
      position: '',
      division: '',
      bio: '',
      email: '',
      phone: '',
      order_index: 0,
      status: 'active',
    });
    setFile(null);
    setPreview(null);
  };

  const handleEdit = (member) => {
    setEditing(member);
    setForm({
      name: member.name,
      position: member.position,
      division: member.division || '',
      bio: member.bio || '',
      email: member.email || '',
      phone: member.phone || '',
      order_index: member.order_index || 0,
      status: member.status,
    });
    if (member.photo) {
      setPreview(getImageUrl(member.photo));
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/organization/${id}`);
      showNotification('success', 'Anggota berhasil dihapus!');
      fetchMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
      let errorMessage = 'Gagal menghapus anggota';
      
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        errorMessage = 'Server tidak dapat dijangkau. Pastikan backend server berjalan.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      showNotification('error', errorMessage);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Group by division/position
  const groupedMembers = members.reduce((acc, member) => {
    const key = member.division || member.position || 'Lainnya';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(member);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Struktur Organisasi</h2>
          <p className="text-gray-600 mt-1">Kelola anggota dan struktur organisasi BEM FSRD ISI Yogyakarta</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <FiPlus size={20} />
          Tambah Anggota
        </button>
      </div>

      {/* Organization Structure */}
      {members.length === 0 ? (
        <div className="card p-12 text-center">
          <FiUsers className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 mb-4">Belum ada anggota organisasi</p>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="btn-primary"
          >
            Tambah Anggota Pertama
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedMembers).map(([group, groupMembers]) => (
            <div key={group} className="card p-6">
              <h3 className="text-xl font-bold text-primary-800 mb-6 pb-3 border-b-2 border-gold">
                {group}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {groupMembers.map((member) => (
                  <div key={member.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="text-center mb-4">
                      <div className="relative inline-block">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-200 mx-auto">
                          {member.photo ? (
                            <img
                              src={getImageUrl(member.photo)}
                              alt={member.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(member.name) + '&background=1e3a8a&color=fff&size=128';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary-800 to-primary-600 flex items-center justify-center">
                              <span className="text-white font-bold text-xl">
                                {member.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <h4 className="font-semibold text-primary-800 mt-3 mb-1">{member.name}</h4>
                      <p className="text-sm text-gold font-medium">{member.position}</p>
                      {member.division && member.division !== member.position && (
                        <p className="text-xs text-gray-500">{member.division}</p>
                      )}
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Tooltip content="Edit anggota">
                        <button
                          onClick={() => handleEdit(member)}
                          className="px-3 py-1.5 text-xs bg-primary-100 text-primary-700 rounded hover:bg-primary-200 transition-colors"
                        >
                          <FiEdit className="inline mr-1" size={12} />
                          Edit
                        </button>
                      </Tooltip>
                      <Tooltip content="Hapus anggota">
                        <button
                          onClick={() => setDeleteConfirm(member)}
                          className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {editing ? 'Edit Anggota' : 'Tambah Anggota Baru'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Foto Profil
                  <HelpBadge
                    title="Foto Profil"
                    content="Upload foto profil anggota. Ukuran disarankan: 400x400px. Format: JPG, PNG, atau WebP. Maksimal 2MB."
                  />
                </label>
                <div className="space-y-4">
                  {preview && (
                    <div className="relative inline-block">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-32 h-32 rounded-full object-cover border-4 border-primary-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setPreview(null);
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  )}
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiUpload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Klik untuk upload</span> foto profil
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 2MB)</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nama lengkap anggota"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jabatan <span className="text-red-500">*</span>
                  <HelpBadge
                    title="Jabatan"
                    content="Jabatan di organisasi, contoh: Ketua, Sekretaris, Bendahara, Koordinator, dll."
                  />
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Ketua, Sekretaris, Bendahara"
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              {/* Division */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Divisi/Bidang
                  <HelpBadge
                    title="Divisi"
                    content="Divisi atau bidang kerja, contoh: Pimpinan, Sekretariat, Media, dll. Akan digunakan untuk mengelompokkan anggota."
                  />
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Pimpinan, Sekretariat, Media"
                  value={form.division}
                  onChange={(e) => setForm({ ...form, division: e.target.value })}
                  className="input-field"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio/Deskripsi
                </label>
                <textarea
                  placeholder="Deskripsi singkat tentang anggota..."
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="input-field"
                  rows="3"
                />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    No. Telepon
                  </label>
                  <input
                    type="tel"
                    placeholder="081234567890"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Order & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Urutan Tampil
                    <HelpBadge
                      title="Urutan Tampil"
                      content="Angka untuk mengatur urutan tampil. Angka lebih kecil akan tampil lebih dulu."
                    />
                  </label>
                  <input
                    type="number"
                    value={form.order_index}
                    onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })}
                    className="input-field"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="input-field"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="btn-outline flex-1"
                  disabled={submitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={submitting}
                >
                  {submitting ? 'Menyimpan...' : editing ? 'Perbarui' : 'Simpan Anggota'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <ConfirmDialog
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleDelete(deleteConfirm.id)}
          title="Hapus Anggota?"
          message={`Apakah Anda yakin ingin menghapus "${deleteConfirm.name}" dari struktur organisasi? Tindakan ini tidak dapat dibatalkan.`}
          confirmText="Ya, Hapus"
          cancelText="Batal"
          type="danger"
        />
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

export default AdminOrganization;

