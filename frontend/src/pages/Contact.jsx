import React, { useState, useRef } from 'react';
import { FiMail, FiPhone, FiMapPin, FiMessageSquare, FiUser } from 'react-icons/fi';
import api from '../services/api';
import FormToast from '../components/FormToast';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [aspirationForm, setAspirationForm] = useState({ name: '', email: '', message: '', is_anonymous: true });
  const [submittingAspiration, setSubmittingAspiration] = useState(false);
  const [contactToast, setContactToast] = useState(null);
  const [aspirationToast, setAspirationToast] = useState(null);
  const contactFormRef = useRef(null);
  const aspirationFormRef = useRef(null);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.post('/contact', form);
      if (response.data.success) {
        setContactToast({
          type: 'success',
          message: 'Pesan berhasil dikirim! Kami akan segera menghubungi Anda.'
        });
        setForm({ name: '', email: '', subject: '', message: '' });
        console.log('Contact toast set:', { type: 'success', message: 'Pesan berhasil dikirim!' });
      } else {
        setContactToast({
          type: 'error',
          message: response.data.message || 'Gagal mengirim pesan. Silakan coba lagi.'
        });
        console.log('Contact toast set:', { type: 'error' });
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      let errorMessage = 'Gagal mengirim pesan. Silakan coba lagi.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        errorMessage = 'Server tidak dapat dijangkau. Pastikan backend server berjalan.';
      }
      
      setContactToast({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAspirationSubmit = async (e) => {
    e.preventDefault();
    
    // Validate message
    if (!aspirationForm.message || aspirationForm.message.trim() === '') {
      setAspirationToast({
        type: 'warning',
        message: 'Pesan tidak boleh kosong. Silakan isi aspirasi Anda.'
      });
      return;
    }
    
    setSubmittingAspiration(true);
    try {
      const response = await api.post('/aspirations', aspirationForm);
      if (response.data.success) {
        setAspirationToast({
          type: 'success',
          message: 'Aspirasi berhasil dikirim! Terima kasih atas masukan Anda.'
        });
        setAspirationForm({ name: '', email: '', message: '', is_anonymous: true });
      } else {
        setAspirationToast({
          type: 'error',
          message: response.data.message || 'Gagal mengirim aspirasi. Silakan coba lagi.'
        });
      }
    } catch (error) {
      console.error('Error submitting aspiration:', error);
      let errorMessage = 'Gagal mengirim aspirasi. Silakan coba lagi.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        errorMessage = 'Server tidak dapat dijangkau. Pastikan backend server berjalan.';
      }
      
      setAspirationToast({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setSubmittingAspiration(false);
    }
  };


  return (
    <div className="py-16 min-h-screen relative" style={{ backgroundColor: '#0a1628', overflow: 'visible' }}>
      <div className="container mx-auto px-4 relative" style={{ overflow: 'visible' }}>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-100 mb-4">
            Hubungi Kami
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-gold via-gold-dark to-gold rounded-full mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="card-gradient bg-gradient-to-br from-gray-800 via-gray-700/50 to-gray-800 p-8 border-gray-700/50">
            <h2 className="text-2xl font-bold mb-6 text-gray-100">
              Informasi Kontak
            </h2>
            <div className="space-y-6">
              <div className="flex items-start bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg text-white mr-4 shadow-lg">
                  <FiMapPin size={24} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-gray-100">Alamat</h3>
                  <p className="text-gray-300">
                    Institut Seni Indonesia Yogyakarta<br />
                    Jl. Parangtritis KM 6,5, Sewon, Bantul<br />
                    Yogyakarta 55188, Indonesia
                  </p>
                </div>
              </div>
              <div className="flex items-start bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg text-white mr-4 shadow-lg">
                  <FiMail size={24} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-gray-100">Email</h3>
                  <p className="text-gray-300">bem@isi.ac.id</p>
                </div>
              </div>
              <div className="flex items-start bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg text-white mr-4 shadow-lg">
                  <FiPhone size={24} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-gray-100">Telepon</h3>
                  <p className="text-gray-300">+62 274 379133</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="mt-8 rounded-xl overflow-hidden shadow-xl border-2 border-gray-700/50">
              <iframe
                src="https://www.google.com/maps?q=Institut+Seni+Indonesia+Yogyakarta,+Jl.+Parangtritis+KM+6.5,+Sewon,+Bantul,+Yogyakarta+55188&output=embed"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
                title="Lokasi Institut Seni Indonesia Yogyakarta - Jl. Parangtritis KM 6.5, Sewon, Bantul"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card-gradient bg-gradient-to-br from-gray-800 via-gray-700/50 to-gray-800 p-8 border-blue-200/50 relative" style={{ overflow: 'visible' }}>
            {/* Toast for Contact Form */}
            {contactToast && (
              <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 z-[1000] w-full max-w-md px-4" style={{ pointerEvents: 'auto' }}>
                <FormToast
                  type={contactToast.type}
                  message={contactToast.message}
                  onClose={() => setContactToast(null)}
                  duration={5000}
                  formRef={contactFormRef}
                />
              </div>
            )}
            <h2 className="text-2xl font-bold mb-6 text-gray-100">
              Kirim Pesan
            </h2>
            <form ref={contactFormRef} onSubmit={handleContactSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nama"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field bg-gray-800/50 backdrop-blur-sm border-gray-700 focus:border-primary-500 focus:ring-primary-500"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field bg-gray-800/50 backdrop-blur-sm border-gray-700 focus:border-primary-500 focus:ring-primary-500"
                required
              />
              <input
                type="text"
                placeholder="Subjek"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="input-field bg-gray-800/50 backdrop-blur-sm border-gray-700 focus:border-primary-500 focus:ring-primary-500"
                required
              />
              <textarea
                placeholder="Pesan"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="input-field bg-gray-800/50 backdrop-blur-sm border-gray-700 focus:border-primary-500 focus:ring-primary-500"
                rows="6"
                required
              />
              <button 
                type="submit" 
                className="btn-primary w-full bg-gradient-to-r from-primary-800 to-primary-700 hover:from-primary-900 hover:to-primary-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
                disabled={submitting}
              >
                {submitting ? 'Mengirim...' : 'Kirim Pesan'}
              </button>
            </form>
          </div>
        </div>

        {/* Kotak Aspirasi Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-100 mb-4 flex items-center justify-center gap-3">
              <FiMessageSquare className="text-gold" />
              Kotak Aspirasi
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Sampaikan aspirasi, saran, atau masukan Anda. Pengiriman anonim tersedia untuk menjaga privasi Anda.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-gold via-gold-dark to-gold rounded-full mx-auto mt-4"></div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="card-gradient bg-gradient-to-br from-gray-800 via-gray-700/50 to-gray-800 p-8 border-purple-200/50 relative" style={{ overflow: 'visible' }}>
              {/* Toast for Aspiration Form */}
              {aspirationToast && (
                <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 z-[1000] w-full max-w-md px-4" style={{ pointerEvents: 'auto' }}>
                  <FormToast
                    type={aspirationToast.type}
                    message={aspirationToast.message}
                    onClose={() => setAspirationToast(null)}
                    duration={5000}
                    formRef={aspirationFormRef}
                  />
                </div>
              )}
              <form ref={aspirationFormRef} onSubmit={handleAspirationSubmit} className="space-y-6">
                {/* Anonymous Toggle */}
                <div className="flex items-center gap-3 mb-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aspirationForm.is_anonymous}
                      onChange={(e) => setAspirationForm({ ...aspirationForm, is_anonymous: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-primary-600 focus:ring-primary-500 focus:ring-2"
                    />
                    <span className="ml-3 text-gray-200 font-medium">Kirim sebagai Anonim</span>
                  </label>
                </div>

                {/* Name and Email (conditional) */}
                {!aspirationForm.is_anonymous && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Nama (Opsional)"
                        value={aspirationForm.name}
                        onChange={(e) => setAspirationForm({ ...aspirationForm, name: e.target.value })}
                        className="input-field bg-gray-800/50 backdrop-blur-sm border-gray-700 focus:border-primary-500 focus:ring-primary-500 pl-10"
                      />
                    </div>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="email"
                        placeholder="Email (Opsional)"
                        value={aspirationForm.email}
                        onChange={(e) => setAspirationForm({ ...aspirationForm, email: e.target.value })}
                        className="input-field bg-gray-800/50 backdrop-blur-sm border-gray-700 focus:border-primary-500 focus:ring-primary-500 pl-10"
                      />
                    </div>
                  </div>
                )}

                {/* Message */}
                <div>
                  <textarea
                    placeholder="Tuliskan aspirasi, saran, atau masukan Anda di sini..."
                    value={aspirationForm.message}
                    onChange={(e) => setAspirationForm({ ...aspirationForm, message: e.target.value })}
                    className="input-field bg-gray-800/50 backdrop-blur-sm border-gray-700 focus:border-primary-500 focus:ring-primary-500 w-full"
                    rows="8"
                    required
                  />
                </div>

                {/* Info Text */}
                {aspirationForm.is_anonymous && (
                  <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-4">
                    <p className="text-sm text-purple-200 flex items-start gap-2">
                      <FiMessageSquare className="mt-0.5 flex-shrink-0" />
                      <span>Pesan Anda akan dikirim secara anonim. Identitas Anda tidak akan dicatat atau ditampilkan.</span>
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="btn-primary w-full bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-800 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2" 
                  disabled={submittingAspiration}
                >
                  <FiMessageSquare size={20} />
                  {submittingAspiration ? 'Mengirim...' : 'Kirim Aspirasi'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;


