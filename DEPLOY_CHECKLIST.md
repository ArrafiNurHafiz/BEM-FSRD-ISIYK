# ✅ Deployment Checklist - Website Online!

Checklist lengkap untuk deploy website BEM FSRD ISI Yogyakarta ke hosting gratis.

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Code & Repository:
- [ ] Semua kode sudah di-commit ke GitHub
- [ ] Repository GitHub sudah dibuat: `ArrafiNurHafiz/BEM-FSRD-ISIYK`
- [ ] Semua file ada di repository
- [ ] `.gitignore` sudah benar (tidak commit `.env`, `node_modules`, dll)
- [ ] `package.json` sudah benar untuk backend dan frontend
- [ ] Database schema file (`schema.sql`) ada di `backend/database/`

### Local Testing:
- [ ] Backend bisa berjalan di local: `cd backend && npm start`
- [ ] Frontend bisa build: `cd frontend && npm run build`
- [ ] Database connection berfungsi di local
- [ ] Admin user bisa dibuat dan login

---

## 🚀 DEPLOYMENT CHECKLIST - RAILWAY

### 1. Railway Account Setup:
- [ ] Daftar Railway: https://railway.app
- [ ] Login dengan GitHub account
- [ ] Authorize Railway untuk akses GitHub repos

### 2. MySQL Database:
- [ ] Create MySQL database di Railway
- [ ] SIMPAN database credentials:
  - [ ] `MYSQLHOST`
  - [ ] `MYSQLPORT`
  - [ ] `MYSQLUSER`
  - [ ] `MYSQLPASSWORD`
  - [ ] `MYSQLDATABASE`
  - [ ] `MYSQL_URL` (connection string)

### 3. Backend Service:
- [ ] Create backend service di Railway
- [ ] Set **Root Directory**: `backend`
- [ ] Set **Start Command**: `npm start`
- [ ] Environment Variables di-set:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=10000`
  - [ ] `DB_HOST=${{MySQL.MYSQLHOST}}`
  - [ ] `DB_PORT=${{MySQL.MYSQLPORT}}`
  - [ ] `DB_USER=${{MySQL.MYSQLUSER}}`
  - [ ] `DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}`
  - [ ] `DB_NAME=${{MySQL.MYSQLDATABASE}}`
  - [ ] `JWT_SECRET=[secret key panjang]`
  - [ ] `JWT_EXPIRES_IN=7d`
  - [ ] `UPLOAD_PATH=./uploads`
  - [ ] `FRONTEND_URL=[akan diupdate setelah frontend deploy]`
- [ ] Generate domain untuk backend
- [ ] **SIMPAN** backend URL (contoh: `https://xxx.railway.app`)
- [ ] Backend deployment sukses
- [ ] Test backend health: `https://xxx.railway.app/api/health`

### 4. Frontend Service:
- [ ] Create frontend service di Railway
- [ ] Set **Root Directory**: `frontend`
- [ ] Set **Build Command**: `npm install && npm run build`
- [ ] Set **Start Command**: `npx serve dist -s -l $PORT`
- [ ] Environment Variables di-set:
  - [ ] `VITE_API_URL=https://xxx.railway.app/api` (URL backend)
  - [ ] `NODE_ENV=production`
  - [ ] `GITHUB_PAGES=false`
- [ ] Generate domain untuk frontend
- [ ] **SIMPAN** frontend URL (contoh: `https://xxx.railway.app`)
- [ ] Frontend build sukses
- [ ] Frontend deployment sukses

### 5. Update CORS:
- [ ] Update backend environment variable `FRONTEND_URL` dengan URL frontend
- [ ] Redeploy backend untuk apply CORS changes

### 6. Database Setup:
- [ ] Connect ke MySQL database (via Railway terminal atau MySQL client)
- [ ] Import database schema: `backend/database/schema.sql`
- [ ] Verify tables created:
  - [ ] `users`
  - [ ] `news`
  - [ ] `categories`
  - [ ] `programs`
  - [ ] `events`
  - [ ] `gallery`
  - [ ] `comments`
  - [ ] `aspirations`
  - [ ] dll (check schema.sql)
- [ ] Create admin user (via script atau API)

### 7. Admin User:
- [ ] Admin user berhasil dibuat
- [ ] Admin credentials:
  - [ ] Username: `BEMYK` (default)
  - [ ] Password: `admin-bemyk` (default - **UBAH SETELAH LOGIN PERTAMA!**)
  - [ ] Email: `bemyk@isi.ac.id`

---

## ✅ POST-DEPLOYMENT CHECKLIST

