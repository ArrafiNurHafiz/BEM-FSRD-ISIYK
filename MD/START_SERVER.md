# Cara Menjalankan Server

## Network Error - Solusi

Jika Anda mendapat error "Network Error", berarti backend server tidak berjalan.

### Langkah-langkah:

1. **Buka terminal baru dan masuk ke folder backend:**
   ```bash
   cd backend
   ```

2. **Jalankan server:**
   ```bash
   npm run dev
   ```

3. **Pastikan server berjalan dengan baik:**
   Anda akan melihat output seperti:
   ```
   🚀 Server running on port 5000
   📡 API available at http://localhost:5000/api
   🌍 Environment: development
   🔐 JWT Secret: ✅ Set
   💾 Database: bem_isi_yogyakarta
   ✅ Database connected successfully
   ```

4. **Verifikasi server berjalan:**
   Buka browser atau terminal lain, test endpoint:
   ```bash
   curl http://localhost:5000/api/health
   ```
   
   Seharusnya mengembalikan:
   ```json
   {"success":true,"message":"BEM FSRD ISI Yogyakarta API is running",...}
   ```

### Jika Port 5000 Sudah Terpakai:

1. **Kill process di port 5000:**
   ```bash
   cd backend
   npm run kill-port
   ```

2. **Atau manual:**
   ```bash
   lsof -ti:5000 | xargs kill -9
   ```

3. **Kemudian jalankan server lagi:**
   ```bash
   npm run dev
   ```

### Menjalankan Frontend dan Backend Bersamaan:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### Troubleshooting:

- **Error: "Cannot find module"** → Jalankan `npm install` di folder backend
- **Error: "Database connection failed"** → Periksa file `.env` di folder backend
- **Error: "Port already in use"** → Gunakan `npm run kill-port` atau ubah PORT di `.env`

