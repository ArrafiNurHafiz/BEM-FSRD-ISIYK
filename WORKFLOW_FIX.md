# 🔧 Fix: Workflow Gagal di GitHub Actions

Saya sudah memperbaiki masalah workflow yang gagal!

## ❌ Masalah

Ada 3 workflow yang gagal di GitHub Actions:
1. ❌ "Deploy static content to Pages" - Konflik dengan React app
2. ❌ "Deploy Jekyll with GitHub Pages dependencies" - Tidak diperlukan untuk React
3. ❌ Workflow duplikat yang menyebabkan konflik

## ✅ Solusi

Saya sudah:
1. ✅ **Menghapus** `jekyll-gh-pages.yml` (untuk Jekyll, tidak diperlukan)
2. ✅ **Menghapus** `static.yml` (workflow generic yang konflik)
3. ✅ **Menyimpan** hanya `deploy-pages.yml` (workflow khusus untuk React app)

## 🚀 Langkah Selanjutnya

### 1. Push Perubahan

Workflow file sudah di-commit. Sekarang push ke GitHub:

```bash
cd /home/arrafinur/gabut
git push
```

**Jika menggunakan SSH (sudah di-setup sebelumnya):**
```bash
git push
```

**Jika masih menggunakan HTTPS:**
- Pastikan SSH key sudah di-add ke GitHub (lihat `SSH_KEY_SETUP.md`)
- Atau jalankan script: `./setup-ssh-and-push.sh`

### 2. Verify Workflow

Setelah push:
1. Buka: https://github.com/ArrafiNurHafiz/BEM-FSRD-ISIYK/actions
2. Anda akan melihat workflow baru: **"Deploy to GitHub Pages"**
3. Tunggu workflow selesai (sekitar 2-3 menit)

### 3. Enable GitHub Pages (Jika Belum)

1. Buka: https://github.com/ArrafiNurHafiz/BEM-FSRD-ISIYK/settings/pages
2. **Source**: Pilih **"GitHub Actions"**
3. Klik **"Save"**

### 4. Check Website

Website akan tersedia di:
**https://arrafinurhafiz.github.io/BEM-FSRD-ISIYK/**

## 📋 Workflow yang Sekarang Aktif

Hanya **satu workflow** yang aktif:
- ✅ `deploy-pages.yml` - Build dan deploy React app ke GitHub Pages

Workflow ini akan:
1. Checkout code
2. Setup Node.js 18
3. Install dependencies
4. Build React app (dengan base path untuk GitHub Pages)
5. Fix 404.html untuk SPA routing
6. Deploy ke GitHub Pages

## ⚠️ Catatan Penting

### Backend API

Pastikan backend sudah di-deploy dan accessible. Jika belum:
- Deploy backend ke VPS, Railway, Render, atau hosting lain
- Set `VITE_API_URL` di Repository Secrets:
  - Settings → Secrets and variables → Actions
  - New repository secret
  - Name: `VITE_API_URL`
  - Value: `https://your-backend-url.com/api`

### Base Path

Website akan diakses dengan path `/BEM-FSRD-ISIYK/` karena nama repository.

Untuk menggunakan root path (`/`), perlu custom domain:
1. Settings → Pages → Custom domain
2. Update `vite.config.js`: `base: '/'`

## 🐛 Troubleshooting

### Workflow masih gagal

1. Check Actions tab untuk error messages
2. Pastikan GitHub Pages source: **GitHub Actions**
3. Pastikan environment `github-pages` sudah dibuat otomatis

### Website masih menampilkan README

1. Clear browser cache (Ctrl+Shift+R)
2. Tunggu beberapa menit (GitHub Pages butuh waktu update)
3. Check Actions tab - pastikan workflow **"Deploy to GitHub Pages"** sudah selesai dan **hijau** ✅

### 404 Error pada Routes

Workflow sudah include fix untuk SPA routing (404.html). Jika masih error:
1. Tunggu deployment selesai
2. Hard refresh browser
3. Check di Actions apakah step "Fix 404 for SPA routing" berhasil

---

**Setelah push, workflow akan otomatis jalan dan deploy website! 🚀**