### Testing:
- [ ] Frontend bisa diakses: `https://xxx.railway.app`
- [ ] Backend API health check: `https://xxx.railway.app/api/health`
- [ ] Admin login page bisa diakses: `https://xxx.railway.app/admin/login`
- [ ] Admin login berhasil
- [ ] Dashboard admin bisa diakses
- [ ] CRUD operations berfungsi:
  - [ ] Create news
  - [ ] Update news
  - [ ] Delete news
  - [ ] Upload images
  - [ ] View gallery
  - [ ] Manage programs
  - [ ] Manage events
  - [ ] dll
- [ ] Public pages berfungsi:
  - [ ] Homepage
  - [ ] News list
  - [ ] News detail
  - [ ] Programs
  - [ ] Gallery
  - [ ] Events
  - [ ] Contact form
  - [ ] Aspiration form

### Security:
- [ ] Password admin sudah diubah (jangan gunakan default!)
- [ ] JWT_SECRET sudah diganti (jangan gunakan default di production!)
- [ ] HTTPS/SSL aktif (Railway otomatis)
- [ ] CORS configured correctly
- [ ] Environment variables tidak exposed di frontend (hanya VITE_ vars)

### Content:
- [ ] Upload initial content (berita, program, galeri, dll)
- [ ] Test image uploads
- [ ] Test file uploads
- [ ] Content bisa di-view di public pages

---

## 🔧 OPTIONAL: Custom Domain

- [ ] Punya domain sendiri?
- [ ] Setup custom domain di Railway:
  - [ ] Add custom domain di backend service (Settings → Networking)
  - [ ] Add custom domain di frontend service
  - [ ] Update DNS records (CNAME pointing ke Railway)
  - [ ] SSL certificate otomatis dibuat
- [ ] Update environment variables dengan custom domain
- [ ] Test custom domain

---

## 📊 MONITORING CHECKLIST

- [ ] Railway dashboard bisa diakses
- [ ] Logs bisa di-view (untuk debugging)
- [ ] Monitor resource usage (RAM, CPU, storage)
- [ ] Monitor database size
- [ ] Set up alerts (optional)

---

## 🆘 TROUBLESHOOTING CHECKLIST

Jika ada masalah, cek:

### Backend Issues:
- [ ] Check Railway logs untuk backend service
- [ ] Verify environment variables
- [ ] Test database connection
- [ ] Check if port is correct (`PORT` env var)
- [ ] Verify JWT_SECRET is set
- [ ] Check file uploads directory permissions

### Frontend Issues:
- [ ] Check Railway logs untuk frontend service
- [ ] Verify `VITE_API_URL` is correct
- [ ] Check if build was successful
- [ ] Verify CORS settings di backend
- [ ] Check browser console untuk errors

### Database Issues:
- [ ] Verify database credentials
- [ ] Check if schema is imported correctly
- [ ] Test database connection from Railway terminal
- [ ] Check database size (free tier limit: 500 MB)

### API Connection Issues:
- [ ] Test backend API directly: `curl https://xxx.railway.app/api/health`
- [ ] Verify `VITE_API_URL` includes `/api` at the end
- [ ] Check CORS configuration
- [ ] Verify `FRONTEND_URL` in backend matches frontend URL

---

## 🎉 FINAL CHECKLIST

- [ ] ✅ Website ONLINE dan bisa diakses!
- [ ] ✅ Admin bisa login dan manage content
- [ ] ✅ Public pages berfungsi dengan baik
- [ ] ✅ Semua fitur utama berfungsi
- [ ] ✅ Database connected dan working
- [ ] ✅ Images bisa di-upload dan di-view
- [ ] ✅ SSL/HTTPS aktif
- [ ] ✅ No critical errors in logs

---

## 📝 DOCUMENTATION

Setelah deployment sukses, dokumentasikan:

- [ ] Backend URL: `https://xxx.railway.app`
- [ ] Frontend URL: `https://xxx.railway.app`
- [ ] Admin login URL: `https://xxx.railway.app/admin/login`
- [ ] Admin credentials (simpan di tempat aman!)
- [ ] Database connection details (simpan di tempat aman!)
- [ ] Environment variables list (simpan backup!)
- [ ] Custom domain (jika ada)

---

## 🎊 SUCCESS!

Jika semua checklist di atas sudah ✅, berarti website Anda sudah **ONLINE** dan siap digunakan!

**Selamat! Website BEM FSRD ISI Yogyakarta sudah live! 🚀**

---

**Last Updated**: 2025
**Platform**: Railway
**Status**: ✅ Ready for Deployment

