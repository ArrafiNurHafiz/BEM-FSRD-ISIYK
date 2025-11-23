# 🚀 Deploy Step-by-Step - Sampai Website Online

Panduan lengkap step-by-step untuk deploy Website BEM FSRD ISI Yogyakarta sampai website benar-benar online.

## 📋 Pre-Deployment Checklist

Sebelum deploy, pastikan:

- [x] ✅ Build lokal sudah berhasil (sudah di-test)
- [x] ✅ File konfigurasi sudah dibuat (railway.json, render.yaml)
- [x] ✅ Package.json sudah di-update
- [x] ✅ Semua file sudah di-push ke GitHub

## 🎯 Pilih Platform

### Railway (Recommended) - Lebih Mudah
- ✅ Auto-detect konfigurasi
- ✅ Mudah setup
- ✅ Free tier bagus

### Render - Alternatif
- ✅ Static site hosting khusus
- ✅ Mudah setup
- ✅ Free tier tersedia

---

## 🚂 DEPLOY KE RAILWAY (Recommended)

### Step 1: Sign Up Railway

1. **Buka browser**: https://railway.app
2. **Klik**: "Start a New Project" atau "Get Started"
3. **Pilih**: "Login with GitHub"
4. **Authorize**: Klik "Authorize Railway" untuk memberikan akses
5. **Verify email** (jika diminta)

**✅ Checklist Step 1:**
- [ ] Railway account sudah dibuat
- [ ] Sudah login dengan GitHub
- [ ] Dashboard Railway sudah terbuka

### Step 2: Create New Project

1. **Di Railway dashboard**, klik tombol **"New Project"** (biasanya di pojok kanan atas)
2. **Pilih**: **"Deploy from GitHub repo"**
3. **Connect Repository**:
   - Jika belum connect, klik "Configure GitHub App"
   - Pilih repository: **`ArrafiNurHafiz/BEM-FSRD-ISIYK`**
   - Klik **"Deploy Now"**

**✅ Checklist Step 2:**
- [ ] Repository sudah di-connect
- [ ] Project sudah dibuat
- [ ] Service sudah muncul di dashboard

### Step 3: Configure Service

Railway mungkin sudah auto-detect, tapi kita perlu pastikan konfigurasi benar:

1. **Klik** pada service yang baru dibuat (biasanya nama repository)
2. **Klik tab "Settings"**
3. **Configure**:

   **Root Directory:**
   - Set ke: `frontend`
   
   **Build Command:**
   - Set ke: `npm install && npm run build`
   
   **Start Command:**
   - Set ke: `npx serve dist -s -l $PORT`
   
   **Output Directory:**
   - Set ke: `dist`

**✅ Checklist Step 3:**
- [ ] Root Directory = `frontend`
- [ ] Build Command = `npm install && npm run build`
- [ ] Start Command = `npx serve dist -s -l $PORT`
- [ ] Output Directory = `dist`

### Step 4: Setup Environment Variables

1. **Klik tab "Variables"** di service settings
2. **Add** environment variables berikut:

   | Key | Value | Description |
   |-----|-------|-------------|
   | `NODE_ENV` | `production` | Environment |
   | `GITHUB_PAGES` | `false` | Bukan GitHub Pages |
   | `VITE_API_URL` | `http://localhost:5000/api` | Backend API (sementara, update nanti) |
   | `PORT` | `3000` | Port (Railway akan set otomatis via $PORT) |

**Catatan**: 
- `VITE_API_URL` bisa di-update nanti setelah backend di-deploy
- Railway akan otomatis set `$PORT`, jadi start command sudah benar

**✅ Checklist Step 4:**
- [ ] `NODE_ENV` = `production`
- [ ] `GITHUB_PAGES` = `false`
- [ ] `VITE_API_URL` sudah di-set (sementara pakai localhost)
- [ ] Variables sudah di-save

### Step 5: Deploy

