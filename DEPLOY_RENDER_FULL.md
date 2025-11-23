# 🎨 Deploy ke Render - Panduan Lengkap

Panduan step-by-step untuk deploy Website BEM FSRD ISI Yogyakarta ke Render.

## ✅ Keuntungan Render

- ✅ **Gratis** untuk static site
- ✅ **Tidak perlu billing info** untuk free tier
- ✅ **Auto-deploy** dari GitHub
- ✅ **Custom domain** support
- ✅ **HTTPS** otomatis
- ✅ **Mudah setup**

## 🚀 Langkah-Langkah Deploy

### 1. Sign Up Render

1. **Buka**: https://render.com
2. **Klik**: "Get Started for Free"
3. **Pilih**: "Sign up with GitHub"
4. **Authorize**: Render access ke GitHub account
5. **Verify email** (jika diperlukan)

### 2. Create New Static Site

1. **Klik**: "New +" → "Static Site"
2. **Connect**: Repository `ArrafiNurHafiz/BEM-FSRD-ISIYK`

### 3. Configure Static Site

**Settings**:

| Field | Value | Description |
|-------|-------|-------------|
| **Name** | `bem-fsrd-website` | Nama service |
| **Root Directory** | `frontend` | Root folder frontend |
| **Build Command** | `npm install && npm run build` | Build command |
| **Publish Directory** | `dist` | Output folder |

**Atau gunakan file `render.yaml` yang sudah saya buat** (lebih mudah).

### 4. Setup Environment Variables

1. **Klik** "Advanced" → "Environment Variables"
2. **Add** environment variables:

   | Key | Value | Description |
   |-----|-------|-------------|
   | `NODE_ENV` | `production` | Environment |
   | `GITHUB_PAGES` | `false` | Bukan GitHub Pages |
   | `VITE_API_URL` | `https://your-backend-url.com/api` | Backend API URL |

**Catatan**: `VITE_API_URL` harus di-set ke backend API Anda.

### 5. Deploy

1. **Klik**: "Create Static Site"
2. **Monitor**: Build logs di Render dashboard
3. **Tunggu**: Build selesai (sekitar 2-3 menit)
4. **Check**: Website akan otomatis live

### 6. Setup Custom Domain (Opsional)

1. **Settings** → **Custom Domains**
2. **Add**: Domain Anda
3. **Setup DNS** sesuai instruksi Render
4. **SSL** akan otomatis terpasang

## 📝 Render Configuration File

Saya sudah buatkan file `render.yaml` untuk konfigurasi otomatis. Render akan menggunakan konfigurasi ini jika ada.

**File**: `render.yaml` (di root project)

## 🔄 Auto-Deploy dari GitHub

Render akan otomatis deploy setiap ada push ke `main` branch.

**Setup**:
1. Render → Service → Settings
2. **Auto Deploy**: Enable
3. **Branch**: `main`

## 🐛 Troubleshooting

### Build Gagal

**Error**: `npm install failed`

**Solusi**:
1. Check build logs di Render
2. Pastikan `package.json` valid
3. Pastikan dependencies bisa di-install

### Publish Directory Not Found

**Error**: `dist folder not found`

**Solusi**:
1. Pastikan build command benar: `npm run build`
2. Pastikan output directory: `dist`
3. Check build logs untuk melihat folder yang dibuat

### API Tidak Connect

**Error**: Frontend tidak bisa connect ke backend

**Solusi**:
1. Set `VITE_API_URL` di Render environment variables
2. Pastikan backend sudah di-deploy dan accessible
3. Check CORS di backend (harus allow Render domain)

## 📋 Checklist

- [ ] Render account sudah dibuat
- [ ] Repository sudah di-connect
- [ ] Root directory sudah di-set ke `frontend`
- [ ] Build command sudah di-set
- [ ] Publish directory sudah di-set ke `dist`
- [ ] Environment variables sudah di-set
- [ ] Deploy berhasil
- [ ] Website accessible

## 🌐 Website URL

Setelah deploy berhasil:
- Render akan memberikan URL: `https://your-project.onrender.com`
- Atau custom domain jika sudah setup

## 📚 Next Steps

1. Deploy backend (jika belum)
2. Set `VITE_API_URL` di Render environment variables
3. Setup custom domain (opsional)
4. Monitor logs dan performance

---

**Selamat! Website Anda sudah di Render! 🎨**

