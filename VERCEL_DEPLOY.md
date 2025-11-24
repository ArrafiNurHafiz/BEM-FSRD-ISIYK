# 🌐 Deploy ke Vercel - Step by Step

Project sudah berhasil di-push ke GitHub! Sekarang kita akan deploy ke Vercel.

**Repository GitHub**: https://github.com/ArrafiNurHafiz/BEM-FSRD-ISIYK

---

## ✅ Step 1: Login ke Vercel

1. Buka: **https://vercel.com**
2. Klik **"Sign Up"** atau **"Log In"**
3. Pilih **"Continue with GitHub"** (recommended)
4. Authorize Vercel untuk akses GitHub account Anda

---

## ✅ Step 2: Import Project

1. Di dashboard Vercel, klik **"Add New..."** → **"Project"**
2. Klik **"Import Git Repository"**
3. Cari dan pilih repository **`BEM-FSRD-ISIYK`**
4. Klik **"Import"**

---

## ⚙️ Step 3: Konfigurasi Project (PENTING!)

### 3.1 Framework Preset
- Biarkan auto-detect atau pilih **"Other"**

### 3.2 Root Directory ⚠️ **PENTING!**
- Klik **"Edit"** di Root Directory
- Pilih atau ketik: **`frontend`**
- **Ini menentukan dimana Vercel akan mencari `package.json`**

### 3.3 Build Command
- Otomatis akan terdeteksi: `npm install && npm run build`
- Atau manual: `npm install && npm run build`

### 3.4 Output Directory
- Otomatis akan terdeteksi: `dist`
- Atau manual: `dist`

### 3.5 Install Command
- Otomatis: `npm install`
- Atau manual: `npm install`

### 3.6 Project Name (Opsional)
- Bisa diganti sesuai keinginan, contoh: `bem-fsrd-isiyk`
- URL akan menjadi: `https://bem-fsrd-isiyk.vercel.app`

---

## 🔐 Step 4: Environment Variables

### 4.1 Tambah Environment Variable

1. Scroll ke bawah atau klik **"Environment Variables"**
2. Klik **"Add"** untuk menambah variable baru

### 4.2 Variable yang Perlu Ditambahkan

**Variable 1: VITE_API_URL**
```
Key: VITE_API_URL
Value: http://localhost:5000/api
Environments: ✅ Production, ✅ Preview, ✅ Development
```

**Catatan**: 
- Untuk sementara gunakan `http://localhost:5000/api` jika backend belum di-deploy
- Nanti bisa di-update setelah backend di-deploy (Railway, Render, dll)
- Setelah update, Vercel akan auto-redeploy

**Variable 2 (Opsional): NODE_ENV**
```
Key: NODE_ENV
Value: production
Environments: ✅ Production
```

3. Klik **"Add"** untuk setiap variable
4. Klik **"Save"** atau **"Deploy"**

---

## 🚀 Step 5: Deploy!

1. Klik tombol **"Deploy"** (biasanya di kanan bawah)
2. Tunggu proses build selesai (2-5 menit)
3. Vercel akan menampilkan:
   - Build logs (real-time)
   - URL deployment setelah selesai

**URL akan terlihat seperti:**
```
https://bem-fsrd-isiyk.vercel.app
```

---

## ✅ Step 6: Verifikasi Deployment

### 6.1 Cek Build Status

1. Di Vercel dashboard, klik project Anda
2. Klik tab **"Deployments"**
3. Deployment terbaru harus berstatus **✅ Ready** (hijau)
4. Jika ada error, klik deployment dan cek **"Build Logs"**

### 6.2 Test Website

1. Klik URL deployment yang diberikan Vercel
2. Website harus bisa diakses
3. Buka **Console browser** (F12) untuk memastikan tidak ada error

### 6.3 Cek SPA Routing

1. Navigasi ke beberapa halaman (Home, About, dll)
2. Pastikan tidak ada error 404
3. Refresh page harus tetap di halaman yang sama (tidak redirect ke home)

---

## 🔧 Troubleshooting

### ❌ Error: "react-scripts: command not found"

**Penyebab**: Vercel salah detect framework.

**Solusi**:
1. Pastikan **Root Directory** di-set ke `frontend`
2. Cek di **Project Settings → General → Root Directory**
3. Pastikan `vercel.json` ada di root dengan konfigurasi yang benar

### ❌ Error: "Build failed"

**Solusi**:
1. Buka **Build Logs** di Vercel (klik deployment → Build Logs)
2. Cek error message yang muncul
3. Pastikan `package.json` di folder `frontend` sudah benar
4. Pastikan semua dependencies ada di `package.json`

### ❌ Error: "Cannot find module"

**Solusi**:
- Pastikan **Root Directory** di-set ke `frontend` di Vercel settings
- Pastikan `package.json` ada di folder `frontend/`

### ❌ Website Blank atau 404

**Solusi**:
1. Pastikan `vercel.json` ada di root dan memiliki konfigurasi `rewrites`
2. Cek `outputDirectory` sudah benar (`dist`)
3. Cek `rootDirectory` sudah benar (`frontend`)

### ❌ API Error di Console

**Penyebab**: Backend belum di-deploy atau URL salah.

**Solusi**:
1. Update `VITE_API_URL` di Vercel Environment Variables
2. Pastikan backend sudah online dan bisa diakses
3. Cek CORS settings di backend
4. Redeploy di Vercel setelah update environment variable

---

## 📋 Checklist

- [ ] Login ke Vercel berhasil
- [ ] Project sudah di-import dari GitHub
- [ ] **Root Directory** di-set ke `frontend` ✅
- [ ] Build Command sudah benar
- [ ] Output Directory sudah benar
- [ ] Environment Variables sudah di-set (VITE_API_URL)
- [ ] Deployment berhasil (status ✅ Ready)
- [ ] Website bisa diakses
- [ ] Tidak ada error di console browser
- [ ] SPA routing berfungsi dengan baik

---

## 🎉 Selesai!

Website Anda sekarang online di Vercel!

**URL Website**: `https://your-project.vercel.app`

---

## 📚 Next Steps

1. **Setup Custom Domain** (opsional)
   - Vercel → Project → Settings → Domains
   - Tambahkan domain Anda
   - Setup DNS sesuai instruksi Vercel

2. **Deploy Backend** (jika belum)
   - **Railway**: https://railway.app (gratis untuk free tier)
   - **Render**: https://render.com (gratis untuk free tier)
   - Atau VPS

3. **Update API URL**
   - Setelah backend online, update `VITE_API_URL` di Vercel
   - Vercel akan auto-redeploy setelah update environment variable

4. **Enable Analytics** (opsional)
   - Vercel → Project → Analytics
   - Aktifkan Vercel Analytics untuk tracking visitor

---

**Selamat! Website Anda sudah online! 🎊**

