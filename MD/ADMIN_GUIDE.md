# Panduan Akses Admin Panel

## 🔐 Cara Masuk ke Admin Panel

### 1. Pastikan Aplikasi Berjalan

**Backend harus berjalan:**
```bash
cd backend
npm run dev
```
Backend harus berjalan di `http://localhost:5000`

**Frontend harus berjalan:**
```bash
cd frontend
npm start
```
Frontend harus berjalan di `http://localhost:3000`

### 2. Akses Halaman Login

Buka browser dan kunjungi:
```
http://localhost:3000/admin/login
```

Atau bisa juga:
```
http://localhost:3000/admin
```
(Akan otomatis redirect ke login jika belum login)

### 3. Login dengan Credentials

**Default Credentials:**
- **Username:** `admin`
- **Password:** `admin123`

⚠️ **PENTING:** Jika ini pertama kali setup, pastikan admin user sudah dibuat!

## 🛠️ Setup Admin User (Jika Belum Ada)

### Opsi 1: Menggunakan Script (Recommended)

```bash
cd backend
npm run create-admin
```

Script ini akan:
- Mengecek apakah admin sudah ada
- Membuat admin user baru jika belum ada
- Menampilkan credentials

### Opsi 2: Manual dengan Node.js

```bash
cd backend
node scripts/createAdmin.js
```

### Opsi 3: Manual di MySQL

1. Generate hash password untuk 'admin123' menggunakan bcrypt
2. Masuk ke MySQL:
```bash
mysql -u root -p bem_isi_yogyakarta
```

3. Insert user:
```sql
INSERT INTO users (username, email, password, role, full_name) 
VALUES ('admin', 'admin@isi.ac.id', '$2b$10$YOUR_BCRYPT_HASH_HERE', 'admin', 'Administrator');
```

## 📋 Fitur Admin Panel

Setelah login, Anda akan memiliki akses ke:

1. **Dashboard** - Overview statistik dan quick links
2. **Berita** - CRUD untuk berita dan artikel
3. **Program Kerja** - Manajemen program kerja
4. **Kegiatan** - Manajemen kalender kegiatan
5. **Galeri** - Upload dan kelola foto/karya
6. **Komentar** - Moderasi komentar (approve/reject)
7. **Pesan** - Kelola pesan dari form kontak
8. **Subscriber** - Daftar newsletter subscribers

## 🔒 Keamanan

### Mengubah Password Default

Setelah login pertama kali, **WAJIB** mengubah password default:

1. Login ke admin panel
2. (Fitur ubah password bisa ditambahkan di halaman profile)
3. Atau langsung update di database:

```sql
-- Generate hash baru untuk password baru Anda
-- Lalu update:
UPDATE users 
SET password = '$2b$10$NEW_HASH_HERE' 
WHERE username = 'admin';
```

### Tips Keamanan

- ✅ Ganti password default segera setelah setup
- ✅ Gunakan password yang kuat (minimal 8 karakter, kombinasi huruf, angka, simbol)
- ✅ Jangan share credentials dengan orang lain
- ✅ Logout setelah selesai menggunakan admin panel
- ✅ Jangan commit file `.env` ke repository

## 🐛 Troubleshooting

### Error: "Invalid credentials"

**Kemungkinan penyebab:**
1. Admin user belum dibuat
2. Password salah
3. Database belum di-setup

**Solusi:**
1. Pastikan database sudah di-migrate
2. Jalankan `npm run create-admin` di folder backend
3. Pastikan menggunakan username: `admin` dan password: `admin123`

### Error: "Access denied. No token provided"

**Kemungkinan penyebab:**
- Belum login atau session expired

**Solusi:**
- Login ulang di `/admin/login`

### Error: "Cannot connect to API"

**Kemungkinan penyebab:**
- Backend tidak berjalan
- Port berbeda
- CORS issue

**Solusi:**
1. Pastikan backend berjalan di `http://localhost:5000`
2. Periksa file `.env` di frontend: `VITE_API_URL=http://localhost:5000/api`
3. Restart backend server

### Halaman Login Tidak Muncul

**Kemungkinan penyebab:**
- Frontend tidak berjalan
- Route tidak terdaftar

**Solusi:**
1. Pastikan frontend berjalan: `npm start` di folder frontend
2. Akses `http://localhost:3000/admin/login` langsung
3. Periksa console browser untuk error

## 📞 Bantuan

Jika masih mengalami masalah:

1. Periksa terminal untuk error messages
2. Periksa console browser (F12)
3. Pastikan semua dependencies terinstall: `npm install`
4. Pastikan database connection berfungsi
5. Periksa file `.env` configuration

## 🔄 Logout

Untuk logout dari admin panel:
1. Klik tombol "Logout" di sidebar kiri bawah
2. Atau hapus token dari localStorage browser
3. Atau tutup browser (jika session tidak persistent)

Setelah logout, Anda akan di-redirect ke halaman login.

