# 🚀 Deploy dari Awal: GitHub → Vercel

Panduan lengkap untuk upload project ke GitHub dan deploy ke Vercel.

## 📋 Prerequisites

- Git sudah terinstall
- GitHub account
- Vercel account (gratis)

---

## Step 1: Setup Repository GitHub

### 1.1 Buat Repository Baru di GitHub

1. Buka: https://github.com/new
2. **Repository name**: `BEM-FSRD-ISIYK` (atau nama lain yang Anda inginkan)
3. **Description**: Website BEM FSRD ISI Yogyakarta
4. **Visibility**: Pilih **Public** (atau Private jika ingin)
5. JANGAN centang "Initialize this repository with a README"
6. Klik **"Create repository"**

### 1.2 Catat URL Repository

Setelah repository dibuat, GitHub akan menampilkan URL seperti:
```
https://github.com/USERNAME/BEM-FSRD-ISIYK.git
```
**Simpan URL ini**, kita akan menggunakannya nanti.

---

## Step 2: Setup Git Remote

Jalankan command berikut di terminal project:

```bash
cd /home/arrafinur/gabut

# Hapus remote lama (jika ada)
git remote remove origin

# Tambah remote baru
git remote add origin https://github.com/USERNAME/BEM-FSRD-ISIYK.git

# Verifikasi remote
git remote -v
```

**Ganti `USERNAME` dengan username GitHub Anda!**

---

## Step 3: Push ke GitHub

### 3.1 Push Branch Main

```bash
# Pastikan semua perubahan sudah di-commit
git status

# Push ke GitHub
git push -u origin main
```

### 3.2 Jika Menggunakan Branch Master

Jika branch Anda bernama `master`:

```bash
git push -u origin master
```

Atau rename branch ke `main`:

```bash
git branch -M main
git push -u origin main
```

---

## Step 4: Setup Vercel

### 4.1 Login ke Vercel

1. Buka: https://vercel.com
2. Klik **"Sign Up"** atau **"Log In"**
3. Pilih **"Continue with GitHub"** (recommended)
4. Authorize Vercel untuk akses GitHub

### 4.2 Import Project dari GitHub

1. Di dashboard Vercel, klik **"Add New..."** → **"Project"**
2. Klik **"Import Git Repository"**
3. Pilih repository **`BEM-FSRD-ISIYK`**
4. Klik **"Import"**

### 4.3 Konfigurasi Project

Vercel akan otomatis detect konfigurasi dari `vercel.json`, tapi pastikan:

**Framework Preset:** 
- Biarkan auto-detect atau pilih **"Other"**

**Root Directory:**
- Pilih **"frontend"** (penting!)

**Build Command:**
- Otomatis: `npm install && npm run build`
- Atau manual: `npm install && npm run build`

**Output Directory:**
- Otomatis: `dist`
- Atau manual: `dist`

**Install Command:**
- Otomatis: `npm install`
- Atau manual: `npm install`

### 4.4 Environment Variables

Tambahkan environment variables:

1. Klik **"Environment Variables"**
2. Tambahkan:

   **Variable 1:**
   - **Key**: `VITE_API_URL`
   - **Value**: URL backend Anda (contoh: `https://your-backend.railway.app/api`)
   - **Environment**: Production, Preview, Development

   **Variable 2 (Opsional):**
   - **Key**: `NODE_ENV`
   - **Value**: `production`
   - **Environment**: Production, Preview, Development

3. Klik **"Save"**

### 4.5 Deploy

1. Klik **"Deploy"**
2. Tunggu proses build selesai (2-5 menit)
3. Vercel akan memberikan URL deployment seperti: `https://bem-fsrd-isiyk.vercel.app`

---

## Step 5: Verifikasi Deployment

### 5.1 Cek Build Logs

1. Di Vercel dashboard, klik project Anda
2. Klik tab **"Deployments"**
3. Klik deployment terbaru
4. Cek **"Build Logs"** untuk memastikan tidak ada error

### 5.2 Cek Website

1. Klik URL deployment
2. Website harus bisa diakses
3. Cek console browser (F12) untuk error

---

## 🔧 Troubleshooting

### Error: "react-scripts: command not found"

**Penyebab**: Vercel salah detect framework.

**Solusi**: Pastikan `vercel.json` sudah benar dan `rootDirectory` di-set ke `frontend`.

### Error: "Build failed"

**Solusi**:
1. Cek build logs di Vercel
2. Pastikan `package.json` di folder `frontend` sudah benar
3. Pastikan semua dependencies ada

### Error: "Cannot find module"

**Solusi**:
- Pastikan `rootDirectory` di-set ke `frontend` di Vercel settings

### Website Blank atau 404

**Solusi**:
1. Pastikan `vercel.json` ada dan memiliki `rewrites` untuk SPA routing
2. Cek `outputDirectory` sudah benar (`dist`)
3. Cek `rootDirectory` sudah benar (`frontend`)

---

## 📝 Checklist

- [ ] Repository GitHub sudah dibuat
- [ ] Remote origin sudah di-setup
- [ ] Code sudah di-push ke GitHub
- [ ] Project sudah di-import ke Vercel
- [ ] Root Directory di-set ke `frontend`
- [ ] Build Command sudah benar
- [ ] Output Directory sudah benar
- [ ] Environment Variables sudah di-set (VITE_API_URL)
- [ ] Deployment berhasil
- [ ] Website bisa diakses

---

## 🎉 Selesai!

Website Anda sekarang online di Vercel!

**URL Website**: `https://your-project.vercel.app`

**Next Steps**:
1. Setup custom domain (opsional)
2. Setup backend API (Railway, Render, dll)
3. Update `VITE_API_URL` dengan URL backend production

