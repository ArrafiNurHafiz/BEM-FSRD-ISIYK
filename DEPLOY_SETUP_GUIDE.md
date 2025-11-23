# 🚀 Setup Deployment ke Railway atau Render

Panduan lengkap untuk setup deployment Website BEM FSRD ISI Yogyakarta ke Railway atau Render.

## 📋 Yang Sudah Disiapkan

1. ✅ **Railway config**: `railway.json` dan `frontend/railway.json`
2. ✅ **Render config**: `render.yaml`
3. ✅ **Package.json** sudah di-update dengan script serve
4. ✅ **Vite config** sudah di-update untuk Railway/Render (base path '/')

## 🎯 Pilih Platform

### Railway (Recommended)
- ✅ Mudah setup
- ✅ Auto-deploy otomatis
- ✅ Free tier lebih baik

### Render
- ✅ Static site hosting khusus
- ✅ Mudah setup
- ✅ Free tier tersedia

## 🚂 Deploy ke Railway

### Quick Start

1. **Sign Up**: https://railway.app → Login with GitHub

2. **New Project**: 
   - Klik "New Project"
   - Pilih "Deploy from GitHub repo"
   - Connect repository `ArrafiNurHafiz/BEM-FSRD-ISIYK`

3. **Setup Service**:
   - Railway akan detect frontend folder
   - Atau klik "New" → "GitHub Repo" → Pilih repo → Set root directory ke `frontend`

4. **Environment Variables**:
   - Add `VITE_API_URL` = `https://your-backend-url.com/api`
   - Add `NODE_ENV` = `production`
   - Add `GITHUB_PAGES` = `false`

5. **Settings**:
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npx serve dist -s -l $PORT`
   - Output Directory: `dist`

6. **Deploy**: Klik "Deploy" atau tunggu auto-deploy

**Detail lengkap**: Lihat `DEPLOY_RAILWAY_FULL.md`

## 🎨 Deploy ke Render

### Quick Start

1. **Sign Up**: https://render.com → Sign up with GitHub

2. **New Static Site**:
   - Klik "New +" → "Static Site"
   - Connect repository `ArrafiNurHafiz/BEM-FSRD-ISIYK`

3. **Configure**:
   - Name: `bem-fsrd-website`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

4. **Environment Variables**:
   - Add `VITE_API_URL` = `https://your-backend-url.com/api`
   - Add `NODE_ENV` = `production`
   - Add `GITHUB_PAGES` = `false`

5. **Deploy**: Klik "Create Static Site"

**Detail lengkap**: Lihat `DEPLOY_RENDER_FULL.md`

## 📝 File Konfigurasi

### Railway
- `railway.json` - Root config
- `frontend/railway.json` - Frontend specific config

### Render
- `render.yaml` - Render config file

## 🔄 Auto-Deploy

Kedua platform akan otomatis deploy setiap ada push ke `main` branch.

**Setup**:
1. Railway/Render → Settings → Auto Deploy
2. Enable auto-deploy
3. Branch: `main`

## 🌐 Website URL

Setelah deploy:
- **Railway**: `https://your-project.up.railway.app`
- **Render**: `https://your-project.onrender.com`

## ⚙️ Environment Variables

Pastikan set environment variables berikut:

| Key | Value | Description |
|-----|-------|-------------|
| `VITE_API_URL` | `https://your-backend-url.com/api` | Backend API URL (WAJIB!) |
| `NODE_ENV` | `production` | Environment |
| `GITHUB_PAGES` | `false` | Bukan GitHub Pages |

## 🔧 Troubleshooting

### Build Gagal

1. Check build logs di platform
2. Pastikan `package.json` valid
3. Pastikan dependencies bisa di-install

### Website Tidak Muncul

1. Check apakah build sukses
2. Pastikan publish directory benar (`dist`)
3. Check logs untuk error

### API Tidak Connect

1. Set `VITE_API_URL` di environment variables
2. Pastikan backend sudah di-deploy
3. Check CORS di backend

## 📚 Next Steps

1. **Deploy Backend** (jika belum):
   - Railway: New service → Deploy backend
   - Render: New Web Service → Deploy backend
   - Atau deploy ke VPS/hosting lain

2. **Set API URL**:
   - Update `VITE_API_URL` di platform environment variables

3. **Setup Custom Domain** (opsional):
   - Add domain di platform settings
   - Setup DNS sesuai instruksi

4. **Monitor**:
   - Check logs secara berkala
   - Monitor performance

---

**Pilih salah satu platform dan ikuti panduan lengkap di file terkait! 🚀**