1. **Klik tab "Deployments"** atau kembali ke dashboard
2. **Klik "Deploy"** atau tunggu auto-deploy
3. **Monitor build logs**:
   - Klik pada deployment yang sedang berjalan
   - Lihat logs untuk progress build
   - Tunggu sampai status **"Success"** atau **"Active"**

**Build akan:**
1. Install dependencies (`npm install`)
2. Build React app (`npm run build`)
3. Start serve (`npx serve dist -s -l $PORT`)

**Waktu**: Sekitar 2-5 menit

**✅ Checklist Step 5:**
- [ ] Deployment sudah dimulai
- [ ] Build logs menunjukkan progress
- [ ] Status = **"Success"** atau **"Active"**

### Step 6: Get Website URL

1. **Klik tab "Settings"** → **"Networking"**
2. **Generate Domain**:
   - Klik **"Generate Domain"** (jika belum ada)
   - Railway akan memberikan URL: `https://your-project-name.up.railway.app`
3. **Copy URL** dan test di browser

**✅ Checklist Step 6:**
- [ ] Domain sudah di-generate
- [ ] URL sudah di-copy
- [ ] Website bisa diakses di browser

### Step 7: Verify Website

1. **Buka URL** di browser: `https://your-project-name.up.railway.app`
2. **Check**:
   - ✅ Website muncul (tidak error)
   - ✅ Tidak ada error di console (F12)
   - ✅ Assets (CSS, JS, images) ter-load
   - ✅ Navigation bekerja

**Jika ada error:**
- Check browser console (F12) untuk error messages
- Check Railway logs untuk error
- Lihat troubleshooting di bawah

**✅ Checklist Step 7:**
- [ ] Website bisa diakses
- [ ] Tidak ada error di console
- [ ] Website berfungsi dengan baik

---

## 🎨 DEPLOY KE RENDER (Alternatif)

### Step 1: Sign Up Render

1. **Buka browser**: https://render.com
2. **Klik**: "Get Started for Free"
3. **Pilih**: "Sign up with GitHub"
4. **Authorize**: Klik "Authorize Render" untuk memberikan akses
5. **Verify email** (jika diminta)

**✅ Checklist Step 1:**
- [ ] Render account sudah dibuat
- [ ] Sudah login dengan GitHub
- [ ] Dashboard Render sudah terbuka

### Step 2: Create Static Site

1. **Klik**: **"New +"** (pojok kanan atas)
2. **Pilih**: **"Static Site"**
3. **Connect Repository**:
   - Pilih: **`ArrafiNurHafiz/BEM-FSRD-ISIYK`**
   - Klik **"Connect"**

**✅ Checklist Step 2:**
- [ ] Repository sudah di-connect
- [ ] Form create static site sudah muncul

### Step 3: Configure Static Site

Isi form dengan konfigurasi berikut:

| Field | Value | Description |
|-------|-------|-------------|
| **Name** | `bem-fsrd-website` | Nama service |
| **Branch** | `main` | Branch yang akan di-deploy |
| **Root Directory** | `frontend` | Root folder frontend |
| **Build Command** | `npm install && npm run build` | Command untuk build |
| **Publish Directory** | `dist` | Folder output build |

**✅ Checklist Step 3:**
- [ ] Name = `bem-fsrd-website`
- [ ] Branch = `main`
- [ ] Root Directory = `frontend`
- [ ] Build Command = `npm install && npm run build`
- [ ] Publish Directory = `dist`

### Step 4: Setup Environment Variables

1. **Scroll ke bawah** ke bagian **"Environment Variables"**
2. **Add** environment variables:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `GITHUB_PAGES` | `false` |
   | `VITE_API_URL` | `http://localhost:5000/api` |

**✅ Checklist Step 4:**
- [ ] Environment variables sudah di-add
- [ ] Semua variables sudah di-set dengan benar

### Step 5: Deploy

1. **Scroll ke bawah**
2. **Klik**: **"Create Static Site"**
3. **Monitor build**:
   - Render akan mulai build
   - Lihat logs untuk progress
   - Tunggu sampai status **"Live"**

