import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(form.username, form.password);

      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.message || 'Login gagal. Periksa username dan password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Error message sudah di-handle di AuthContext
      if (result && !result.success) {
        setError(result.message || 'Terjadi kesalahan saat login.');
      } else {
        setError('Terjadi kesalahan. Periksa console untuk detail.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-primary-800">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/images/logo-isi.png" 
              alt="Logo ISI Yogyakarta"
              className="h-16 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = e.target.nextElementSibling;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="w-16 h-16 bg-primary-800 rounded-lg hidden items-center justify-center">
              <span className="text-white font-bold text-2xl">ISI</span>
            </div>
          </div>
          <h1 className="text-3xl font-display font-bold text-primary-800">Admin Login</h1>
          <p className="text-gray-600 mt-2">BEM FSRD ISI Yogyakarta</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
            {(error.includes('server') || error.includes('terhubung') || error.includes('dijangkau')) ? (
              <div className="mt-2 text-sm">
                <p className="font-semibold">Cara memperbaiki:</p>
                <ol className="list-decimal list-inside mt-1 space-y-1 text-xs">
                  <li>Buka terminal baru dan jalankan: <code className="bg-red-200 px-1 rounded">cd backend && npm run dev</code></li>
                  <li>Pastikan backend berjalan di <code className="bg-red-200 px-1 rounded">http://localhost:5000</code></li>
                  <li>Test endpoint: <code className="bg-red-200 px-1 rounded">curl http://localhost:5000/api/health</code></li>
                  <li>Jika perlu, buat file <code className="bg-red-200 px-1 rounded">frontend/.env</code> dengan isi: <code className="bg-red-200 px-1 rounded">VITE_API_URL=http://localhost:5000/api</code></li>
                </ol>
              </div>
            ) : null}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="input-field"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Masuk...' : 'Masuk'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Default: admin / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

