# Website BEM FSRD Institut Seni Indonesia Yogyakarta

Website dinamis untuk Badan Eksekutif Mahasiswa FSRD (BEM FSRD) Institut Seni Indonesia Yogyakarta. Platform ini menyediakan sistem manajemen konten lengkap untuk mengelola berita, program kerja, galeri, kegiatan, dan aspirasi mahasiswa.

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Teknologi](#-teknologi)
- [Prerequisites](#-prerequisites)
- [Instalasi Lengkap](#-instalasi-lengkap)
  - [1. Persiapan](#1-persiapan)
  - [2. Setup Database](#2-setup-database)
  - [3. Setup Backend](#3-setup-backend)
  - [4. Setup Frontend](#4-setup-frontend)
  - [5. Menjalankan Aplikasi](#5-menjalankan-aplikasi)
- [Hosting/Deployment](#-hostingdeployment)
- [Konfigurasi](#-konfigurasi)
- [Default Admin Account](#-default-admin-account)
- [Struktur Project](#-struktur-project)
- [Troubleshooting](#-troubleshooting)
- [Security Features](#-security-features)
- [License](#-license)

## 🎨 Fitur Utama

### Frontend (Public)
- **Beranda**: Hero slider, berita terbaru, kegiatan mendatang, program kerja, dan galeri
- **Tentang Kami**: Karakteristik ISI Yogyakarta, sejarah, visi misi, struktur organisasi dengan foto profil
- **Program Kerja**: Kategori program (Seni Rupa, Musik, Tari, Teater, Media) dengan detail lengkap
- **Berita & Artikel**: Sistem blog dengan kategori, komentar, dan pencarian
- **Galeri**: Portfolio digital dengan filter berdasarkan jenis seni dan batch
- **Kalender Kegiatan**: Event calendar dengan fitur RSVP
- **Kontak**: Form kontak dan kotak aspirasi dengan opsi pengiriman anonim
- **Newsletter**: Sistem berlangganan newsletter

### Backend (Admin Panel)
- **Dashboard**: Statistik lengkap (berita, program, kegiatan, galeri, aspirasi)
- **Manajemen Berita**: CRUD berita dengan kategori, status draft/published, dan komentar
- **Manajemen Program**: CRUD program kerja dengan kategori dan status
- **Manajemen Kegiatan**: CRUD kegiatan dengan kalender dan RSVP
- **Manajemen Galeri**: Upload dan organisasi foto dengan batch
- **Manajemen Aspirasi**: Lihat, filter, dan update status aspirasi mahasiswa
- **Manajemen Struktur Organisasi**: Upload foto dan informasi anggota BEM
- **Manajemen Hero Slider**: Upload dan urutkan gambar slider beranda
- **Manajemen Kategori**: Kategori untuk berita, program, dan galeri
- **Manajemen Komentar**: Approve/reject komentar pada berita
- **Manajemen Kontak**: Lihat dan kelola pesan kontak
- **Manajemen Newsletter**: Lihat daftar subscriber
- **Manajemen User**: Tambah/edit user dengan role (admin, editor, staff)
- **Manajemen Media Sosial**: Update link media sosial
- **Manajemen About**: Update konten halaman tentang kami
- **Manajemen Chairman Greeting**: Update sambutan ketua BEM

## 🛠️ Teknologi

### Frontend
- **React.js 18.2.0** - UI Framework
- **Vite 4.4.9** - Build tool dan dev server
- **Tailwind CSS 3.3.3** - Utility-first CSS framework
- **React Router DOM 6.16.0** - Client-side routing
- **Axios 1.5.0** - HTTP client
- **React Icons 4.11.0** - Icon library
- **React Slick 0.29.0** - Carousel component

### Backend
- **Node.js** - Runtime environment
- **Express.js 4.18.2** - Web framework
- **MySQL2 3.6.0** - MySQL database driver
- **JWT (jsonwebtoken 9.0.2)** - Authentication
- **Bcryptjs 2.4.3** - Password hashing
- **Multer 1.4.5** - File upload handling
- **Express Validator 7.0.1** - Input validation
- **Nodemailer 6.9.4** - Email functionality
- **CORS 2.8.5** - Cross-origin resource sharing
- **Dotenv 16.3.1** - Environment variables

## 📋 Prerequisites

Sebelum memulai instalasi, pastikan Anda telah menginstall:

1. **Node.js** (v16.0.0 atau lebih baru)
   ```bash
   node --version  # Cek versi Node.js
   ```
   Download: https://nodejs.org/

2. **MySQL** (v8.0 atau lebih baru)
   ```bash
   mysql --version  # Cek versi MySQL
   ```
   Download: https://dev.mysql.com/downloads/mysql/

3. **npm** atau **yarn** (biasanya sudah termasuk dengan Node.js)
   ```bash
   npm --version  # Cek versi npm
   ```

4. **Git** (opsional, untuk clone repository)
   ```bash
   git --version  # Cek versi Git
   ```

## 🚀 Instalasi Lengkap

### 1. Persiapan

```bash
cd gabut
```

#### Pastikan Port Tersedia
Aplikasi ini menggunakan:
- **Port 3000** untuk Frontend (Vite dev server)
- **Port 5000** untuk Backend API

Pastikan kedua port ini tidak digunakan aplikasi lain. Jika digunakan, Anda bisa mengubahnya di:
- Frontend: `frontend/vite.config.js` (server.port)
- Backend: `backend/.env` (PORT)

### 2. Setup Database

#### 2.1. Buat Database MySQL

Login ke MySQL:
```bash
mysql -u root -p
```

Buat database:
```sql
CREATE DATABASE bem_isi_yogyakarta;
USE bem_isi_yogyakarta;
exit;
```

#### 2.2. Import Schema Database

**Opsi 1: Menggunakan file SQL (Recommended)**
```bash
mysql -u root -p bem_isi_yogyakarta < backend/database/schema.sql
```

**Opsi 2: Menggunakan script migrate**
```bash
cd backend
npm install  # Install dependencies terlebih dahulu
npm run migrate
```

**Opsi 3: Manual import**
1. Buka MySQL Workbench atau phpMyAdmin
2. Pilih database `bem_isi_yogyakarta`
3. Import file `backend/database/schema.sql`

#### 2.3. Verifikasi Database

Verifikasi bahwa tabel sudah dibuat:
```bash
mysql -u root -p bem_isi_yogyakarta -e "SHOW TABLES;"
```

Anda seharusnya melihat tabel-tabel seperti: `users`, `news`, `categories`, `programs`, `events`, `gallery`, dll.

### 3. Setup Backend

#### 3.1. Install Dependencies

```bash
cd backend
npm install
```

Ini akan menginstall semua package yang terdaftar di `backend/package.json`.

#### 3.2. Buat File Environment (.env)

Buat file `.env` di folder `backend/`:

```bash
cd backend
touch .env
# Atau buat manual menggunakan text editor
```

Isi file `.env` dengan konfigurasi berikut:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bem_isi_yogyakarta

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRES_IN=7d

# Upload Configuration
UPLOAD_PATH=./uploads

# Email Configuration (Opsional, untuk fitur newsletter)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

**⚠️ PENTING:**
- Ganti `your_mysql_password` dengan password MySQL Anda
- Ganti `your_super_secret_jwt_key_minimum_32_characters_long` dengan string acak yang panjang (minimal 32 karakter) untuk keamanan
- Jika tidak menggunakan email, bagian EMAIL_* bisa diabaikan

**Contoh JWT_SECRET yang aman:**
```bash
# Generate random secret (Linux/Mac)
openssl rand -base64 32

# Atau gunakan string panjang acak
JWT_SECRET=BEM_FSRD_ISI_YOGYAKARTA_2025_SECRET_KEY_CHANGE_THIS_IN_PRODUCTION
```

#### 3.3. Buat Folder Uploads

Folder `uploads` akan dibuat otomatis saat aplikasi berjalan, tetapi Anda bisa membuatnya manual:

```bash
cd backend
mkdir -p uploads/{news,gallery,programs,events,organization,hero-slider,chairman,about,avatars,general}
```

#### 3.4. Test Koneksi Database

Jalankan server untuk test koneksi:
```bash
cd backend
npm start
```

Jika berhasil, Anda akan melihat:
```
✅ Database connected successfully
🚀 Server running on port 5000
📡 API available at http://localhost:5000/api
🌍 Environment: development
🔐 JWT Secret: ✅ Set
💾 Database: bem_isi_yogyakarta
```

Tekan `Ctrl+C` untuk menghentikan server.

### 4. Setup Frontend

#### 4.1. Install Dependencies

```bash
cd frontend
npm install
```

Ini akan menginstall semua package yang terdaftar di `frontend/package.json`.

#### 4.2. Buat File Environment (.env)

Buat file `.env` di folder `frontend/`:

```bash
cd frontend
touch .env
# Atau buat manual menggunakan text editor
```

Isi file `.env` dengan:

```env
VITE_API_URL=http://localhost:5000/api
```

**Untuk Production:**
```env
VITE_API_URL=https://your-domain.com/api
```

#### 4.3. Verifikasi Konfigurasi

Pastikan file `frontend/src/services/api.js` menggunakan environment variable:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

### 5. Menjalankan Aplikasi

#### 5.1. Menjalankan Backend

Buka terminal pertama:
```bash
cd backend
npm run dev
```

Atau untuk production:
```bash
npm start
```

Backend akan berjalan di: **http://localhost:5000**

#### 5.2. Menjalankan Frontend

Buka terminal kedua:
```bash
cd frontend
npm run dev
```

Atau:
```bash
npm start
```

Frontend akan berjalan di: **http://localhost:3000**

#### 5.3. Akses Aplikasi

- **Website Public**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🚀 Hosting/Deployment

Untuk menghosting aplikasi ke production, silakan baca panduan lengkap di [DEPLOY.md](./DEPLOY.md).

### Opsi Hosting

1. **VPS (Recommended)** - Full control, performa tinggi
   - Provider: DigitalOcean, Vultr, AWS EC2, Google Cloud
   - Lihat: [Deploy ke VPS](#-deploy-ke-vps-recommended) di DEPLOY.md

2. **Shared Hosting** - Murah, mudah setup
   - Provider: Hostinger, Niagahoster, RumahWeb
   - Lihat: [Deploy ke Shared Hosting](#-deploy-ke-shared-hosting) di DEPLOY.md

3. **Cloud Platform (PaaS)** - Auto-scaling, managed services
   - Provider: Railway, Render, Vercel, Heroku
   - Lihat: [Deploy ke Cloud Platform](#-deploy-ke-cloud-platform) di DEPLOY.md

### Quick Deploy Checklist

- [ ] Build frontend: `cd frontend && npm run build`
- [ ] Setup production `.env` untuk backend dan frontend
- [ ] Setup database di production server
- [ ] Deploy backend dengan PM2 atau process manager
- [ ] Deploy frontend build files
- [ ] Setup Nginx reverse proxy
- [ ] Setup SSL/HTTPS dengan Let's Encrypt
- [ ] Configure firewall
- [ ] Setup monitoring dan backup
- [ ] Test semua fitur di production

**Dokumentasi Lengkap:** 
- [DEPLOY.md](./DEPLOY.md) - Panduan deployment lengkap
- [PRODUCTION_READY.md](./PRODUCTION_READY.md) - ✅ Checklist production-ready features

## ✅ Production Ready

Aplikasi sudah dimodifikasi dan siap untuk deployment ke production! Lihat [PRODUCTION_READY.md](./PRODUCTION_READY.md) untuk detail perubahan dan checklist.

**Features Production-Ready:**
- ✅ Security headers dan CORS configuration
- ✅ Enhanced error handling dan logging
- ✅ Database connection pooling optimized
- ✅ Production build optimization
- ✅ PM2 process management ready
- ✅ Health check endpoint
- ✅ Graceful shutdown
- ✅ Production startup scripts

## 👤 Default Admin Account

Setelah setup database selesai, buat admin pertama:

```bash
cd backend
npm run create-admin
```

**Default Credentials:**
- **Username**: `BEMYK`
- **Password**: `admin-bemyk`
- **Email**: `bemyk@isi.ac.id`
- **Role**: `admin`

**⚠️ PENTING:** 
- Segera ubah password setelah login pertama kali!
- Untuk mengubah password admin, jalankan:
  ```bash
  npm run update-admin
  ```

## 📁 Struktur Project

```
gabut/
├── backend/                    # Backend API Server
│   ├── config/                 # Konfigurasi
│   │   └── database.js         # Koneksi database
│   ├── controllers/            # Business logic
│   │   ├── authController.js
│   │   ├── newsController.js
│   │   ├── programController.js
│   │   ├── eventController.js
│   │   ├── galleryController.js
│   │   ├── aspirationController.js
│   │   └── ...
│   ├── database/               # Database scripts
│   │   ├── schema.sql         # Schema utama
│   │   ├── migrate.js         # Migration script
│   │   └── migrations/        # Migration files
│   ├── middleware/             # Middleware
│   │   ├── auth.js            # JWT authentication
│   │   └── upload.js          # File upload handling
│   ├── routes/                 # API routes
│   │   ├── auth.js
│   │   ├── news.js
│   │   ├── programs.js
│   │   └── ...
│   ├── scripts/                # Utility scripts
│   │   ├── createAdmin.js     # Buat admin user
│   │   ├── updateAdmin.js     # Update admin password
│   │   └── ...
│   ├── uploads/                # Uploaded files
│   │   ├── news/
│   │   ├── gallery/
│   │   ├── programs/
│   │   └── ...
│   ├── .env                    # Environment variables (BUAT MANUAL)
│   ├── server.js              # Entry point
│   └── package.json
│
├── frontend/                   # Frontend React App
│   ├── public/                 # Static files
│   │   └── images/            # Logo, background images
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── ...
│   │   ├── pages/              # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── News.jsx
│   │   │   ├── admin/          # Admin pages
│   │   │   └── ...
│   │   ├── layouts/            # Layout components
│   │   │   ├── MainLayout.jsx
│   │   │   └── AdminLayout.jsx
│   │   ├── context/            # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── services/           # API services
│   │   │   └── api.js
│   │   ├── utils/              # Utility functions
│   │   │   └── imageUrl.js
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── .env                    # Environment variables (BUAT MANUAL)
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind configuration
│   └── package.json
│
└── README.md                   # Dokumentasi ini
```

## 🔧 Konfigurasi

### Environment Variables

#### Backend (.env)
| Variable | Deskripsi | Default | Required |
|----------|-----------|---------|----------|
| `PORT` | Port untuk backend server | `5000` | No |
| `NODE_ENV` | Environment (development/production) | `development` | No |
| `DB_HOST` | MySQL host | `localhost` | Yes |
| `DB_USER` | MySQL username | `root` | Yes |
| `DB_PASSWORD` | MySQL password | - | Yes |
| `DB_NAME` | Nama database | `bem_isi_yogyakarta` | Yes |
| `JWT_SECRET` | Secret key untuk JWT | - | **Yes** |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` | No |
| `UPLOAD_PATH` | Path untuk file uploads | `./uploads` | No |
| `EMAIL_HOST` | SMTP host (opsional) | - | No |
| `EMAIL_PORT` | SMTP port (opsional) | `587` | No |
| `EMAIL_USER` | Email username (opsional) | - | No |
| `EMAIL_PASS` | Email password (opsional) | - | No |

#### Frontend (.env)
| Variable | Deskripsi | Default | Required |
|----------|-----------|---------|----------|
| `VITE_API_URL` | URL backend API | `http://localhost:5000/api` | Yes |

### Port Configuration

**Mengubah Port Backend:**
1. Edit `backend/.env`: `PORT=5001`
2. Edit `frontend/.env`: `VITE_API_URL=http://localhost:5001/api`
3. Edit `frontend/vite.config.js`: `target: 'http://localhost:5001'`

**Mengubah Port Frontend:**
1. Edit `frontend/vite.config.js`: `server: { port: 3001 }`

## 🐛 Troubleshooting

### Masalah Umum

#### 1. Error: "Cannot find module"
```bash
# Solusi: Install ulang dependencies
cd backend && npm install
cd ../frontend && npm install
```

#### 2. Error: "Database connection failed"
- Pastikan MySQL service berjalan
- Cek kredensial di `backend/.env`
- Pastikan database `bem_isi_yogyakarta` sudah dibuat
- Test koneksi: `mysql -u root -p -e "USE bem_isi_yogyakarta;"`

#### 3. Error: "Port already in use"
```bash
# Cek port yang digunakan
# Linux/Mac
lsof -i :5000
lsof -i :3000

# Kill process
kill -9 <PID>

# Atau gunakan script
cd backend
npm run kill-port
```

#### 4. Error: "JWT_SECRET is not set"
- Pastikan file `backend/.env` ada
- Pastikan `JWT_SECRET` sudah diisi dengan string minimal 32 karakter

#### 5. Error: "Cannot GET /api/..."
- Pastikan backend server berjalan
- Cek URL di `frontend/.env` sesuai dengan port backend
- Pastikan CORS sudah dikonfigurasi di `backend/server.js`

#### 6. Error: "File upload failed"
- Pastikan folder `backend/uploads` ada dan memiliki permission write
- Cek `UPLOAD_PATH` di `backend/.env`
- Pastikan file tidak melebihi 5MB (default limit)

#### 7. Error: "Admin login failed"
- Pastikan admin user sudah dibuat: `npm run create-admin`
- Cek database: `SELECT * FROM users WHERE role='admin';`
- Reset password: `npm run update-admin`

#### 8. Image tidak muncul
- Pastikan backend server berjalan (images di-serve dari `/uploads`)
- Cek path file di database
- Pastikan file ada di folder `backend/uploads/`
- Cek permission folder uploads

#### 9. Frontend tidak connect ke backend
- Pastikan backend berjalan di port yang benar
- Cek `VITE_API_URL` di `frontend/.env`
- Cek proxy di `frontend/vite.config.js`
- Cek CORS di backend

#### 10. Build error saat production
```bash
# Clear cache
cd frontend
rm -rf node_modules dist
npm install
npm run build
```

### Log dan Debug

**Backend Logs:**
- Server logs muncul di terminal saat menjalankan `npm run dev`
- Error stack trace akan muncul jika `NODE_ENV=development`

**Frontend Logs:**
- Buka browser DevTools (F12) > Console
- Network tab untuk melihat API requests

**Database Logs:**
```bash
# Enable MySQL general log
mysql -u root -p
SET GLOBAL general_log = 'ON';
SET GLOBAL log_output = 'table';
SELECT * FROM mysql.general_log;
```

## 🔐 Security Features

- ✅ **JWT Authentication** - Token-based authentication untuk API
- ✅ **Password Hashing** - Menggunakan bcrypt dengan salt rounds
- ✅ **Input Validation** - Express Validator untuk validasi input
- ✅ **SQL Injection Prevention** - Prepared statements dengan MySQL2
- ✅ **XSS Protection** - React secara default mencegah XSS
- ✅ **File Upload Validation** - Validasi tipe dan ukuran file
- ✅ **CORS Configuration** - Kontrol akses cross-origin
- ✅ **Environment Variables** - Sensitive data tidak hardcoded
- ✅ **Role-based Access Control** - Admin, Editor, Staff roles

### Best Practices untuk Production

1. **Ganti JWT_SECRET** dengan string acak yang sangat panjang
2. **Ganti password default** admin setelah pertama kali login
3. **Set NODE_ENV=production** di production
4. **Gunakan HTTPS** untuk komunikasi
5. **Setup firewall** untuk membatasi akses database
6. **Backup database** secara berkala
7. **Monitor logs** untuk aktivitas mencurigakan
8. **Update dependencies** secara berkala
9. **Gunakan environment variables** untuk semua konfigurasi sensitif
10. **Limit file upload size** sesuai kebutuhan

## 📱 Responsive Design

Website dirancang responsif untuk berbagai ukuran layar:
- **Desktop**: 1920px+
- **Laptop**: 1024px - 1919px
- **Tablet**: 768px - 1023px
- **Mobile**: 320px - 767px

## 🎨 Color Palette

- **Primary Blue**: `#1e3a8a` (Blue 900)
- **Gold Accent**: `#d4af37` / `#eab308` (Gold/Yellow 500)
- **Background**: `#0f172a` (Slate 900)
- **Text**: `#f1f5f9` (Slate 100)
- **Accent**: `#3b82f6` (Blue 500)

## 📝 Scripts yang Tersedia

### Backend Scripts
```bash
npm start              # Jalankan server (production)
npm run dev            # Jalankan dengan nodemon (development)
npm run migrate        # Jalankan database migration
npm run create-admin   # Buat admin user
npm run update-admin    # Update admin password
npm run kill-port      # Kill process di port 5000
npm run fix-admin-role # Fix role admin user
npm run create-tables  # Buat tabel yang missing
npm run fix-images     # Fix path gambar
```

### Frontend Scripts
```bash
npm run dev            # Development server
npm run build          # Build untuk production
npm run preview        # Preview production build
npm start              # Alias untuk npm run dev
```

## 📞 Support

Jika mengalami masalah atau butuh bantuan:
1. Cek bagian [Troubleshooting](#-troubleshooting)
2. Cek file dokumentasi lain di root folder:
   - `DEPLOY.md` - Panduan hosting/deployment lengkap
   - `INSTALL.md` - Quick start guide instalasi
   - `ENV_CONFIG.md` - Panduan konfigurasi environment
   - `ADMIN_GUIDE.md` - Panduan admin panel
3. Cek issue di repository (jika menggunakan Git)

## 📄 License

MIT License

## 👥 Kontributor

Arrafi Nur Hafiz

---

**Selamat menggunakan Website BEM FSRD ISI Yogyakarta! 🎉**

Jika ada pertanyaan atau saran, silakan hubungi tim development.
