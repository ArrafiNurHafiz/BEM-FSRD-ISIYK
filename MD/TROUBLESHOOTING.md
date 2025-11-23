# Troubleshooting Guide

## 🔴 Error: "Server error" di Halaman Login

### Penyebab Umum:

1. **Backend tidak berjalan**
2. **Port berbeda atau konflik**
3. **File .env tidak dikonfigurasi dengan benar**
4. **Database tidak terkoneksi**
5. **CORS issue**

### ✅ Solusi Step-by-Step:

#### 1. Periksa Backend Berjalan

**Terminal 1 - Jalankan Backend:**
```bash
cd backend
npm run dev
```

**Pastikan melihat output:**
```
🚀 Server running on port 5000
📡 API available at http://localhost:5000/api
🌍 Environment: development
```

**Jika port 5000 sudah digunakan:**
- Ubah PORT di `backend/.env` ke port lain (misal: 5001)
- Update `frontend/.env` dengan port yang baru

#### 2. Periksa File .env

**Backend `.env` (di folder `backend/`):**
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bem_isi_yogyakarta
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
UPLOAD_PATH=./uploads
NODE_ENV=development
```

**Frontend `.env` (di folder `frontend/`):**
```env
VITE_API_URL=http://localhost:5000/api
```

**Penting:** 
- Pastikan tidak ada spasi di sekitar `=`
- Pastikan password MySQL benar
- Pastikan database sudah dibuat

#### 3. Test Koneksi Backend

Buka browser dan kunjungi:
```
http://localhost:5000/api/health
```

**Harus muncul:**
```json
{
  "success": true,
  "message": "BEM FSRD ISI Yogyakarta API is running",
  "timestamp": "..."
}
```

**Jika tidak muncul:**
- Backend tidak berjalan dengan benar
- Periksa error di terminal backend
- Periksa apakah ada dependency yang belum diinstall: `npm install`

#### 4. Periksa Database Connection

**Test koneksi database:**
```bash
cd backend
node -e "require('./config/database').getConnection().then(() => console.log('DB OK')).catch(e => console.error('DB Error:', e))"
```

**Jika error database:**
- Pastikan MySQL berjalan
- Periksa credentials di `.env`
- Pastikan database sudah dibuat: `CREATE DATABASE bem_isi_yogyakarta;`

#### 5. Periksa Console Browser

Tekan `F12` di browser dan lihat tab **Console** dan **Network**:

**Console Error:**
- `Network Error` → Backend tidak berjalan atau URL salah
- `CORS Error` → Periksa CORS di backend (seharusnya sudah di-setup)
- `401 Unauthorized` → Credentials salah atau admin belum dibuat

**Network Tab:**
- Cari request ke `/api/auth/login`
- Klik dan lihat response
- Status 500 → Error di server (cek terminal backend)
- Status 404 → Route tidak ditemukan
- Status 0 atau Failed → Backend tidak berjalan

#### 6. Buat Admin User

Jika belum membuat admin user:

```bash
cd backend
npm run create-admin
```

Atau:
```bash
node backend/scripts/createAdmin.js
```

**Pastikan output:**
```
✅ Admin user created successfully!
Username: admin
Password: admin123
```

#### 7. Test Login dengan curl (Optional)

Test API login langsung:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Harus return JSON dengan token.**

### 🔧 Quick Fix Checklist

- [ ] Backend berjalan di terminal (`npm run dev` di folder backend)
- [ ] Frontend berjalan di terminal (`npm start` di folder frontend)
- [ ] File `backend/.env` ada dan dikonfigurasi
- [ ] File `frontend/.env` ada dengan `VITE_API_URL=http://localhost:5000/api`
- [ ] Database MySQL berjalan
- [ ] Database `bem_isi_yogyakarta` sudah dibuat
- [ ] Admin user sudah dibuat (`npm run create-admin`)
- [ ] Port 5000 tidak digunakan aplikasi lain
- [ ] Tidak ada firewall yang memblokir port 5000

### 🐛 Error Lainnya

#### "Cannot find module"
```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install
```

#### "Port already in use"
```bash
# Cari process yang menggunakan port 5000
lsof -i :5000  # Linux/Mac
netstat -ano | findstr :5000  # Windows

# Kill process atau ubah port di .env
```

#### "Database connection error"
- Pastikan MySQL service berjalan
- Periksa username/password di `.env`
- Test koneksi: `mysql -u root -p`

#### "Invalid credentials"
- Pastikan admin user sudah dibuat
- Coba buat ulang: `npm run create-admin`
- Pastikan menggunakan: username `admin`, password `admin123`

### 📞 Masih Error?

1. **Periksa semua terminal** untuk error messages
2. **Periksa browser console** (F12) untuk error JavaScript
3. **Periksa Network tab** untuk melihat request/response
4. **Periksa terminal backend** untuk error server
5. **Restart semua service:**
   - Stop backend (Ctrl+C)
   - Stop frontend (Ctrl+C)
   - Restart MySQL jika perlu
   - Start backend lagi
   - Start frontend lagi

### 💡 Tips

- Selalu buka browser console (F12) saat debugging
- Periksa terminal backend untuk error messages
- Pastikan semua dependencies terinstall
- Gunakan `npm run dev` untuk backend (auto-reload)
- Clear browser cache jika perlu

