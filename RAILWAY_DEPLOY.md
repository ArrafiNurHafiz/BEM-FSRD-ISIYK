# 🚂 Deploy ke Railway - Hosting Gratis 100%!

Panduan lengkap deploy website BEM FSRD ISI Yogyakarta ke **Railway** - **100% GRATIS**!

## ✅ Keuntungan Railway

- ✅ **100% Gratis** untuk free tier (dengan limit yang wajar)
- ✅ **MySQL Database** gratis (tidak perlu convert ke PostgreSQL)
- ✅ **Backend + Frontend** di satu platform
- ✅ **Auto-deploy** dari GitHub
- ✅ **SSL/HTTPS** gratis otomatis
- ✅ **Custom domain** support
- ✅ **Mudah setup** - hanya beberapa klik!

---

## 📋 PREREQUISITES

Sebelum mulai:
1. ✅ **GitHub account** (untuk repository)
2. ✅ **Railway account** (akan dibuat nanti)
3. ✅ **Repository GitHub** sudah ada dengan kode website

---

## 🚀 LANGKAH 1: Persiapan Repository

### 1.1. Pastikan Semua File Ada

Pastikan repository Anda sudah memiliki:
- ✅ `backend/` folder dengan semua file
- ✅ `frontend/` folder dengan semua file
- ✅ `railway.json` (akan kita buat)
- ✅ Semua dependencies ada di `package.json`

### 1.2. Commit dan Push ke GitHub

```bash
cd /home/arrafinur/gabut

# Check status
git status

# Add semua file
git add .

# Commit
git commit -m "Setup for Railway deployment"

# Push ke GitHub
git push origin main
```

---

## 🚀 LANGKAH 2: Setup Railway Account

### 2.1. Daftar Railway

1. **Buka**: https://railway.app
2. **Klik**: "Start a New Project"
3. **Sign up** dengan GitHub account (recommended)
4. **Authorize** Railway untuk akses GitHub repositories

### 2.2. Install Railway CLI (Opsional, untuk development)

```bash
npm install -g @railway/cli
railway login
```

---

## 🚀 LANGKAH 3: Deploy Backend ke Railway

### 3.1. Create New Project

1. Di Railway dashboard, klik **"New Project"**
2. Pilih **"Deploy from GitHub repo"**
3. **Authorize** Railway (jika belum)
4. **Pilih repository**: `ArrafiNurHafiz/BEM-FSRD-ISIYK`

### 3.2. Add MySQL Database

1. **Klik**: "New +" → **"Database"** → **"Add MySQL"**
2. **MySQL akan otomatis dibuat** dengan:
   - Random password
   - Connection details

3. **SIMPAN** informasi berikut (akan muncul di dashboard):
   - `MYSQLHOST` (host)
   - `MYSQLPORT` (port)
   - `MYSQLDATABASE` (database name)
   - `MYSQLUSER` (username)
   - `MYSQLPASSWORD` (password)
   - `MYSQL_URL` (full connection string)

### 3.3. Add Backend Service

1. **Klik**: "New +" → **"GitHub Repo"**
2. **Pilih** repository yang sama: `ArrafiNurHafiz/BEM-FSRD-ISIYK`
3. Railway akan auto-detect sebagai Node.js project

4. **Settings** (Klik "Settings" atau icon gear):
   - **Name**: `bem-fsrd-backend`
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
   - **Build Command**: (kosongkan, atau `npm install`)

### 3.4. Setup Environment Variables

**Klik** tab **"Variables"** di service backend, tambahkan:

```bash
# Server
NODE_ENV=production
PORT=10000

# Database (DARI MYSQL SERVICE YANG BARU DIBUAT)
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=${{MySQL.MYSQLDATABASE}}

# Atau gunakan connection string langsung:
# DATABASE_URL=${{MySQL.MYSQL_URL}}

# JWT
JWT_SECRET=[Buat secret key panjang minimal 32 karakter]
JWT_EXPIRES_IN=7d

# Upload
UPLOAD_PATH=./uploads

# Frontend URL (akan diupdate setelah frontend deploy)
FRONTEND_URL=https://your-frontend-url.railway.app

# CORS (opsional, bisa juga di-set di code)
CORS_ORIGIN=https://your-frontend-url.railway.app
```

**Generate JWT_SECRET:**
```bash
openssl rand -base64 32
```

