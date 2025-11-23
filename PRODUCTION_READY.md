# ✅ Production Ready Checklist

Website BEM FSRD ISI Yogyakarta sudah dimodifikasi dan siap untuk deployment ke production.

## 🎯 Perubahan yang Telah Dilakukan

### Backend (`backend/`)

#### 1. **server.js** - Enhanced untuk Production
- ✅ **CORS Configuration**: Konfigurasi CORS yang aman untuk production dengan origin whitelist
- ✅ **Security Headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, HSTS
- ✅ **Trust Proxy**: Mendukung reverse proxy (Nginx) dengan `trust proxy`
- ✅ **Request Limits**: Body size limits (10MB) untuk mencegah DoS
- ✅ **Health Check**: Enhanced health check endpoint dengan database status dan memory usage
- ✅ **Error Handling**: Improved error handling dengan logging yang proper
- ✅ **Graceful Shutdown**: Handles SIGTERM dan SIGINT untuk graceful shutdown
- ✅ **Process Management**: Better handling untuk unhandled rejections dan exceptions
- ✅ **Upload Path**: Support untuk absolute path untuk production

#### 2. **config/database.js** - Production Database Configuration
- ✅ **Connection Pooling**: Increased connection limit untuk production (20 connections)
- ✅ **Retry Logic**: Automatic retry connection dengan exponential backoff
- ✅ **Connection Monitoring**: Better error handling dan reconnection logic
- ✅ **SSL Support**: Support untuk SSL connections (jika diperlukan)

#### 3. **middleware/upload.js** - Production-Ready Upload
- ✅ **Absolute Path Support**: Support untuk absolute path untuk production
- ✅ **Directory Auto-Creation**: Automatic creation of upload directories
- ✅ **Better Error Handling**: Improved error messages dan handling

#### 4. **Startup Scripts**
- ✅ `start-production.sh` - Shell script untuk Linux/Mac
- ✅ `start-production.bat` - Batch script untuk Windows
- ✅ Scripts otomatis check dependencies, create directories, dan start dengan PM2

### Frontend (`frontend/`)

#### 1. **vite.config.js** - Production Build Optimization
- ✅ **Build Optimization**: Terser minification dengan drop console
- ✅ **Code Splitting**: Manual chunks untuk vendor libraries (react, ui components)
- ✅ **Asset Optimization**: Optimized chunk dan asset file names
- ✅ **Production Settings**: Sourcemaps disabled, console logs removed
- ✅ **Performance**: Optimized dependencies

#### 2. **build-production.sh** / **build-production.bat**
- ✅ Build scripts untuk production
- ✅ Automatic .env file check dan creation
- ✅ Build size reporting

### Configuration Files

#### 1. **.gitignore** - Enhanced
- ✅ Production files ignored (dist, logs, PM2 files)
- ✅ Environment files protected
- ✅ SSL certificates excluded
- ✅ Build artifacts excluded

#### 2. **ecosystem.config.js.example**
- ✅ PM2 configuration template untuk production
- ✅ Environment variables setup
- ✅ Logging configuration

## 📋 Pre-Deployment Checklist

Sebelum melakukan deployment, pastikan:

### Backend

- [ ] File `.env` sudah dibuat dengan production configuration
- [ ] `JWT_SECRET` sudah di-set dengan string acak yang kuat (minimal 32 karakter)
- [ ] Database credentials sudah benar
- [ ] `UPLOAD_PATH` menggunakan absolute path (jika diperlukan)
- [ ] `FRONTEND_URL` sudah di-set untuk CORS (jika menggunakan custom domain)
- [ ] Dependencies sudah di-install: `npm install --production`
- [ ] Database schema sudah di-import
- [ ] Admin user sudah dibuat: `npm run create-admin`
- [ ] Folder `uploads/` dan subdirectories sudah dibuat
- [ ] PM2 sudah terinstall (jika menggunakan PM2): `npm install -g pm2`

### Frontend

- [ ] File `.env` sudah dibuat dengan production API URL
- [ ] `VITE_API_URL` sudah di-set ke production backend URL
- [ ] Dependencies sudah di-install: `npm install`
- [ ] Build test berhasil: `npm run build`
- [ ] Build files ada di folder `dist/`

## 🚀 Deployment Steps

### 1. Build Frontend

```bash
cd frontend
npm run build:prod
# atau
./build-production.sh
```

Build files akan ada di folder `frontend/dist/`

### 2. Start Backend

#### Option A: Menggunakan PM2 (Recommended)

```bash
cd backend

# Copy ecosystem.config.js.example ke ecosystem.config.js
cp ecosystem.config.js.example ecosystem.config.js
# Edit ecosystem.config.js sesuai kebutuhan

# Start dengan PM2
npm run prod:pm2
# atau
pm2 start ecosystem.config.js --env production
```