**Waktu**: Sekitar 2-5 menit

**✅ Checklist Step 5:**
- [ ] Deployment sudah dimulai
- [ ] Build logs menunjukkan progress
- [ ] Status = **"Live"**

### Step 6: Get Website URL

1. **Setelah deploy selesai**, Render akan memberikan URL
2. **URL format**: `https://bem-fsrd-website.onrender.com`
3. **Copy URL** dan test di browser

**✅ Checklist Step 6:**
- [ ] URL sudah muncul
- [ ] URL sudah di-copy
- [ ] Website bisa diakses di browser

### Step 7: Verify Website

1. **Buka URL** di browser
2. **Check**:
   - ✅ Website muncul
   - ✅ Tidak ada error
   - ✅ Assets ter-load
   - ✅ Navigation bekerja

**✅ Checklist Step 7:**
- [ ] Website bisa diakses
- [ ] Tidak ada error
- [ ] Website berfungsi

---

## 🔧 Troubleshooting

### Build Gagal

**Error**: `npm install failed` atau `npm run build failed`

**Solusi**:
1. Check build logs di platform
2. Pastikan `package-lock.json` ada di repository
3. Test build lokal:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
4. Fix error yang muncul di lokal
5. Push fix ke GitHub
6. Re-deploy

### Website Blank/Error

**Error**: Website muncul tapi blank atau error

**Solusi**:
1. **Check browser console** (F12):
   - Lihat error messages
   - Check network tab untuk failed requests
2. **Check platform logs**:
   - Railway: Deployments → Logs
   - Render: Logs tab
3. **Common issues**:
   - API URL salah → Update `VITE_API_URL`
   - Base path salah → Check vite.config.js
   - Assets tidak ter-load → Check build output

### API Tidak Connect

**Error**: Frontend tidak bisa connect ke backend

**Solusi**:
1. **Update `VITE_API_URL`** di environment variables:
   - Railway: Settings → Variables
   - Render: Environment tab
   - Set ke URL backend yang benar
2. **Redeploy** setelah update environment variables
3. **Check CORS** di backend (harus allow domain Railway/Render)

### Port Error (Railway)

**Error**: `Port already in use` atau port error

**Solusi**:
- Railway akan otomatis set `$PORT`
- Pastikan start command: `npx serve dist -s -l $PORT`
- Jangan hardcode port

---

## 📝 After Deployment

### 1. Update API URL

Setelah backend di-deploy:

1. **Get backend URL** (dari Railway/Render/hosting lain)
2. **Update `VITE_API_URL`** di environment variables
3. **Redeploy** frontend

### 2. Setup Custom Domain (Opsional)

**Railway**:
1. Settings → Networking → Custom Domain
2. Add domain
3. Setup DNS sesuai instruksi

**Render**:
1. Settings → Custom Domains
2. Add domain
3. Setup DNS sesuai instruksi

### 3. Monitor

- Check logs secara berkala
- Monitor performance
- Update jika ada error

---

## ✅ Final Checklist

- [ ] Platform sudah dipilih (Railway atau Render)
- [ ] Account sudah dibuat dan login
- [ ] Repository sudah di-connect
- [ ] Service sudah di-configure dengan benar
- [ ] Environment variables sudah di-set
- [ ] Deployment sudah berhasil
- [ ] Website URL sudah didapat
- [ ] Website bisa diakses dan berfungsi
- [ ] Tidak ada error di console
- [ ] Assets ter-load dengan baik

---

## 🎉 Selamat!

Website Anda sudah online! 🚀

**URL Website**: 
- Railway: `https://your-project-name.up.railway.app`
- Render: `https://bem-fsrd-website.onrender.com`

**Next Steps**:
1. Deploy backend (jika belum)
2. Update `VITE_API_URL` dengan backend URL
3. Setup custom domain (opsional)
4. Monitor dan maintain

---

**Ikuti step-by-step di atas, dan website akan online! 🎊**

