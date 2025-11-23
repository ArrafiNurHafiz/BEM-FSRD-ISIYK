# Debug: Gambar Tidak Muncul

## 🔍 Langkah Debugging

### 1. Periksa Path di Database
```sql
SELECT id, title, featured_image FROM news WHERE featured_image IS NOT NULL;
```

### 2. Periksa File Exists
```bash
# Cek file di server
ls -la backend/uploads/news/
ls -la backend/uploads/general/
```

### 3. Test URL Langsung
```bash
# Test apakah gambar bisa diakses
curl -I http://localhost:5000/uploads/news/nama-file.jpeg
```

Harus return: `HTTP/1.1 200 OK` dan `Content-Type: image/jpeg`

### 4. Periksa Browser Console
1. Buka browser console (F12)
2. Lihat tab **Network**
3. Cari request ke gambar (filter: Img)
4. Klik request tersebut
5. Lihat:
   - **Status**: Harus 200 OK
   - **Request URL**: Harus benar
   - **Response**: Harus gambar (bukan HTML error)

### 5. Periksa URL yang Digenerate
Di browser console, cek:
```javascript
// URL yang dihasilkan harus seperti:
http://localhost:5000/uploads/news/featured_image-xxx.jpeg
```

## ✅ Checklist

- [ ] File ada di server (`ls -la backend/uploads/news/`)
- [ ] Path di database benar (`SELECT featured_image FROM news`)
- [ ] URL bisa diakses (`curl -I http://localhost:5000/uploads/...`)
- [ ] Backend serve static files (`app.use('/uploads', ...)`)
- [ ] Frontend menggunakan `getImageUrl()`
- [ ] Browser console tidak ada error 404
- [ ] CORS tidak memblokir request

## 🔧 Quick Fix

Jika gambar masih tidak muncul:

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Hard refresh** (Ctrl+Shift+R atau Cmd+Shift+R)
3. **Periksa Network tab** di browser console
4. **Test URL langsung** di browser: `http://localhost:5000/uploads/news/nama-file.jpeg`

## 📝 Common Issues

### Issue 1: 404 Not Found
**Penyebab**: File tidak ada di lokasi yang di-specify di database
**Solusi**: 
```bash
cd backend
npm run move-images
```

### Issue 2: CORS Error
**Penyebab**: CORS tidak mengizinkan request gambar
**Solusi**: Pastikan CORS sudah di-setup di backend (sudah ada)

### Issue 3: Wrong Port
**Penyebab**: Frontend menggunakan port berbeda
**Solusi**: Pastikan `VITE_API_URL` di `.env` benar

### Issue 4: Path Mismatch
**Penyebab**: Path di database tidak sesuai dengan lokasi file
**Solusi**: 
```bash
cd backend
npm run move-images
```

