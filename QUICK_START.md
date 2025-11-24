# ⚡ Quick Start: Deploy ke GitHub & Vercel

Panduan cepat untuk upload project ke GitHub dan deploy ke Vercel.

---

## 🎯 Langkah 1: Buat Repository GitHub

### Cara Manual:
1. Buka: https://github.com/new
2. **Repository name**: `BEM-FSRD-ISIYK`
3. **Description**: Website BEM FSRD ISI Yogyakarta
4. **Visibility**: Public (atau Private)
5. ❌ JANGAN centang "Initialize with README"
6. Klik **"Create repository"**

### Setelah Repository Dibuat:
Copy URL repository yang muncul, formatnya seperti:
```
https://github.com/USERNAME/BEM-FSRD-ISIYK.git
```

---

## 🚀 Langkah 2: Setup & Push ke GitHub

### Opsi A: Menggunakan Script (Recommended)

```bash
cd /home/arrafinur/gabut

# Jalankan script setup
./setup-github.sh
```

Script akan meminta:
- Nama repository (contoh: `BEM-FSRD-ISIYK`)
- Username GitHub Anda
- Nama branch (default: `main`)

**Setelah repository dibuat di GitHub, jalankan:**
```bash
./setup-github.sh push
```

### Opsi B: Manual Command

```bash
cd /home/arrafinur/gabut

# 1. Tambah remote (ganti USERNAME dengan username GitHub Anda)
git remote add origin https://github.com/USERNAME/BEM-FSRD-ISIYK.git

# 2. Cek remote sudah benar
git remote -v

# 3. Push ke GitHub
git push -u origin main
```

**Jika branch Anda bernama `master`:**
```bash
git branch -M main
git push -u origin main
```

---

## ✅ Langkah 3: Verifikasi GitHub

1. Buka: https://github.com/USERNAME/BEM-FSRD-ISIYK
2. Pastikan semua file sudah ada di GitHub
3. Cek apakah ada file `vercel.json` di root

---

## 🌐 Langkah 4: Deploy ke Vercel

### 4.1 Login ke Vercel

1. Buka: https://vercel.com
2. Klik **"Sign Up"** atau **"Log In"**
3. Pilih **"Continue with GitHub"** (recommended)
4. Authorize Vercel untuk akses GitHub

### 4.2 Import Project

1. Di dashboard Vercel, klik **"Add New..."** → **"Project"**
2. Klik **"Import Git Repository"**
3. Cari dan pilih repository **`BEM-FSRD-ISIYK`**
4. Klik **"Import"**

### 4.3 Konfigurasi Project (PENTING!)

Vercel akan otomatis detect dari `vercel.json`, tapi **PASTIKAN**:

#### ⚙️ Framework Preset:
- Biarkan **"Other"** atau auto-detect

#### 📁 Root Directory:
- **PENTING!** Pilih atau ketik: `frontend`
- Ini menentukan dimana Vercel akan mencari `package.json`

#### 🔨 Build Command:
- Otomatis: `npm install && npm run build`
- Atau manual: `npm install && npm run build`

#### 📦 Output Directory:
- Otomatis: `dist`
- Atau manual: `dist`

#### 📥 Install Command:
- Otomatis: `npm install`
- Atau manual: `npm install`

### 4.4 Environment Variables

1. Klik **"Environment Variables"** (atau scroll ke bawah)
2. Tambahkan variable baru:

   **Variable 1 (WAJIB jika ada backend):**
   ```
   Key: VITE_API_URL
   Value: https://your-backend-url.com/api
   Environments: ✅ Production, ✅ Preview, ✅ Development
   ```
   
   **Catatan**: 
   - Jika belum ada backend, isi dengan `http://localhost:5000/api` untuk sementara
   - Nanti bisa di-update setelah backend di-deploy

3. Klik **"Add"** untuk setiap variable
4. Klik **"Save"** atau **"Deploy"**

### 4.5 Deploy!

1. Klik tombol **"Deploy"** (biasanya di kanan bawah)
2. Tunggu proses build selesai (2-5 menit)
3. Vercel akan menampilkan URL deployment:
   ```
   https://bem-fsrd-isiyk.vercel.app
   ```

---

## ✅ Langkah 5: Verifikasi Website Online

### 5.1 Cek Build Status

1. Di Vercel dashboard, klik project Anda
2. Klik tab **"Deployments"**
3. Deployment terbaru harus berstatus **✅ Ready**
4. Jika ada error, klik deployment dan cek **"Build Logs"**

### 5.2 Test Website

1. Klik URL deployment
2. Website harus bisa diakses
3. Cek console browser (F12) untuk memastikan tidak ada error

### 5.3 Cek Routing (SPA)

1. Navigasi ke beberapa halaman
2. Pastikan tidak ada error 404
3. Refresh page harus tetap di halaman yang sama

---

## 🔧 Troubleshooting

### ❌ Error: "react-scripts: command not found"

**Penyebab**: Vercel salah detect framework.

**Solusi**:
1. Pastikan `rootDirectory` di-set ke `frontend`
2. Pastikan `vercel.json` ada di root dengan isi yang benar
3. Cek di Vercel Project Settings → General → Root Directory

### ❌ Error: "Build failed"

**Solusi**:
1. Buka build logs di Vercel (klik deployment → Build Logs)
2. Cek error message yang muncul
3. Pastikan `package.json` di folder `frontend` sudah benar
4. Pastikan semua dependencies ada di `package.json`

### ❌ Error: "Cannot find module"

**Solusi**:
- Pastikan `rootDirectory` di-set ke `frontend` di Vercel settings
- Pastikan `package.json` ada di folder `frontend/`

### ❌ Website Blank atau 404

**Solusi**:
1. Pastikan `vercel.json` ada dan memiliki konfigurasi `rewrites`
2. Cek `outputDirectory` sudah benar (`dist`)
3. Cek `rootDirectory` sudah benar (`frontend`)

### ❌ API Error di Console

**Penyebab**: Backend belum di-deploy atau URL salah.

**Solusi**:
1. Update `VITE_API_URL` di Vercel Environment Variables
2. Pastikan backend sudah online dan bisa diakses
3. Cek CORS settings di backend

---

## 📋 Checklist Final

- [ ] Repository GitHub sudah dibuat
- [ ] Remote origin sudah di-setup
- [ ] Code sudah di-push ke GitHub
- [ ] Project sudah di-import ke Vercel
- [ ] **Root Directory** di-set ke `frontend` ✅
- [ ] Build Command sudah benar
- [ ] Output Directory sudah benar
- [ ] Environment Variables sudah di-set (VITE_API_URL)
- [ ] Deployment berhasil (status ✅ Ready)
- [ ] Website bisa diakses
- [ ] Tidak ada error di console browser

---

## 🎉 Selesai!

Website Anda sekarang online di Vercel!

**URL Website**: `https://your-project.vercel.app`

---

## 📚 Next Steps

1. **Setup Custom Domain** (opsional)
   - Vercel → Project → Settings → Domains
   - Tambahkan domain Anda

2. **Deploy Backend** (jika belum)
   - Railway: https://railway.app
   - Render: https://render.com
   - Atau VPS

3. **Update API URL**
   - Setelah backend online, update `VITE_API_URL` di Vercel
   - Redeploy jika perlu

4. **Enable Analytics** (opsional)
   - Vercel → Project → Analytics
   - Aktifkan Vercel Analytics

---

**Panduan Lengkap**: Lihat [DEPLOY_FROM_SCRATCH.md](./DEPLOY_FROM_SCRATCH.md)

