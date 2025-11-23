# 🔧 Debug: Workflow Masih Gagal

Workflow masih gagal? Mari kita debug step by step.

## ✅ Yang Sudah Diperbaiki

1. ✅ **Workflow file diperbaiki** dengan error handling yang lebih baik
2. ✅ **Build verification** ditambahkan untuk memastikan build sukses
3. ✅ **Better error messages** untuk debugging

## 🔍 Debug Steps

### 1. Check Workflow Error

1. Buka: https://github.com/ArrafiNurHafiz/BEM-FSRD-ISIYK/actions
2. Klik pada workflow yang gagal (red X)
3. Klik pada job **"build-and-deploy"**
4. Lihat step mana yang gagal dan error message-nya

**Kemungkinan Error:**

#### A. Build Gagal
```
Error: npm run build failed
```
**Solusi:**
- Check apakah `frontend/package-lock.json` ada
- Pastikan semua dependencies bisa di-install
- Check error message di step "Install dependencies"

#### B. Environment Not Found
```
Error: Environment 'github-pages' could not be found
```
**Solusi:**
1. Buka: https://github.com/ArrafiNurHafiz/BEM-FSRD-ISIYK/settings/pages
2. Pastikan **Source** sudah di-set ke **"GitHub Actions"**
3. Klik **"Save"**
4. Environment akan otomatis dibuat

#### C. Permission Denied
```
Error: Permission denied
```
**Solusi:**
- Workflow permissions sudah benar di file workflow
- Pastikan repository settings → Actions → General → Workflow permissions: **"Read and write permissions"**

#### D. Path Not Found
```
Error: path './frontend/dist' not found
```
**Solusi:**
- Build gagal atau path salah
- Check step "Verify build output" untuk detail

### 2. Enable GitHub Pages

**Penting:** Pastikan GitHub Pages sudah di-enable dengan benar!

1. **Buka Settings**: https://github.com/ArrafiNurHafiz/BEM-FSRD-ISIYK/settings/pages

2. **Source**: Pilih **"GitHub Actions"** (BUKAN "Deploy from a branch")

3. **Save**

4. **Verify**: Refresh halaman, seharusnya ada environment "github-pages" yang terbuat otomatis

### 3. Check Repository Settings

1. **Buka**: https://github.com/ArrafiNurHafiz/BEM-FSRD-ISIYK/settings/actions

2. **Workflow permissions**: 
   - Pilih **"Read and write permissions"**
   - Centang **"Allow GitHub Actions to create and approve pull requests"**

3. **Save**

### 4. Manual Test Build

Test build secara lokal untuk memastikan tidak ada error:

```bash
cd /home/arrafinur/gabut/frontend

# Install dependencies
npm ci

# Build dengan environment GitHub Pages
export GITHUB_PAGES=true
export VITE_API_URL=http://localhost:5000/api
export NODE_ENV=production
npm run build

# Check output
ls -la dist/
cat dist/index.html | head -20
```

Jika build gagal di lokal, perbaiki error tersebut dulu sebelum push.

### 5. Re-run Workflow

Setelah memperbaiki masalah:

1. **Buka Actions**: https://github.com/ArrafiNurHafiz/BEM-FSRD-ISIYK/actions
2. **Klik workflow yang gagal**
3. **Klik "Re-run jobs"** → **"Re-run failed jobs"**

Atau push perubahan baru:

```bash
cd /home/arrafinur/gabut
git push
```

## 🚀 Quick Fix Checklist

- [ ] GitHub Pages Source sudah di-set ke **"GitHub Actions"**
- [ ] Workflow permissions sudah **"Read and write"**
- [ ] Environment `github-pages` sudah dibuat (otomatis setelah enable Pages)
- [ ] Build sukses di lokal (`npm run build` di frontend/)
- [ ] File workflow sudah di-push ke GitHub
- [ ] Tidak ada workflow duplikat yang konflik

## 📋 Workflow File yang Benar

Pastikan workflow file `.github/workflows/deploy-pages.yml` memiliki:

1. ✅ `permissions` dengan `pages: write` dan `id-token: write`
2. ✅ `environment: name: github-pages`
3. ✅ `actions/configure-pages@v4` step
4. ✅ `actions/upload-pages-artifact@v3` step
5. ✅ `actions/deploy-pages@v4` step

## 🐛 Common Issues & Solutions

### Issue 1: "Environment github-pages not found"

**Fix:**
1. Settings → Pages
2. Source: **GitHub Actions**
3. Save
4. Re-run workflow

### Issue 2: "Build failed"

**Fix:**
1. Test build lokal: `cd frontend && npm ci && npm run build`
2. Fix error yang muncul
3. Push fix

### Issue 3: "Permission denied"

**Fix:**
1. Settings → Actions → General
2. Workflow permissions: **Read and write**
3. Save

### Issue 4: "Upload artifact failed"

**Fix:**
1. Pastikan build sukses
2. Check path: `./frontend/dist`
3. Pastikan `dist/index.html` ada

---

**Setelah semua checklist selesai, workflow seharusnya berjalan! 🚀**

