# 🚂 Deploy ke Railway - Panduan Lengkap

Panduan step-by-step untuk deploy Website BEM FSRD ISI Yogyakarta ke Railway.

## ✅ Keuntungan Railway

- ✅ **Gratis** untuk static site (frontend)
- ✅ **Tidak perlu billing info** untuk free tier
- ✅ **Auto-deploy** dari GitHub
- ✅ **Custom domain** support
- ✅ **HTTPS** otomatis
- ✅ **Mudah setup**

## 🚀 Langkah-Langkah Deploy

### 1. Sign Up Railway

1. **Buka**: https://railway.app
2. **Klik**: "Start a New Project" atau "Sign Up"
3. **Pilih**: "Login with GitHub"
4. **Authorize**: Railway access ke GitHub account
5. **Verify email** (jika diperlukan)

### 2. Create New Project

1. **Klik**: "New Project" di dashboard
2. **Pilih**: "Deploy from GitHub repo"
3. **Connect**: Repository `ArrafiNurHafiz/BEM-FSRD-ISIYK`
4. **Klik**: "Deploy Now"

### 3. Setup Frontend Service

Railway akan otomatis detect frontend folder. Tapi kita perlu setup manual:

1. **Klik** pada service yang dibuat
2. **Settings** → **Root Directory**: Set ke `frontend`
3. **Settings** → **Build Command**: 
   ```
   npm install && npm run build
   ```
4. **Settings** → **Start Command**:
   ```
   npx serve dist -s -l $PORT
   ```
5. **Settings** → **Output Directory**: `dist`

Atau gunakan file `railway.json` yang sudah saya buat.

### 4. Setup Environment Variables

1. **Klik** service → **Variables** tab
2. **Add** environment variables:

   | Key | Value | Description |
   |-----|-------|-------------|
   | `NODE_ENV` | `production` | Environment |
   | `GITHUB_PAGES` | `false` | Bukan GitHub Pages |
   | `VITE_API_URL` | `https://your-backend-url.com/api` | Backend API URL |
   | `PORT` | `3000` | Port (Railway akan set otomatis) |

**Catatan**: `VITE_API_URL` harus di-set ke backend API Anda. Jika belum deploy backend, bisa pakai placeholder dulu.

### 5. Install serve Package (Opsional)

Jika Railway tidak bisa run `serve`, kita bisa install:

1. **Add** di `frontend/package.json` dependencies:
   ```json
   "serve": "^14.2.1"
   ```

Atau Railway akan otomatis install jika ada di package.json.

### 6. Deploy

1. **Klik**: "Deploy" atau tunggu auto-deploy
2. **Monitor**: Build logs di Railway dashboard
3. **Tunggu**: Build selesai (sekitar 2-3 menit)
4. **Check**: Service akan otomatis running

### 7. Setup Custom Domain (Opsional)

1. **Settings** → **Networking**
2. **Custom Domain**: Add domain Anda
3. **Setup DNS** sesuai instruksi Railway
4. **SSL** akan otomatis terpasang

## 📝 Railway Configuration File

Saya sudah buatkan file `railway.json` untuk konfigurasi otomatis. Railway akan menggunakan konfigurasi ini jika ada.

**File**: `frontend/railway.json`

## 🔄 Auto-Deploy dari GitHub

Railway akan otomatis deploy setiap ada push ke `main` branch.

**Setup**:
1. Railway → Project → Settings
2. **Auto Deploy**: Enable
3. **Branch**: `main`

## 🐛 Troubleshooting

### Build Gagal

**Error**: `npm install failed`

**Solusi**:
1. Check build logs di Railway
2. Pastikan `package.json` valid
3. Pastikan dependencies bisa di-install

### Serve Gagal

**Error**: `serve command not found`

**Solusi**:
1. Install serve: `npm install serve --save-dev`
2. Atau update start command: `npx serve dist -s -l $PORT`

### Port Error

**Error**: `Port already in use`

**Solusi**:
- Railway akan otomatis set `$PORT` environment variable
- Pastikan start command menggunakan `$PORT`: `npx serve dist -s -l $PORT`

### API Tidak Connect

**Error**: Frontend tidak bisa connect ke backend

**Solusi**:
1. Set `VITE_API_URL` di Railway environment variables
2. Pastikan backend sudah di-deploy dan accessible
3. Check CORS di backend (harus allow Railway domain)

## 📋 Checklist

- [ ] Railway account sudah dibuat
- [ ] Repository sudah di-connect
- [ ] Root directory sudah di-set ke `frontend`
- [ ] Build command sudah di-set
- [ ] Start command sudah di-set
- [ ] Environment variables sudah di-set
- [ ] Deploy berhasil
- [ ] Website accessible

## 🌐 Website URL

Setelah deploy berhasil:
- Railway akan memberikan URL: `https://your-project.up.railway.app`
- Atau custom domain jika sudah setup

## 📚 Next Steps

1. Deploy backend (jika belum)
2. Set `VITE_API_URL` di Railway environment variables
3. Setup custom domain (opsional)
4. Monitor logs dan performance

---

**Selamat! Website Anda sudah di Railway! 🚂**

