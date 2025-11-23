# Memperbaiki Error Login: "Server tidak dapat dijangkau"

## Masalah
Error: "Server tidak dapat dijangkau. Pastikan backend server berjalan."

## Solusi Lengkap

### Langkah 1: Pastikan Backend Server Berjalan

**Buka terminal baru dan jalankan:**

```bash
cd backend
npm run dev
```

Anda akan melihat output:
```
🚀 Server running on port 5000
📡 API available at http://localhost:5000/api
✅ Database connected successfully
```

**Jangan tutup terminal ini!** Biarkan server berjalan.

### Langkah 2: Buat File .env di Frontend (Opsional)

File `.env` membantu mengkonfigurasi URL API. Jika tidak ada, aplikasi akan menggunakan default.

**Cara membuat:**

```bash
cd frontend
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

**Atau buat manual:**
1. Buat file baru bernama `.env` di folder `frontend/`
2. Tambahkan baris: `VITE_API_URL=http://localhost:5000/api`
3. Simpan file

### Langkah 3: Restart Frontend Server

Setelah membuat `.env` (atau jika sudah ada), restart frontend:

```bash
cd frontend
# Tekan Ctrl+C untuk stop server
npm run dev
```

### Langkah 4: Verifikasi Koneksi

**Test apakah backend berjalan:**

```bash
curl http://localhost:5000/api/health
```

Seharusnya mengembalikan:
```json
{"success":true,"message":"BEM FSRD ISI Yogyakarta API is running",...}
```

**Atau buka di browser:**
```
http://localhost:5000/api/health
```

### Langkah 5: Coba Login Lagi

1. Buka halaman login: `http://localhost:3000/admin/login` (atau port yang digunakan)
2. Username: `admin`
3. Password: `admin123`
4. Klik "Masuk"

## Troubleshooting

### Error: "Port 5000 already in use"

```bash
cd backend
npm run kill-port
# atau
lsof -ti:5000 | xargs kill -9
```

Kemudian jalankan `npm run dev` lagi.

### Error: "Cannot find module"

```bash
cd backend
npm install
```

### Error: "Database connection failed"

Periksa file `backend/.env`:
- `DB_HOST=localhost`
- `DB_USER=root`
- `DB_PASSWORD=your_password`
- `DB_NAME=bem_isi_yogyakarta`

### Frontend tidak bisa connect ke backend

1. Pastikan backend berjalan di port 5000
2. Pastikan frontend menggunakan URL yang benar
3. Periksa file `frontend/.env` berisi `VITE_API_URL=http://localhost:5000/api`
4. Restart frontend server setelah membuat/mengubah `.env`

## Catatan Penting

- **Backend dan Frontend harus berjalan bersamaan**
- Backend biasanya di port 5000
- Frontend biasanya di port 3000 atau 3001
- File `.env` di frontend hanya perlu jika ingin mengubah URL API
- Setelah membuat/mengubah `.env`, **harus restart frontend server**

## Struktur Terminal yang Benar

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# Server running on port 5000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# VITE ready in XXX ms
```

Kedua terminal harus tetap terbuka dan server harus berjalan.