Atau gunakan string panjang: `BEM_FSRD_ISI_YOGYAKARTA_2025_SECRET_KEY_MIN_32_CHARS`

**Catatan**: 
- `${{MySQL.MYSQLHOST}}` adalah syntax Railway untuk reference database service
- Ganti `your-frontend-url.railway.app` dengan URL frontend setelah deploy

### 3.5. Generate Domain (Backend)

1. **Klik** tab **"Settings"**
2. Scroll ke **"Networking"**
3. **Klik**: "Generate Domain"
4. Railway akan generate URL seperti: `bem-fsrd-backend-production.up.railway.app`
5. **SIMPAN** URL ini untuk frontend environment variable!

---

## 🚀 LANGKAH 4: Setup Database Schema

### 4.1. Connect ke Database MySQL

Anda bisa connect via:
- **MySQL Workbench**
- **Railway CLI**
- **phpMyAdmin** (jika ada)
- **Command line** via Railway

### 4.2. Import Schema

**Opsi A: Via Railway CLI**

```bash
# Connect ke database
railway connect mysql

# Atau via mysql command dengan connection string dari Railway dashboard
mysql -h $MYSQLHOST -P $MYSQLPORT -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE

# Import schema
source backend/database/schema.sql
```

**Opsi B: Via MySQL Workbench**

1. Dapatkan connection details dari Railway dashboard
2. Connect ke MySQL via Workbench
3. Import file `backend/database/schema.sql`

**Opsi C: Via Script (akan kita buat)**

Buat script untuk auto-import schema saat deploy pertama kali.

### 4.3. Create Admin User

Setelah schema ter-import, buat admin user:

```bash
# Via Railway CLI atau terminal
cd backend
npm run create-admin
```

Atau via API setelah backend online:
```bash
POST https://your-backend-url.railway.app/api/auth/register
{
  "username": "admin",
  "email": "admin@isi.ac.id",
  "password": "admin123",
  "role": "admin"
}
```

---

## 🚀 LANGKAH 5: Deploy Frontend ke Railway

### 5.1. Add Frontend Service

1. **Klik**: "New +" → **"GitHub Repo"**
2. **Pilih** repository yang sama lagi: `ArrafiNurHafiz/BEM-FSRD-ISIYK`

### 5.2. Setup Frontend Service

**Settings**:
- **Name**: `bem-fsrd-frontend`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npx serve dist -s -l $PORT`

**Environment Variables** (Klik tab "Variables"):

```bash
# API URL (DARI BACKEND SERVICE YANG BARU DIBUAT)
VITE_API_URL=${{bem-fsrd-backend.RAILWAY_PUBLIC_DOMAIN}}/api

# Atau gunakan URL langsung:
# VITE_API_URL=https://bem-fsrd-backend-production.up.railway.app/api

# Build settings
NODE_ENV=production
GITHUB_PAGES=false
```

**Catatan**: 
- `${{bem-fsrd-backend.RAILWAY_PUBLIC_DOMAIN}}` reference ke backend service
- Atau gunakan URL backend langsung

### 5.3. Generate Domain (Frontend)

1. **Klik** tab **"Settings"** → **"Networking"**
2. **Klik**: "Generate Domain"
3. Railway akan generate URL seperti: `bem-fsrd-frontend-production.up.railway.app`
4. **SIMPAN** URL ini!

---

## 🚀 LANGKAH 6: Update CORS di Backend

Setelah frontend URL diketahui, update environment variable di backend:

1. **Klik** backend service → **"Variables"**
2. **Update**:
   ```
   FRONTEND_URL=https://bem-fsrd-frontend-production.up.railway.app
   CORS_ORIGIN=https://bem-fsrd-frontend-production.up.railway.app
   ```

3. **Klik**: "Redeploy" untuk apply changes

---

## 🚀 LANGKAH 7: Test Deployment

### 7.1. Test Backend

```bash
# Health check
curl https://your-backend-url.railway.app/api/health

# Should return: {"status":"ok","message":"API is running"}
```

### 7.2. Test Frontend

1. **Buka**: `https://your-frontend-url.railway.app`
2. **Check** apakah website muncul
3. **Test** API connection (buka browser DevTools → Network)

### 7.3. Test Admin Login

