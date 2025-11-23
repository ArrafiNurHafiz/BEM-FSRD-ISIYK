# 🚂 Deploy ke Railway (Gratis, Tanpa Billing Issue)

Jika Anda tidak ingin setup billing di GitHub, kita bisa deploy ke Railway yang **GRATIS** dan tidak perlu billing info!

## ✅ Keuntungan Railway

- ✅ **Gratis** untuk frontend static site
- ✅ **Tidak perlu billing info** untuk free tier
- ✅ **Auto-deploy** dari GitHub
- ✅ **Mudah setup**
- ✅ **Custom domain** support

## 🚀 Langkah Deploy ke Railway

### 1. Setup Railway Account

1. **Buka**: https://railway.app
2. **Sign up** dengan GitHub account
3. **Verify** email (jika diperlukan)

### 2. Create New Project

1. **Klik**: "New Project"
2. **Pilih**: "Deploy from GitHub repo"
3. **Connect**: Repository `ArrafiNurHafiz/BEM-FSRD-ISIYK`
4. **Pilih**: Repository

### 3. Setup Frontend Service

1. **Add Service**: Pilih folder `frontend`
2. **Settings**:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx serve dist -s`
   - **Output Directory**: `dist`

3. **Environment Variables**:
   - `VITE_API_URL`: URL backend Anda (atau `http://localhost:5000/api` untuk sementara)
   - `NODE_ENV`: `production`
   - `GITHUB_PAGES`: (kosongkan, tidak perlu untuk Railway)

4. **Deploy**: Railway akan otomatis build dan deploy

### 4. Setup Custom Domain (Opsional)

1. **Settings** → **Networking**
2. **Custom Domain**: Add domain Anda
3. **Setup DNS** sesuai instruksi Railway

## 📝 Railway Config File (Opsional)

Saya bisa buatkan file `railway.json` untuk konfigurasi otomatis. Mau saya buatkan?

## 🔄 Alternatif: Manual Deploy ke Railway

Jika auto-deploy tidak bisa, kita bisa deploy manual:

1. **Build lokal**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy manual**:
   - Railway → New Service → "Empty Service"
   - Upload folder `dist/`
   - Railway akan serve static files

## 📋 Checklist

- [ ] Railway account sudah dibuat
- [ ] Repository sudah di-connect
- [ ] Frontend service sudah di-setup
- [ ] Environment variables sudah di-set
- [ ] Deploy berhasil

---

**Railway adalah alternatif yang bagus jika GitHub billing menjadi masalah! 🚂**

