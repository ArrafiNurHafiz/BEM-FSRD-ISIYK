# 🚀 Setup Railway - Ikuti Langkah Ini Sekarang!

## 📋 Instruksi Deployment ke Railway (Step-by-Step)

### ✅ STEP 1: Login ke Railway (2 menit)

1. **Buka Railway Dashboard**: https://railway.app/dashboard
2. **Klik "Start a New Project"** (jika belum login)
3. **Login dengan GitHub account** Anda
4. **Authorize Railway** untuk akses GitHub repositories

---

### ✅ STEP 2: Create Project (1 menit)

1. Di Railway Dashboard, klik **"New Project"**
2. Pilih **"Deploy from GitHub repo"**
3. **Authorize Railway** (jika belum)
4. **Pilih repository**: `ArrafiNurHafiz/BEM-FSRD-ISIYK`
5. Railway akan create project otomatis

**CATATAN**: Project sudah dibuat, lanjut ke step berikutnya.

---

### ✅ STEP 3: Create MySQL Database (2 menit)

1. Di project Railway Anda, klik **"New +"** (di sidebar kiri atas)
2. Pilih **"Database"** → **"Add MySQL"**
3. Tunggu sampai database ready (beberapa detik)
4. **Klik pada MySQL service** yang baru dibuat
5. **Klik tab "Variables"**
6. **SIMPAN** credentials berikut (akan digunakan nanti):
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`
   - `MYSQL_URL`

**CATATAN**: Credentials akan otomatis di-reference oleh backend service nanti.

---

### ✅ STEP 4: Create Backend Service (3 menit)

1. Di project Railway Anda, klik **"New +"** lagi
2. Pilih **"GitHub Repo"** → Pilih repo: `ArrafiNurHafiz/BEM-FSRD-ISIYK`
3. Railway akan auto-detect sebagai Node.js service

4. **Klik Settings** (icon gear) atau klik pada service:
   - **Name**: `bem-fsrd-backend` (atau nama lain)
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
   - **Build Command**: `npm install` (atau kosongkan)

5. **Klik tab "Variables"** (di sidebar service):
   - **Klik "Raw Editor"** (toggle di kanan atas)
   - **Copy semua** dari file `backend/.env.railway`
   - **Paste** ke Raw Editor
   - **Save**

6. **Generate Domain** (di sidebar service):
   - **Klik tab "Settings"**
   - Scroll ke **"Networking"**
   - **Klik "Generate Domain"**
   - Railway akan generate URL seperti: `bem-fsrd-backend-production.up.railway.app`
   - **SIMPAN URL ini!** (akan digunakan untuk frontend)

7. **Deploy**: Railway akan otomatis deploy setelah settings disimpan

8. **Tunggu deploy selesai** (1-2 menit)

---

### ✅ STEP 5: Create Frontend Service (3 menit)

1. Di project Railway Anda, klik **"New +"** lagi
2. Pilih **"GitHub Repo"** → Pilih repo: `ArrafiNurHafiz/BEM-FSRD-ISIYK`

3. **Klik Settings**:
   - **Name**: `bem-fsrd-frontend` (atau nama lain)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx serve dist -s -l $PORT`

4. **Klik tab "Variables"**:
   - **Klik "Raw Editor"**
   - **Copy** dari file `frontend/.env.railway`
   - **GANTI** `https://your-backend-url.railway.app/api` dengan **URL backend dari STEP 4** (dengan `/api` di akhir)
   - **Paste** ke Raw Editor
   - **Save**

5. **Generate Domain**:
   - **Klik tab "Settings"** → **"Networking"**
   - **Klik "Generate Domain"**
   - Railway akan generate URL seperti: `bem-fsrd-frontend-production.up.railway.app`
   - **SIMPAN URL ini!**

6. **Deploy**: Railway akan otomatis deploy

7. **Tunggu deploy selesai** (2-3 menit untuk build)

---

### ✅ STEP 6: Update Backend CORS (1 menit)

Setelah frontend URL diketahui:

1. **Klik pada backend service**
2. **Klik tab "Variables"**
3. **Add Variable**:
   - **Key**: `FRONTEND_URL`
   - **Value**: URL frontend dari STEP 5 (contoh: `https://bem-fsrd-frontend-production.up.railway.app`)
