# Panduan Setup Website BEM FSRD ISI Yogyakarta

## 📋 Prerequisites

Sebelum memulai, pastikan Anda telah menginstall:

- **Node.js** (v16 atau lebih baru) - [Download](https://nodejs.org/)
- **MySQL** (v8.0 atau lebih baru) - [Download](https://dev.mysql.com/downloads/)
- **npm** atau **yarn** (biasanya sudah termasuk dengan Node.js)
- **Git** (opsional, untuk clone repository)

## 🚀 Langkah-langkah Setup

### 1. Clone atau Download Project

```bash
git clone <repository-url>
cd gabut
```

### 2. Setup Database MySQL

#### a. Buat Database

```bash
mysql -u root -p
```

Kemudian jalankan:

```sql
CREATE DATABASE bem_isi_yogyakarta;
exit;
```

#### b. Import Schema Database

```bash
cd backend
mysql -u root -p bem_isi_yogyakarta < database/schema.sql
```

Atau jalankan migration script:

```bash
npm run migrate
```

#### c. Buat Admin User

Setelah database dibuat, buat user admin pertama. Anda bisa menggunakan script berikut atau langsung di database:

**Opsi 1: Menggunakan Node.js script**

Buat file `backend/scripts/createAdmin.js`:

```javascript
const bcrypt = require('bcryptjs');
const db = require('../config/database');
require('dotenv').config();

async function createAdmin() {
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  await db.query(
    'INSERT INTO users (username, email, password, role, full_name) VALUES (?, ?, ?, ?, ?)',
    ['admin', 'admin@isi.ac.id', hashedPassword, 'admin', 'Administrator']
  );
  
  console.log('Admin user created!');
  console.log('Username: admin');
  console.log('Password: admin123');
  process.exit(0);
}

createAdmin();
```

Jalankan:

```bash
node backend/scripts/createAdmin.js
```

**Opsi 2: Manual di MySQL**

```sql
-- Generate hash untuk password 'admin123' menggunakan bcrypt
-- Gunakan online tool atau Node.js untuk generate hash
-- Contoh hash (harus digenerate ulang):
INSERT INTO users (username, email, password, role, full_name) 
VALUES ('admin', 'admin@isi.ac.id', '$2b$10$hashed_password_here', 'admin', 'Administrator');
```

### 3. Setup Backend

```bash
cd backend
npm install
```

#### Buat file `.env`

Copy dari `.env.example` atau buat file baru:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bem_isi_yogyakarta
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
UPLOAD_PATH=./uploads
NODE_ENV=development
```

**Penting:** Ganti nilai-nilai sesuai dengan konfigurasi MySQL Anda.

### 4. Setup Frontend

```bash
cd frontend
npm install
```

#### Buat file `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Menjalankan Aplikasi

#### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

Backend akan berjalan di `http://localhost:5000`

#### Terminal 2 - Frontend

```bash
cd frontend
npm start
```

Frontend akan berjalan di `http://localhost:3000`

## 🔐 Default Login Credentials

Setelah setup selesai, gunakan kredensial berikut untuk login ke admin panel:

- **Username:** `admin`
- **Password:** `admin123`

**⚠️ PENTING:** Segera ubah password default setelah login pertama kali!

## 📁 Struktur Direktori

```
bem-isi-yogyakarta/
├── backend/                 # Backend API (Node.js/Express)
│   ├── config/            # Konfigurasi database
│   ├── controllers/       # Controller untuk setiap route
│   ├── middleware/        # Middleware (auth, upload)
│   ├── routes/            # Route definitions
│   ├── database/          # Database schema & migrations
│   ├── uploads/           # File uploads (images)
│   └── server.js          # Entry point
├── frontend/              # Frontend (React)
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── layouts/       # Layout components
│   │   ├── services/     # API services
│   │   └── context/       # React context
│   └── package.json
└── README.md
```

## 🛠️ Troubleshooting

### Database Connection Error

- Pastikan MySQL service berjalan
- Periksa kredensial di file `.env`
- Pastikan database sudah dibuat

### Port Already in Use

Jika port 5000 atau 3000 sudah digunakan:

- Backend: Ubah `PORT` di `backend/.env`
- Frontend: Ubah di `frontend/vite.config.js`

### Module Not Found

Jalankan `npm install` di folder `backend` dan `frontend`

### Image Upload Not Working

- Pastikan folder `backend/uploads` ada dan memiliki permission write
- Periksa konfigurasi `UPLOAD_PATH` di `.env`

## 📝 Catatan Penting

1. **Security:** 
   - Ganti `JWT_SECRET` dengan string random yang kuat
   - Jangan commit file `.env` ke repository
   - Ubah password default admin

2. **Production:**
   - Gunakan environment variables untuk konfigurasi
   - Setup HTTPS
   - Gunakan database production yang aman
   - Setup backup database secara berkala

3. **File Uploads:**
   - Pastikan folder uploads memiliki permission yang tepat
   - Pertimbangkan menggunakan cloud storage untuk production

## 🆘 Bantuan

Jika mengalami masalah, periksa:
- Log error di terminal
- Console browser untuk error frontend
- Database connection
- File `.env` configuration

## 📚 Dokumentasi API

API documentation tersedia di:
- `http://localhost:5000/api/health` - Health check

Endpoint utama:
- `/api/auth` - Authentication
- `/api/news` - News/Articles
- `/api/programs` - Programs
- `/api/events` - Events/Calendar
- `/api/gallery` - Gallery
- `/api/comments` - Comments
- `/api/contact` - Contact messages
- `/api/newsletter` - Newsletter
- `/api/categories` - Categories
- `/api/about` - About sections
- `/api/social-media` - Social media links

