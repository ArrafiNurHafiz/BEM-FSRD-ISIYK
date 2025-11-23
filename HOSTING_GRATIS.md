# 🆓 Panduan Hosting Gratis - Website Online!

Panduan lengkap untuk hosting website BEM FSRD ISI Yogyakarta **100% GRATIS** sampai online!

## 📋 Pilihan Platform Hosting Gratis

Kita akan menggunakan kombinasi platform gratis:

1. **Backend + Database**: [Render.com](https://render.com) - Free tier dengan database gratis
2. **Frontend**: [Vercel.com](https://vercel.com) - Free tier untuk static sites

**Total Biaya: $0 (GRATIS SELAMANYA! 🎉)**

---

## 🚀 OPTION 1: Render + Vercel (RECOMMENDED)

### Keuntungan:
- ✅ **100% Gratis** selamanya
- ✅ **Auto-deploy** dari GitHub
- ✅ **Database gratis** (PostgreSQL)
- ✅ **SSL/HTTPS gratis** otomatis
- ✅ **Mudah setup**
- ✅ **Custom domain** support

---

## 📝 LANGKAH 1: Setup Backend di Render

### 1.1. Daftar Render

1. **Buka**: https://render.com
2. **Klik**: "Get Started for Free"
3. **Sign up** dengan GitHub account (recommended)
4. **Verify** email Anda

### 1.2. Connect GitHub Repository

1. Setelah login, klik **"New +"** → **"Blueprint"**
2. **Connect** repository GitHub Anda: `ArrafiNurHafiz/BEM-FSRD-ISIYK`
3. Render akan mendeteksi file `render.yaml` (akan kita buat)
4. Atau buat manual:

#### Create PostgreSQL Database (GRATIS)

1. **Klik**: "New +" → **"PostgreSQL"**
2. **Name**: `bem-fsrd-db` (atau nama lain)
3. **Database**: `bem_isi_yogyakarta`
4. **User**: (otomatis dibuat)
5. **Region**: Pilih terdekat (Singapore untuk Indonesia)
6. **Plan**: **Free** ($0/month)
7. **Klik**: "Create Database"
8. **SIMPAN** informasi database (akan muncul di dashboard):
   - **Host**
   - **Port**
   - **Database**
   - **User**
   - **Password** (Internal Database URL)

#### Create Backend Web Service

1. **Klik**: "New +" → **"Web Service"**
2. **Connect**: Repository GitHub Anda
3. **Settings**:
   - **Name**: `bem-fsrd-backend`
   - **Region**: Singapore (atau terdekat)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: **Free** ($0/month)

4. **Environment Variables** (Klik "Add Environment Variable"):
   ```
   NODE_ENV=production
   PORT=10000
   
   DB_HOST=[Host dari PostgreSQL database]
   DB_PORT=[Port dari PostgreSQL database]
   DB_USER=[User dari PostgreSQL database]
   DB_PASSWORD=[Password dari PostgreSQL database]
   DB_NAME=bem_isi_yogyakarta
   DB_SSL=true
   
   JWT_SECRET=[Buat secret key panjang minimal 32 karakter]
   JWT_EXPIRES_IN=7d
   
   FRONTEND_URL=[URL Vercel frontend nanti, contoh: https://your-site.vercel.app]
   ```
   
   **Generate JWT_SECRET:**
   ```bash
   openssl rand -base64 32
   ```
   
   Atau gunakan: `BEM_FSRD_ISI_YOGYAKARTA_2025_SECRET_KEY_CHANGE_THIS`

5. **Auto-Deploy**: ✅ Yes
6. **Klik**: "Create Web Service"

**Catatan**: URL backend akan seperti: `https://bem-fsrd-backend.onrender.com`

### 1.3. Update Database Schema (PostgreSQL)

Render menggunakan PostgreSQL, kita perlu migrate database:

1. **Install PostgreSQL driver** (jika belum):
   ```bash
   cd backend
   npm install pg
   ```

2. **Update database config** untuk support PostgreSQL

3. **Import database schema** (akan kita buatkan script)

**CATATAN**: Kita akan menggunakan PostgreSQL gratis di Render, jadi perlu sedikit adaptasi.

---

## 📝 LANGKAH 2: Setup Frontend di Vercel

### 2.1. Daftar Vercel

1. **Buka**: https://vercel.com
2. **Klik**: "Sign Up"
3. **Sign up** dengan GitHub account (recommended)
4. **Verify** email Anda

### 2.2. Deploy Frontend

1. **Klik**: "Add New..." → **"Project"**
2. **Import** repository GitHub Anda: `ArrafiNurHafiz/BEM-FSRD-ISIYK`
3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables** (Klik "Environment Variables"):
   ```
   VITE_API_URL=https://bem-fsrd-backend.onrender.com/api
   ```
   (Ganti dengan URL backend Render Anda)

5. **Klik**: "Deploy"

**Catatan**: URL frontend akan seperti: `https://bem-fsrd-isiyk.vercel.app`

### 2.3. Update Backend CORS

Setelah frontend ter-deploy, update environment variable di Render backend:
```
FRONTEND_URL=https://bem-fsrd-isiyk.vercel.app
```

---

## 🗄️ LANGKAH 3: Setup Database PostgreSQL

Karena Render menggunakan PostgreSQL (bukan MySQL), kita perlu:

### Opsi A: Convert MySQL ke PostgreSQL (Recommended untuk production)

1. **Update backend** untuk support PostgreSQL
2. **Migrate schema** MySQL ke PostgreSQL
3. **Update connection string**

### Opsi B: Gunakan MySQL di Render (Butuh upgrade ke paid plan)

Render free tier hanya support PostgreSQL. Untuk MySQL gratis, bisa gunakan:
- **PlanetScale** (MySQL gratis)
- **Aiven** (MySQL free tier)

---

## 🔧 LANGKAH 4: Konfigurasi File

### File yang akan dibuat/diupdate:

1. ✅ `render.yaml` - Konfigurasi Render
2. ✅ `vercel.json` - Konfigurasi Vercel
3. ✅ Update backend untuk support PostgreSQL
4. ✅ Database migration script untuk PostgreSQL

---

## 📋 CHECKLIST SETUP

### Backend (Render):
- [ ] Daftar Render account
- [ ] Buat PostgreSQL database
- [ ] Buat Web Service untuk backend
- [ ] Set environment variables
- [ ] Deploy backend
- [ ] Test backend API: `https://your-backend.onrender.com/api/health`

### Frontend (Vercel):
- [ ] Daftar Vercel account
- [ ] Import GitHub repository
- [ ] Set environment variables (VITE_API_URL)
- [ ] Deploy frontend
- [ ] Test frontend: `https://your-site.vercel.app`

### Database:
- [ ] Import database schema ke PostgreSQL
- [ ] Buat admin user
- [ ] Test database connection

### Final:
- [ ] Update CORS di backend (FRONTEND_URL)
- [ ] Test login admin
- [ ] Test semua fitur website

---

## 🌐 ALTERNATIF: Railway (All-in-One)

Jika ingin semuanya di satu platform, bisa gunakan **Railway**:

### Railway Setup:

1. **Daftar**: https://railway.app
2. **Connect** GitHub repository
3. **Add Services**:
   - MySQL Database (gratis)
   - Backend Web Service
   - Frontend Static Site

**Keuntungan Railway:**
- ✅ Semua di satu tempat
- ✅ MySQL gratis
- ✅ Auto-deploy
- ✅ Mudah setup

**Kekurangan:**
- ⚠️ Free tier terbatas (butuh upgrade untuk production traffic tinggi)

---

## 🆘 TROUBLESHOOTING

### Backend tidak bisa connect ke database:
- Cek environment variables di Render dashboard
- Pastikan DB_SSL=true untuk PostgreSQL
- Test connection dari local dulu

### Frontend tidak bisa connect ke backend:
- Cek VITE_API_URL di Vercel environment variables
- Pastikan URL backend benar (dengan `/api` di akhir)
- Cek CORS settings di backend

### Database migration error:
- Pastikan schema sudah di-convert ke PostgreSQL
- Check error logs di Render dashboard

### Build error:
- Cek logs di Render/Vercel dashboard
- Pastikan semua dependencies ada di package.json
- Test build lokal dulu: `npm run build`

---

## 📞 SUPPORT

Jika ada masalah:
1. Cek logs di Render dashboard (Backend)
2. Cek logs di Vercel dashboard (Frontend)
3. Test API endpoint secara langsung
4. Test database connection

---

## 🎉 SETELAH ONLINE

Setelah website online:

1. ✅ **Buat admin user** via API atau script
2. ✅ **Upload content** (berita, program, galeri, dll)
3. ✅ **Test semua fitur** (login, CRUD, upload gambar)
4. ✅ **Setup custom domain** (opsional)

**Website Anda sekarang ONLINE dan GRATIS! 🚀**

---

## 📝 NEXT STEPS

Setelah membaca panduan ini:
1. **Ikuti langkah-langkah** di atas satu per satu
2. **Jika ada error**, cek bagian Troubleshooting
3. **Setelah online**, test semua fitur website
4. **Setup custom domain** jika perlu

**Selamat! Website BEM FSRD ISI Yogyakarta akan segera online! 🎊**