4. **Save**

5. **Redeploy backend** (Settings → Redeploy) atau tunggu auto-redeploy

---

### ✅ STEP 7: Setup Database Schema (3 menit)

1. **Klik pada MySQL service**
2. **Klik tab "Connect"** atau **"Query"**
3. **Copy connection string** atau **koneksikan via MySQL client**

**Via Railway Terminal:**
```bash
# Di Railway Dashboard, klik MySQL service → tab "Connect"
# Copy connection command dan jalankan di terminal
```

**Via MySQL Client (MySQL Workbench atau command line):**
```bash
# Gunakan credentials dari STEP 3
mysql -h [MYSQLHOST] -P [MYSQLPORT] -u [MYSQLUSER] -p[MYSQLPASSWORD] [MYSQLDATABASE] < backend/database/schema.sql
```

**Via Railway Dashboard Terminal:**
1. Klik pada MySQL service → tab "Connect"
2. Railway akan provide connection command
3. Import schema file `backend/database/schema.sql`

**Atau via Script:**
```bash
# Di Railway terminal (backend service)
cd backend
npm run migrate  # Jika ada migrate script
```

---

### ✅ STEP 8: Create Admin User (1 menit)

**Via Railway Terminal (Backend Service):**

1. **Klik pada backend service**
2. **Klik tab "Deployments"** → **"View Logs"** atau **"Connect"**
3. **Buka terminal** di Railway
4. **Jalankan**:
```bash
cd backend
npm run create-admin
```

**Via API** (setelah backend online):
```bash
curl -X POST https://your-backend-url.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "BEMYK",
    "email": "bemyk@isi.ac.id",
    "password": "admin-bemyk",
    "role": "admin"
  }'
```

**Default Admin Credentials:**
- Username: `BEMYK`
- Password: `admin-bemyk`
- Email: `bemyk@isi.ac.id`

**⚠️ PENTING**: Segera ubah password setelah login pertama kali!

---

### ✅ STEP 9: Test Deployment (2 menit)

1. **Test Backend Health:**
   ```
   https://your-backend-url.railway.app/api/health
   ```
   Should return: `{"status":"ok","message":"API is running"}`

2. **Test Frontend:**
   ```
   https://your-frontend-url.railway.app
   ```
   Should show website BEM FSRD ISI Yogyakarta

3. **Test Admin Login:**
   ```
   https://your-frontend-url.railway.app/admin/login
   ```
   Login dengan admin credentials

---

## 🎉 SELESAI! Website Sudah ONLINE!

**Frontend URL**: `https://your-frontend-url.railway.app`
**Backend URL**: `https://your-backend-url.railway.app/api`

**Selamat! Website BEM FSRD ISI Yogyakarta sudah online! 🚀**

---

## 🆘 TROUBLESHOOTING

### Backend error:
- ✅ Check logs di Railway Dashboard → Backend Service → Deployments → View Logs
- ✅ Check environment variables (semua sudah di-set?)
- ✅ Test database connection
- ✅ Check PORT environment variable (harus `10000` atau kosongkan untuk auto)

### Frontend tidak connect ke backend:
- ✅ Check `VITE_API_URL` di frontend variables (harus dengan `/api` di akhir)
- ✅ Check CORS di backend (FRONTEND_URL sudah di-set?)
- ✅ Test backend API langsung: `curl https://your-backend-url.railway.app/api/health`

### Database error:
- ✅ Check database credentials di backend variables
- ✅ Pastikan schema sudah ter-import
- ✅ Test database connection

### Build error:
- ✅ Check logs di Railway Dashboard
- ✅ Pastikan semua dependencies ada di package.json
- ✅ Check build command (frontend: `npm install && npm run build`)

---

## 📚 DOKUMENTASI LENGKAP

Untuk panduan lengkap, lihat:
- `QUICK_DEPLOY.md` - Quick start guide
- `RAILWAY_DEPLOY.md` - Panduan lengkap Railway
- `DEPLOY_CHECKLIST.md` - Checklist lengkap

---

**Last Updated**: 2025
**Platform**: Railway
**Status**: ✅ Ready for Deployment

