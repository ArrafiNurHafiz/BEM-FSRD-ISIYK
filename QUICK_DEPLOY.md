# ⚡ Quick Deploy - Website Online dalam 10 Menit!

Panduan **SUPER CEPAT** untuk deploy website ke Railway - **100% GRATIS**!

## 🎯 TL;DR (Too Long; Didn't Read)

1. **Daftar Railway** → https://railway.app (via GitHub)
2. **New Project** → Connect GitHub repo
3. **Add MySQL Database** → Auto-created
4. **Add Backend Service** → Setup environment variables
5. **Add Frontend Service** → Setup environment variables
6. **Done!** Website online! 🎉

---

## 🚀 STEP-BY-STEP (10 Menit)

### ⏱️ Menit 1-2: Daftar Railway

1. **Buka**: https://railway.app
2. **Klik**: "Start a New Project"
3. **Login** dengan GitHub account
4. **Authorize** Railway

### ⏱️ Menit 2-3: Create Project & Database

1. **Klik**: "New Project" → **"Deploy from GitHub repo"**
2. **Pilih** repository: `ArrafiNurHafiz/BEM-FSRD-ISIYK`
3. **Klik**: "New +" → **"Database"** → **"Add MySQL"**
4. **Wait** sampai database ready (akan ada URL/credentials)

### ⏱️ Menit 3-5: Setup Backend

1. **Klik**: "New +" → **"GitHub Repo"** (pilih repo yang sama lagi)
2. **Settings**:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
   
3. **Variables** (tab "Variables", klik "Raw Editor"):
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=${{MySQL.MYSQLHOST}}
   DB_PORT=${{MySQL.MYSQLPORT}}
   DB_USER=${{MySQL.MYSQLUSER}}
   DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   DB_NAME=${{MySQL.MYSQLDATABASE}}
   JWT_SECRET=BEM_FSRD_ISI_YOGYAKARTA_2025_SECRET_KEY_MIN_32_CHARS_CHANGE_THIS
   JWT_EXPIRES_IN=7d
   UPLOAD_PATH=./uploads
   ```
   
   **CATATAN**: `${{MySQL.MYSQLHOST}}` adalah reference ke MySQL service (otomatis di-resolve Railway)

4. **Generate Domain** → Settings → Networking → "Generate Domain"
5. **SIMPAN** URL backend (contoh: `bem-fsrd-backend-production.up.railway.app`)

### ⏱️ Menit 5-7: Setup Frontend

1. **Klik**: "New +" → **"GitHub Repo"** (pilih repo yang sama lagi)
2. **Settings**:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx serve dist -s -l $PORT`
   
3. **Variables** (tab "Variables", klik "Raw Editor"):
   ```
   VITE_API_URL=https://bem-fsrd-backend-production.up.railway.app/api
   NODE_ENV=production
   GITHUB_PAGES=false
   ```
   
   **GANTI** `https://bem-fsrd-backend-production.up.railway.app` dengan URL backend Anda!

4. **Generate Domain** → Settings → Networking → "Generate Domain"
5. **SIMPAN** URL frontend (contoh: `bem-fsrd-frontend-production.up.railway.app`)

### ⏱️ Menit 7-8: Update Backend CORS

1. **Klik** backend service → **"Variables"**
2. **Add**:
   ```
   FRONTEND_URL=https://bem-fsrd-frontend-production.up.railway.app
   ```
   (Ganti dengan URL frontend Anda)

3. **Redeploy** backend (Settings → Redeploy)

### ⏱️ Menit 8-9: Setup Database

1. **Klik** MySQL service → **"Connect"** → Copy connection string
2. **Connect** via MySQL client (Workbench, CLI, atau Railway terminal)
3. **Import** schema:
   ```bash
   mysql -h [HOST] -P [PORT] -u [USER] -p [PASSWORD] [DATABASE] < backend/database/schema.sql
   ```
   
   Atau via Railway terminal:
   ```bash
   railway connect mysql
   mysql -u [USER] -p
   source backend/database/schema.sql
   ```

4. **Create admin user** (via Railway terminal atau API):
   ```bash
   cd backend
   npm run create-admin
   ```

### ⏱️ Menit 9-10: Test!

1. **Test Backend**: 
   ```
   https://your-backend-url.railway.app/api/health
   ```
   Should return: `{"status":"ok","message":"API is running"}`

2. **Test Frontend**:
   ```
   https://your-frontend-url.railway.app
   ```
   Should show website!

3. **Test Login**:
   ```
   https://your-frontend-url.railway.app/admin/login
   ```
   Login dengan admin credentials!

---

## ✅ CHECKLIST

- [ ] Railway account dibuat
- [ ] Project dibuat & database added
- [ ] Backend service dibuat & environment variables di-set
- [ ] Frontend service dibuat & environment variables di-set
- [ ] Database schema ter-import
- [ ] Admin user dibuat
- [ ] Backend URL dan Frontend URL di-generate
- [ ] CORS di-update di backend
- [ ] Website bisa diakses! 🎉

---

## 🆘 PROBLEM? Cek Ini!

### Backend error:
- ✅ Check logs di Railway dashboard
- ✅ Check environment variables
- ✅ Test database connection

### Frontend tidak connect ke backend:
- ✅ Check `VITE_API_URL` di frontend variables
- ✅ Pastikan URL benar (dengan `/api` di akhir)
- ✅ Check CORS di backend

### Database error:
- ✅ Pastikan schema sudah ter-import
- ✅ Check database credentials di backend variables
- ✅ Test connection

---

## 🎉 DONE!

Website Anda sekarang **ONLINE** dan **GRATIS**!

**Frontend URL**: `https://your-frontend-url.railway.app`
**Backend URL**: `https://your-backend-url.railway.app/api`

**Selamat! Website BEM FSRD ISI Yogyakarta sudah online! 🚀**

---

## 📚 DETAILED GUIDE

Untuk panduan lengkap dengan troubleshooting, lihat:
- **[RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md)** - Panduan lengkap Railway
- **[HOSTING_GRATIS.md](./HOSTING_GRATIS.md)** - Opsi hosting gratis lainnya

---

**Happy Deploying! 🚂**

