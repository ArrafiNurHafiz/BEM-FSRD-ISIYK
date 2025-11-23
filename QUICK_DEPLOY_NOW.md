# ⚡ Quick Deploy - Langkah Cepat

Panduan super cepat untuk deploy sekarang juga!

## ✅ Build Sudah Diperbaiki

- ✅ Terser dependency sudah ditambahkan
- ✅ Build lokal sudah berhasil
- ✅ Semua file sudah di-push ke GitHub

## 🚀 DEPLOY SEKARANG - PILIH SALAH SATU

### 🚂 RAILWAY (5 Menit)

**Langkah Cepat:**

1. **Buka**: https://railway.app → **Login with GitHub**

2. **New Project** → **Deploy from GitHub repo**

3. **Connect**: `ArrafiNurHafiz/BEM-FSRD-ISIYK`

4. **Settings** (klik service):
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npx serve dist -s -l $PORT`
   - Output Directory: `dist`

5. **Variables** (tab):
   - `NODE_ENV` = `production`
   - `GITHUB_PAGES` = `false`
   - `VITE_API_URL` = `http://localhost:5000/api` (update nanti)

6. **Deploy** → Tunggu 2-3 menit

7. **Settings → Networking** → **Generate Domain**

8. **Copy URL** → Test di browser!

**✅ Website Online!**

---

### 🎨 RENDER (5 Menit)

**Langkah Cepat:**

1. **Buka**: https://render.com → **Sign up with GitHub**

2. **New +** → **Static Site**

3. **Connect**: `ArrafiNurHafiz/BEM-FSRD-ISIYK`

4. **Configure**:
   - Name: `bem-fsrd-website`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

5. **Environment Variables**:
   - `NODE_ENV` = `production`
   - `GITHUB_PAGES` = `false`
   - `VITE_API_URL` = `http://localhost:5000/api`

6. **Create Static Site** → Tunggu 2-3 menit

7. **Copy URL** → Test di browser!

**✅ Website Online!**

---

## 📋 Checklist Cepat

**Railway:**
- [ ] Login Railway dengan GitHub
- [ ] New Project → Deploy from GitHub repo
- [ ] Connect repository
- [ ] Set root directory = `frontend`
- [ ] Set build command = `npm install && npm run build`
- [ ] Set start command = `npx serve dist -s -l $PORT`
- [ ] Set output directory = `dist`
- [ ] Add environment variables
- [ ] Deploy
- [ ] Generate domain
- [ ] Test website

**Render:**
- [ ] Login Render dengan GitHub
- [ ] New + → Static Site
- [ ] Connect repository
- [ ] Set root directory = `frontend`
- [ ] Set build command = `npm install && npm run build`
- [ ] Set publish directory = `dist`
- [ ] Add environment variables
- [ ] Create Static Site
- [ ] Test website

---

## 🎯 Yang Perlu Diingat

1. **Root Directory**: Harus `frontend` (bukan root project)
2. **Build Command**: `npm install && npm run build`
3. **Start Command** (Railway): `npx serve dist -s -l $PORT`
4. **Publish Directory** (Render): `dist`
5. **Environment Variables**: Wajib set `NODE_ENV=production` dan `GITHUB_PAGES=false`

---

## 🐛 Jika Ada Error

1. **Check build logs** di platform
2. **Pastikan** semua settings benar
3. **Pastikan** environment variables sudah di-set
4. **Re-deploy** jika perlu

---

**Ikuti langkah di atas, website akan online dalam 5 menit! 🚀**

