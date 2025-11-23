# Fix: Gambar Tidak Muncul di Tampilan

## 🔴 Masalah
Gambar berhasil diupload di admin panel, tapi tidak muncul di tampilan website.

## ✅ Penyebab
1. **Path gambar tidak sesuai** - File disimpan di `uploads/general/` tapi path di database adalah `/uploads/news/`
2. **Middleware upload** - Tidak mendeteksi route dengan benar
3. **Frontend hardcoded URL** - Menggunakan `http://localhost:5000` hardcoded

## 🔧 Perbaikan yang Dilakukan

### 1. Middleware Upload (`upload.js`)
- ✅ Menggunakan `req.originalUrl` untuk deteksi route
- ✅ Deteksi route yang lebih akurat

### 2. Controller News (`newsController.js`)
- ✅ Menggunakan path file yang sebenarnya dari `req.file.path`
- ✅ Generate path relatif dari uploads directory
- ✅ Path disesuaikan dengan folder tempat file disimpan

### 3. Frontend - Utility Function
- ✅ Membuat `utils/imageUrl.js` untuk generate URL gambar
- ✅ Menggunakan environment variable untuk base URL
- ✅ Support untuk relative dan absolute path

### 4. Update Semua Halaman
- ✅ `Home.jsx` - Menggunakan `getImageUrl()`
- ✅ `News.jsx` - Menggunakan `getImageUrl()`
- ✅ `NewsDetail.jsx` - Menggunakan `getImageUrl()`
- ✅ `Programs.jsx` - Menggunakan `getImageUrl()`
- ✅ `ProgramDetail.jsx` - Menggunakan `getImageUrl()`
- ✅ `Events.jsx` - Menggunakan `getImageUrl()`
- ✅ `Gallery.jsx` - Menggunakan `getImageUrl()`
- ✅ `About.jsx` - Menggunakan `getImageUrl()`
- ✅ `admin/News.jsx` - Menggunakan `getImageUrl()`
- ✅ `admin/Gallery.jsx` - Menggunakan `getImageUrl()`

### 5. Fix Path Database
- ✅ Update path gambar yang sudah ada di database
- ✅ Path disesuaikan dengan lokasi file sebenarnya

## 📝 Cara Menggunakan

### Upload Gambar Baru:
1. Upload gambar melalui admin panel
2. File akan disimpan di folder yang sesuai (news/gallery/programs/events)
3. Path akan otomatis disimpan dengan benar di database
4. Gambar akan muncul di frontend

### Fix Gambar yang Sudah Ada:
```bash
cd backend
npm run fix-images
```

Script ini akan:
- Memindahkan file dari `general` ke folder yang sesuai
- Update path di database

## ✅ Verifikasi

1. **Cek file ada:**
   ```bash
   ls -la backend/uploads/general/
   ls -la backend/uploads/news/
   ```

2. **Test URL gambar:**
   ```bash
   curl -I http://localhost:5000/uploads/general/nama-file.jpg
   ```

3. **Cek path di database:**
   ```sql
   SELECT id, title, featured_image FROM news WHERE featured_image IS NOT NULL;
   ```

## 🐛 Jika Masih Tidak Muncul

1. **Periksa Browser Console (F12)**
   - Lihat error 404 untuk gambar
   - Periksa Network tab

2. **Periksa Path di Database**
   ```sql
   SELECT featured_image FROM news WHERE id = ?;
   ```

3. **Periksa File Exists**
   ```bash
   ls -la backend/uploads/general/nama-file.jpg
   ```

4. **Periksa Static File Serving**
   - Pastikan `app.use('/uploads', express.static(...))` ada di server.js
   - Pastikan folder uploads ada dan accessible

5. **CORS Issue**
   - Pastikan CORS sudah di-setup di backend
   - Periksa browser console untuk CORS error

## 📋 Checklist

- [x] Middleware upload diperbaiki
- [x] Controller menggunakan path yang benar
- [x] Frontend menggunakan utility function
- [x] Semua halaman di-update
- [x] Path database diperbaiki
- [x] Static file serving sudah setup

## 🔄 Untuk Gambar Baru

Gambar baru yang diupload akan otomatis:
- Disimpan di folder yang benar (news/gallery/programs/events)
- Path disimpan dengan benar di database
- Tampil di frontend dengan URL yang benar