1. **Buka**: `https://your-frontend-url.railway.app/admin/login`
2. **Login** dengan admin credentials
3. **Test** CRUD operations

---

## 📝 CHECKLIST DEPLOYMENT

### Backend:
- [ ] Railway account dibuat
- [ ] MySQL database dibuat
- [ ] Backend service dibuat
- [ ] Environment variables di-set
- [ ] Database schema ter-import
- [ ] Admin user dibuat
- [ ] Backend domain di-generate
- [ ] Backend API bisa diakses

### Frontend:
- [ ] Frontend service dibuat
- [ ] Environment variables di-set (VITE_API_URL)
- [ ] Frontend build sukses
- [ ] Frontend domain di-generate
- [ ] Frontend bisa diakses

### Final:
- [ ] CORS di-update di backend (FRONTEND_URL)
- [ ] Website bisa diakses
- [ ] Admin login berhasil
- [ ] Semua fitur berfungsi

---

## 🔧 RAILWAY.JSON CONFIG (Opsional)

File `railway.json` untuk auto-configuration:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## 🆘 TROUBLESHOOTING

### Backend tidak bisa connect ke database:
- ✅ Cek environment variables (DB_HOST, DB_USER, dll)
- ✅ Pastikan MySQL service sudah running
- ✅ Test connection dari logs
- ✅ Pastikan database schema sudah ter-import

### Frontend tidak bisa connect ke backend:
- ✅ Cek VITE_API_URL di frontend environment variables
- ✅ Pastikan URL backend benar (dengan `/api` di akhir)
- ✅ Cek CORS settings di backend
- ✅ Test backend API secara langsung

### Build error:
- ✅ Cek logs di Railway dashboard
- ✅ Pastikan semua dependencies ada di package.json
- ✅ Test build lokal dulu: `npm run build`

### Database migration error:
- ✅ Pastikan schema SQL file benar
- ✅ Check MySQL version compatibility
- ✅ Import schema secara manual dulu

### Upload gambar tidak berfungsi:
- ✅ Pastikan folder `uploads/` ada
- ✅ Check permissions
- ✅ Pastikan UPLOAD_PATH benar di environment variables

---

## 📊 MONITORING & LOGS

### View Logs:
1. **Railway Dashboard** → Service → **"Deployments"** → Click deployment → **"View Logs"**
2. **Real-time logs** akan muncul di dashboard

### Monitor:
- ✅ Check deployment status
- ✅ View error logs
- ✅ Monitor resource usage
- ✅ Check database connections

---

## 🎉 SETELAH ONLINE

Setelah website online:

1. ✅ **Buat admin user** (jika belum)
2. ✅ **Login** ke admin panel
3. ✅ **Upload content** (berita, program, galeri, dll)
4. ✅ **Test semua fitur** (CRUD, upload, dll)
5. ✅ **Setup custom domain** (opsional)

---

## 🌐 CUSTOM DOMAIN (Opsional)

### Setup Custom Domain di Railway:

1. **Railway Dashboard** → Service → **"Settings"** → **"Networking"**
2. **Add Custom Domain**: Masukkan domain Anda
3. **Update DNS** sesuai instruksi Railway:
   - Type: CNAME
   - Name: @ atau www
   - Value: (dari Railway)

4. **SSL** akan otomatis dibuat oleh Railway (gratis!)

---

## 💰 FREE TIER LIMITS

Railway free tier includes:
- ✅ **$5 credit/month** (cukup untuk small-medium traffic)
- ✅ **512 MB RAM** per service
- ✅ **1 GB storage**
- ✅ **100 GB bandwidth/month**
- ✅ **MySQL database** (500 MB)

**Catatan**: Jika melebihi limit, akan dikenakan biaya. Monitor usage di dashboard!

---

## 🚀 QUICK START

**Ringkas langkah-langkah:**

1. **Daftar Railway** → https://railway.app
2. **New Project** → Connect GitHub repo
3. **Add MySQL Database**
4. **Add Backend Service** → Setup environment variables
5. **Import database schema**
6. **Add Frontend Service** → Setup environment variables
7. **Update CORS** di backend
8. **Test website** → DONE! 🎉

---

**Website Anda sekarang ONLINE dan GRATIS di Railway! 🚂🚀**

Jika ada pertanyaan atau error, cek bagian Troubleshooting atau Railway logs!

