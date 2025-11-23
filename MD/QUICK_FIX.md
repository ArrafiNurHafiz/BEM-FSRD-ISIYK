# Quick Fix: Server Error di Login

## 🔧 Langkah Cepat Mengatasi "Server error"

### 1. Pastikan Backend Berjalan

```bash
cd backend
npm run dev
```

**Harus muncul:**
```
🚀 Server running on port 5000
📡 API available at http://localhost:5000/api
🌍 Environment: development
🔐 JWT Secret: ✅ Set
💾 Database: bem_isi_yogyakarta
✅ Database connected successfully
```

**Jika ada error:**
- ❌ JWT Secret: NOT SET → Tambahkan `JWT_SECRET=...` di `backend/.env`
- ❌ Database connection error → Periksa kredensial di `.env`

### 2. Buat File .env di Backend

Jika belum ada, buat file `backend/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bem_isi_yogyakarta
JWT_SECRET=your_super_secret_key_min_32_chars_long
JWT_EXPIRES_IN=7d
UPLOAD_PATH=./uploads
NODE_ENV=development
```

**PENTING:** Ganti `your_mysql_password` dan `your_super_secret_key_min_32_chars_long` dengan nilai yang benar!

### 3. Buat File .env di Frontend

Buat file `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Buat Database dan Admin User

```bash
# Buat database
mysql -u root -p
CREATE DATABASE bem_isi_yogyakarta;
exit;

# Import schema
cd backend
mysql -u root -p bem_isi_yogyakarta < database/schema.sql

# Atau jalankan migration
npm run migrate

# Buat admin user
npm run create-admin
```

### 5. Test Backend API

Buka browser, kunjungi:
```
http://localhost:5000/api/health
```

Harus muncul JSON response.

### 6. Restart Semua

1. Stop backend (Ctrl+C)
2. Stop frontend (Ctrl+C)
3. Start backend: `cd backend && npm run dev`
4. Start frontend: `cd frontend && npm start`
5. Refresh browser di `http://localhost:3000/admin/login`

### 7. Login

- Username: `admin`
- Password: `admin123`

## ✅ Checklist

- [ ] Backend berjalan tanpa error
- [ ] File `backend/.env` ada dan lengkap
- [ ] File `frontend/.env` ada dengan `VITE_API_URL`
- [ ] Database MySQL berjalan
- [ ] Database `bem_isi_yogyakarta` sudah dibuat
- [ ] Schema database sudah di-import
- [ ] Admin user sudah dibuat (`npm run create-admin`)
- [ ] `http://localhost:5000/api/health` mengembalikan JSON
- [ ] Frontend berjalan di `http://localhost:3000`

## 🐛 Masalah Umum

### "JWT_SECRET tidak ditemukan"
**Solusi:** Tambahkan `JWT_SECRET=...` di `backend/.env`

### "Database connection error"
**Solusi:** 
- Pastikan MySQL berjalan
- Periksa username/password di `.env`
- Pastikan database sudah dibuat

### "Cannot find module"
**Solusi:** 
```bash
cd backend && npm install
cd ../frontend && npm install
```

### "Port 5000 already in use"
**Solusi:**
- Ubah PORT di `backend/.env` ke port lain (misal: 5001)
- Update `frontend/.env` dengan port baru

## 📞 Masih Error?

1. Buka browser console (F12)
2. Lihat tab Network, cari request ke `/api/auth/login`
3. Klik request tersebut, lihat Response
4. Copy error message dan periksa terminal backend
5. Periksa file `TROUBLESHOOTING.md` untuk detail lebih lanjut

