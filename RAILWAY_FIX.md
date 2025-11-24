# 🔧 Fix Railway Deployment Error

Error: **"No start command could be found"**

---

## ⚠️ PENTING: Frontend vs Backend

**Frontend sudah di Vercel**: https://bem-fsrd-isiyk1.vercel.app/

**Yang perlu di-deploy ke Railway adalah BACKEND, bukan frontend!**

Tapi jika Anda tetap ingin deploy frontend ke Railway juga, ikuti langkah di bawah.

---

## 🔧 Fix Frontend Service di Railway (Jika Tetap Ingin Deploy Frontend)

### Solusi 1: Set Start Command di Railway Settings

1. Di Railway dashboard, klik service **`bem-fsrd-frontend`**
2. Klik tab **"Settings"**
3. Scroll ke section **"Deploy"**
4. Di **"Start Command"**, isi:
   ```
   npx serve dist -s -l $PORT
   ```
5. Klik **"Save"**
6. Klik **"Redeploy"**

### Solusi 2: Pastikan railway.json Dibaca

File `frontend/railway.json` sudah ada dan benar. Pastikan Railway membaca dari root project:

1. Di Railway service settings
2. **Root Directory**: pastikan di-set ke `frontend`
3. Railway akan otomatis membaca `railway.json` di folder tersebut

### Solusi 3: Update Build & Start Command

1. Di Railway service **"Settings"** → **"Deploy"**
2. **Build Command**: 
   ```
   cd frontend && npm install && npm run build
   ```
3. **Start Command**:
   ```
   cd frontend && npx serve dist -s -l $PORT
   ```
4. **Root Directory**: `frontend` (atau kosong jika build command sudah include `cd frontend`)
5. Klik **"Save"** dan **"Redeploy"**

---

## ✅ Recommended: Deploy Backend ke Railway

Sebenarnya, **frontend tidak perlu di Railway** karena sudah di Vercel. Yang perlu adalah **BACKEND**:

### Step 1: Hapus/Hide Frontend Service (Opsional)

Anda bisa delete atau biarkan service frontend di Railway, tapi kita akan deploy backend.

### Step 2: Deploy Backend Service

1. Di Railway project, klik **"+ New"** → **"GitHub Repo"**
2. Pilih repository: `ArrafiNurHafiz/BEM-FSRD-ISIYK`
3. Setelah service dibuat, klik **"Settings"**
4. **Root Directory**: `backend`
5. **Start Command**: `npm start` (sudah ada di package.json)
6. **Build Command**: kosong atau `npm install`

### Step 3: Tambah MySQL

1. Klik **"+ New"** → **"Database"** → **"MySQL"**
2. Setup environment variables (lihat panduan RAILWAY_BACKEND_DEPLOY.md)

---

## 📋 Quick Fix untuk Frontend (Jika Tetap Ingin)

Jalankan command ini untuk update railway.json di root:

```bash
cd /home/arrafinur/gabut
cp frontend/railway.json railway-frontend.json
```

Atau langsung set di Railway dashboard:

**Build Command:**
```
cd frontend && npm install && npm run build
```

**Start Command:**
```
cd frontend && npx serve dist -s -l $PORT
```

**Root Directory:**
```
frontend
```

---

## 🎯 Rekomendasi Final

1. **Biarkan frontend di Vercel** (sudah online dan bekerja)
2. **Deploy backend ke Railway** (untuk API)
3. **Update VITE_API_URL** di Vercel dengan backend URL dari Railway

Ini lebih efisien dan sesuai best practice!

---

**Panduan lengkap deploy backend**: Lihat `RAILWAY_BACKEND_DEPLOY.md`

