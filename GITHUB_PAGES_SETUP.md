# 📄 Setup GitHub Pages

Panduan untuk deploy website ke GitHub Pages.

## 🔍 Masalah

GitHub Pages saat ini hanya menampilkan README.md karena:
- Build files (`frontend/dist/`) tidak ter-commit (ada di `.gitignore`)
- GitHub Pages perlu static files untuk menampilkan website
- Base path belum dikonfigurasi untuk GitHub Pages

## ✅ Solusi

### Opsi 1: GitHub Actions (Recommended - Auto Deploy)

GitHub Actions akan otomatis build dan deploy setiap kali ada push ke branch `main`.

#### 1. Enable GitHub Pages

1. Buka repository: https://github.com/ArrafiNurHafiz/BEM-FSRD-ISIYK
2. Settings → Pages
3. Source: **GitHub Actions**
4. Save

#### 2. Setup Environment Variable (Opsional)

Jika backend sudah di-deploy, set API URL:

1. Settings → Secrets and variables → Actions
2. New repository secret
3. Name: `VITE_API_URL`
4. Value: `https://your-backend-url.com/api`
5. Add secret

#### 3. Push Workflow File

Workflow file sudah dibuat di `.github/workflows/deploy-pages.yml`. Push ke GitHub:

```bash
cd /home/arrafinur/gabut

# Add workflow file
git add .github/workflows/deploy-pages.yml
git commit -m "Add GitHub Actions workflow for Pages deployment"
git push
```

#### 4. Verify Deployment

1. Buka repository → Actions tab
2. Tunggu workflow selesai (sekitar 2-3 menit)
3. Buka website: https://arrafinurhafiz.github.io/BEM-FSRD-ISIYK/

### Opsi 2: Manual Deploy (Quick Fix)

Jika ingin deploy manual tanpa GitHub Actions:

#### 1. Build Frontend

```bash
cd /home/arrafinur/gabut/frontend

# Set environment untuk GitHub Pages
export GITHUB_PAGES=true
export VITE_API_URL=https://your-backend-url.com/api

# Build
npm install
npm run build
```

#### 2. Deploy ke gh-pages Branch

```bash
cd /home/arrafinur/gabut

# Install gh-pages package (jika belum)
npm install -g gh-pages

# Deploy
cd frontend
npx gh-pages -d dist -b gh-pages
```

Atau manual:

```bash
cd /home/arrafinur/gabut

# Create orphan branch
git checkout --orphan gh-pages
git rm -rf .

# Copy build files
cp -r frontend/dist/* .

# Commit dan push
git add .
git commit -m "Deploy to GitHub Pages"
git push -u origin gh-pages

# Kembali ke main branch
git checkout main
```

#### 3. Setup GitHub Pages Source

1. Settings → Pages
2. Source: **Deploy from a branch**
3. Branch: `gh-pages` / `root`
4. Save

## ⚙️ Konfigurasi

### Base Path

Vite config sudah di-update untuk GitHub Pages dengan base path `/BEM-FSRD-ISIYK/`.

Jika ingin menggunakan custom domain:
1. Update `vite.config.js`: `base: '/'`
2. Rebuild dan redeploy

### API URL

Frontend perlu tahu URL backend API. Set di:
- **GitHub Actions**: Repository secrets → `VITE_API_URL`
- **Manual build**: Environment variable saat build

**Contoh:**
```bash
export VITE_API_URL=https://your-backend.railway.app/api
# atau
export VITE_API_URL=https://api.yourdomain.com/api
```

## 🐛 Troubleshooting

### Website masih menampilkan README

1. **Check GitHub Actions**: Pastikan workflow berhasil
2. **Check Pages Settings**: Source harus "GitHub Actions" atau "gh-pages branch"
3. **Wait**: GitHub Pages butuh beberapa menit untuk update
4. **Clear Cache**: Hard refresh browser (Ctrl+Shift+R)

### 404 Error pada Routes

Ini normal untuk SPA. GitHub Pages perlu file `404.html` untuk handle routing.

**Solusi:**
```bash
cd frontend/dist
cp index.html 404.html
# Commit dan push ulang
```

Atau tambahkan di workflow:
```yaml
- name: Fix 404 for SPA
  run: cp frontend/dist/index.html frontend/dist/404.html
```

### Assets tidak muncul

1. Check base path di `vite.config.js`
2. Pastikan build menggunakan `GITHUB_PAGES=true`
3. Check browser console untuk error

### API tidak connect

1. Pastikan backend sudah di-deploy dan accessible
2. Check CORS di backend (harus allow GitHub Pages domain)
3. Check `VITE_API_URL` di environment variables

## 📝 Quick Commands

```bash
# Build untuk GitHub Pages
cd frontend
export GITHUB_PAGES=true
export VITE_API_URL=https://your-backend-url.com/api
npm run build

# Deploy dengan gh-pages
npx gh-pages -d dist -b gh-pages

# Atau manual
cd ..
git checkout --orphan gh-pages
git rm -rf .
cp -r frontend/dist/* .
git add .
git commit -m "Deploy"
git push -u origin gh-pages
git checkout main
```

## 🔗 Links

- **Repository**: https://github.com/ArrafiNurHafiz/BEM-FSRD-ISIYK
- **GitHub Pages**: https://arrafinurhafiz.github.io/BEM-FSRD-ISIYK/
- **Actions**: https://github.com/ArrafiNurHafiz/BEM-FSRD-ISIYK/actions

---

**Setelah setup, website akan otomatis update setiap push ke main branch! 🚀**

