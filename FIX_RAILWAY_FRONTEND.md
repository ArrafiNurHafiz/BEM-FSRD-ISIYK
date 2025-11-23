# 🔧 Fix Railway Frontend Deployment Error

## ❌ Error yang Terjadi

```
Error: No start command could be found
```

Error ini terjadi karena Railway tidak menemukan start command untuk frontend service setelah build selesai.

## ✅ Solusi

### Option 1: Update Railway Dashboard Settings (RECOMMENDED - Paling Cepat!)

1. **Buka Railway Dashboard**: https://railway.app/dashboard
2. **Klik pada Frontend Service** yang error
3. **Klik tab "Settings"**
4. **Scroll ke "Build & Deploy"**
5. **Update settings berikut**:

   **Build Command:**
   ```
   npm install && npm run build
   ```

   **Start Command:**
   ```
   npx serve dist -s -l $PORT
   ```
   
   **ATAU jika $PORT tidak bekerja:**
   ```
   npx serve dist -s -l 3000
   ```

6. **Save**
7. **Redeploy** service (Settings → Redeploy atau tunggu auto-redeploy)

---

### Option 2: Update via railway.json File (Sudah Dibuat!)

File `frontend/railway.json` sudah dibuat dengan konfigurasi yang benar:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npx serve dist -s -l ${PORT:-3000}",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Tapi** Railway mungkin tidak otomatis menggunakan file ini jika:
- File tidak di root project (sedang di `frontend/railway.json`)
- Railway menggunakan root directory `frontend`

**Solusi:**
1. **Commit dan push** file `frontend/railway.json` yang sudah dibuat
2. **Atau** copy konfigurasi dari file tersebut ke Railway Dashboard settings

---

### Option 3: Tambahkan serve ke package.json

File `frontend/package.json` sudah di-update dengan script `railway:start`:

```json
"railway:start": "npx serve dist -s -l ${PORT:-3000}"
```

**Tapi** Railway akan otomatis mencari script `start` di package.json.

**Solusi: Update package.json start script:**

1. Edit `frontend/package.json`
2. Update script `start`:
   ```json
   "start": "npx serve dist -s -l ${PORT:-3000}"
   ```
3. Commit dan push
4. Railway akan otomatis menggunakan script `start` ini

---

## 🚀 QUICK FIX (Paling Cepat!)

**Langsung update di Railway Dashboard:**

1. **Railway Dashboard** → Frontend Service → **Settings**
2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `npx serve dist -s -l $PORT`
4. **Save** → Auto redeploy

**DONE!** Frontend akan deploy dalam 1-2 menit.

---

## 📝 Verifikasi

Setelah fix:

1. **Check deployment logs** di Railway Dashboard
2. **Tunggu build selesai** (1-2 menit)
3. **Tunggu start command berjalan**
4. **Test URL frontend**:
   ```
   https://your-frontend-url.railway.app
   ```
5. **Should show website** (bukan error)

---

## 🆘 Masih Error?

### Error: "serve: command not found"

**Fix:** Install serve package terlebih dahulu:

```bash
# Update package.json
npm install --save serve
```

Atau di Railway Dashboard → Frontend Service → Settings → Build Command:
```
npm install && npm install -g serve && npm run build
```

Start Command:
```
serve dist -s -l $PORT
```

### Error: "PORT not found"

**Fix:** Gunakan port langsung:
```
npx serve dist -s -l 3000
```

Atau check Railway environment variables untuk PORT.

### Error: "dist folder not found"

**Fix:** Pastikan build command berhasil:
1. Check build logs di Railway Dashboard
2. Pastikan build tidak error
3. Pastikan build output di folder `dist/`

---

## ✅ Setelah Fix

Website frontend akan online di:
```
https://your-frontend-url.railway.app
```

**Selamat! Frontend sudah online! 🎉**

