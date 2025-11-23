# 📦 Panduan Instalasi Cepat

Panduan step-by-step untuk menginstall Website BEM FSRD ISI Yogyakarta.

## ⚡ Quick Start

### 1. Clone/Download Project
```bash
cd gabut
```

### 2. Setup Database
```bash
# Login ke MySQL
mysql -u root -p

# Buat database
CREATE DATABASE bem_isi_yogyakarta;
exit;

# Import schema
mysql -u root -p bem_isi_yogyakarta < backend/database/schema.sql
```

### 3. Setup Backend
```bash
cd backend
npm install

# Copy dan edit file .env
cp .env.example .env
# Edit .env dengan text editor favorit Anda
# Pastikan mengisi: DB_PASSWORD dan JWT_SECRET

# Buat admin user
npm run create-admin
```

### 4. Setup Frontend
```bash
cd ../frontend
npm install

# Copy dan edit file .env
cp .env.example .env
# File .env sudah benar untuk development
```

### 5. Jalankan Aplikasi

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

### 6. Akses Aplikasi
- Website: http://localhost:3000
- Admin: http://localhost:3000/admin/login
  - Username: `BEMYK`
  - Password: `admin-bemyk`

---

## 📝 Detail Setup

### File .env Backend

Buat file `backend/.env` dengan isi:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password_mysql_anda
DB_NAME=bem_isi_yogyakarta
JWT_SECRET=string_acak_minimal_32_karakter
JWT_EXPIRES_IN=7d
UPLOAD_PATH=./uploads
```

**Cara generate JWT_SECRET:**
```bash
openssl rand -base64 32
```

### File .env Frontend

Buat file `frontend/.env` dengan isi:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## ✅ Checklist Instalasi

- [ ] Node.js terinstall (v16+)
- [ ] MySQL terinstall (v8.0+)
- [ ] Database `bem_isi_yogyakarta` sudah dibuat
- [ ] Schema database sudah diimport
- [ ] Backend dependencies terinstall (`npm install` di folder backend)
- [ ] Frontend dependencies terinstall (`npm install` di folder frontend)
- [ ] File `backend/.env` sudah dibuat dan dikonfigurasi
- [ ] File `frontend/.env` sudah dibuat dan dikonfigurasi
- [ ] Admin user sudah dibuat (`npm run create-admin`)
- [ ] Backend server berjalan tanpa error
- [ ] Frontend server berjalan tanpa error
- [ ] Bisa akses website di http://localhost:3000
- [ ] Bisa login admin di http://localhost:3000/admin/login

---

## 🐛 Troubleshooting Cepat

**Error: Cannot find module**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Error: Port already in use**
```bash
# Kill process di port 5000 atau 3000
# Linux/Mac:
lsof -i :5000
kill -9 <PID>
```

**Error: Database connection failed**
- Cek MySQL service berjalan
- Cek kredensial di `backend/.env`
- Test: `mysql -u root -p -e "USE bem_isi_yogyakarta;"`

**Error: JWT_SECRET not set**
- Pastikan file `backend/.env` ada
- Pastikan `JWT_SECRET` sudah diisi

---

Untuk dokumentasi lengkap, lihat [README.md](./README.md)