#### Option B: Menggunakan Script

```bash
cd backend
./start-production.sh
# atau untuk Windows
start-production.bat
```

#### Option C: Manual Start

```bash
cd backend
NODE_ENV=production node server.js
```

### 3. Verify Deployment

- **Backend Health Check**: `http://your-domain.com/api/health`
- **Frontend**: `http://your-domain.com`
- **Admin Panel**: `http://your-domain.com/admin/login`

## 🔧 Production Environment Variables

### Backend `.env`

```env
# Server
PORT=5000
NODE_ENV=production

# Database
DB_HOST=localhost
DB_USER=bem_user
DB_PASSWORD=strong_password_here
DB_NAME=bem_isi_yogyakarta
DB_SSL=false  # Set true jika menggunakan SSL connection

# JWT
JWT_SECRET=your_production_jwt_secret_minimum_32_characters_long
JWT_EXPIRES_IN=7d

# Upload
UPLOAD_PATH=/var/www/bem-fsrd-website/backend/uploads  # Absolute path recommended

# CORS (jika menggunakan custom domain)
FRONTEND_URL=https://your-domain.com,https://www.your-domain.com

# App Version (optional)
APP_VERSION=1.0.0
```

### Frontend `.env`

```env
VITE_API_URL=https://your-domain.com/api
```

## 🔐 Security Features

1. **CORS Protection**: Hanya allow origins yang di-whitelist
2. **Security Headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
3. **HSTS**: Strict Transport Security untuk HTTPS
4. **Request Limits**: Body size limits untuk mencegah DoS
5. **Input Validation**: Express Validator untuk semua inputs
6. **SQL Injection Prevention**: Prepared statements
7. **File Upload Validation**: Type dan size validation
8. **Error Messages**: Tidak expose sensitive information di production

## 📊 Monitoring & Maintenance

### PM2 Commands

```bash
pm2 status              # Check status
pm2 logs bem-backend    # View logs
pm2 monit               # Monitor resources
pm2 restart bem-backend # Restart
pm2 stop bem-backend    # Stop
pm2 delete bem-backend  # Remove
```

### Health Check

```bash
# Check API health
curl http://your-domain.com/api/health

# Response includes:
# - Database status
# - Memory usage
# - Uptime
# - Environment info
```

### Logs

- **PM2 Logs**: `~/.pm2/logs/` atau `backend/logs/`
- **Application Logs**: Console output (redirected by PM2)
- **Error Logs**: PM2 error logs

## 🐛 Troubleshooting

### Backend tidak start

1. Check `.env` file ada dan valid
2. Check database connection: `mysql -u bem_user -p bem_isi_yogyakarta`
3. Check port tidak digunakan: `lsof -i :5000` atau `netstat -tulpn | grep 5000`
4. Check logs: `pm2 logs bem-backend` atau console output

### Database connection failed

1. Verify database credentials di `.env`
2. Check MySQL service running: `sudo systemctl status mysql`
3. Check firewall rules
4. Verify database exists: `mysql -u bem_user -p -e "USE bem_isi_yogyakarta;"`

### Upload files tidak muncul

1. Check `UPLOAD_PATH` di `.env` (harus absolute path)
2. Check folder permissions: `chmod -R 755 uploads/`
3. Check folder ownership: `chown -R user:group uploads/`
4. Verify folder exists: `ls -la uploads/`

### CORS errors

1. Check `FRONTEND_URL` di backend `.env` sesuai dengan frontend domain
2. Verify CORS configuration di `server.js`
3. Check browser console untuk detail error

## 📚 Related Documentation

- [DEPLOY.md](./DEPLOY.md) - Panduan deployment lengkap
- [README.md](./README.md) - Dokumentasi utama
- [INSTALL.md](./INSTALL.md) - Quick start guide
- [ENV_CONFIG.md](./ENV_CONFIG.md) - Environment configuration guide

## ✅ Production Ready Features

- ✅ Security headers configured
- ✅ CORS properly configured
- ✅ Error handling improved
- ✅ Logging enhanced
- ✅ Database connection pooling optimized
- ✅ File upload path support for production
- ✅ Health check endpoint
- ✅ Graceful shutdown
- ✅ Process management ready (PM2)
- ✅ Build optimization for frontend
- ✅ Environment variables properly handled
- ✅ Production scripts available

---

**Status: ✅ Production Ready**

Aplikasi sudah siap untuk di-deploy ke production. Ikuti panduan di [DEPLOY.md](./DEPLOY.md) untuk langkah-langkah deployment.

