# Restart Server untuk Memuat Route Organization

## Masalah
Route `/api/organization` mengembalikan "Route not found" karena server belum memuat route baru.

## Solusi

### 1. Stop server yang sedang berjalan
```bash
cd backend
npm run kill-port
# atau
lsof -ti:5000 | xargs kill -9
```

### 2. Start server kembali
```bash
cd backend
npm run dev
```

### 3. Verifikasi route sudah terdaftar
```bash
curl http://localhost:5000/api/organization
```

Seharusnya mengembalikan:
```json
{"success":true,"data":[]}
```

atau jika ada data:
```json
{"success":true,"data":[...]}
```

## Catatan
- Jika menggunakan `nodemon`, server akan auto-restart saat file diubah
- Pastikan file `routes/organization.js` dan `controllers/organizationController.js` sudah ada
- Pastikan route sudah terdaftar di `server.js` dengan `app.use('/api/organization', organizationRoutes);`

