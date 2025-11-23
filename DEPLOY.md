# 🚀 Panduan Hosting/Deployment

Panduan lengkap untuk menghosting Website BEM FSRD ISI Yogyakarta ke production.

## 📋 Daftar Isi

- [Persiapan](#-persiapan)
- [Opsi Hosting](#-opsi-hosting)
- [Deploy ke VPS (Recommended)](#-deploy-ke-vps-recommended)
  - [Setup Server](#1-setup-server)
  - [Install Dependencies](#2-install-dependencies)
  - [Setup Database](#3-setup-database)
  - [Deploy Backend](#4-deploy-backend)
  - [Deploy Frontend](#5-deploy-frontend)
  - [Setup Nginx](#6-setup-nginx)
  - [Setup SSL](#7-setup-ssl)
  - [Setup PM2](#8-setup-pm2)
- [Deploy ke Shared Hosting](#-deploy-ke-shared-hosting)
- [Deploy ke Cloud Platform](#-deploy-ke-cloud-platform)
- [Post-Deployment](#-post-deployment)
- [Monitoring & Maintenance](#-monitoring--maintenance)

---

## ⚙️ Persiapan

Sebelum melakukan deployment, pastikan:

- [ ] Aplikasi sudah berjalan sempurna di development
- [ ] Semua fitur sudah ditest
- [ ] Database schema sudah final
- [ ] Domain sudah disiapkan (jika menggunakan custom domain)
- [ ] Server/hosting sudah disiapkan
- [ ] Backup database development sudah dibuat

### Build untuk Production

**Backend:**
```bash
cd backend
# Pastikan semua dependencies terinstall
npm install --production
```

**Frontend:**
```bash
cd frontend
# Pastikan file .env production sudah benar
# Build aplikasi
npm run build
```

File build akan berada di folder `frontend/dist/`

---

## 🌐 Opsi Hosting

### 1. VPS (Virtual Private Server) - **RECOMMENDED**
- **Keuntungan**: Full control, performa tinggi, fleksibel
- **Provider**: DigitalOcean, Vultr, AWS EC2, Google Cloud, Azure
- **Biaya**: $5-20/bulan
- **Skill Level**: Intermediate

### 2. Shared Hosting
- **Keuntungan**: Murah, mudah setup
- **Provider**: Hostinger, Niagahoster, RumahWeb
- **Biaya**: Rp 50.000-200.000/bulan
- **Skill Level**: Beginner
- **Catatan**: Beberapa shared hosting tidak support Node.js

### 3. Cloud Platform (PaaS)
- **Keuntungan**: Auto-scaling, managed services
- **Provider**: Heroku, Railway, Render, Vercel, Netlify
- **Biaya**: Free tier tersedia, paid mulai $7/bulan
- **Skill Level**: Beginner-Intermediate

---

## 🖥️ Deploy ke VPS (Recommended)

### Prerequisites VPS

- **OS**: Ubuntu 20.04/22.04 LTS (Recommended)
- **RAM**: Minimal 1GB (2GB recommended)
- **Storage**: Minimal 20GB
- **Node.js**: v16+ atau v18+
- **MySQL**: v8.0+
- **Nginx**: Web server & reverse proxy
- **PM2**: Process manager untuk Node.js
- **Domain**: Domain name (opsional, bisa pakai IP)

---

### 1. Setup Server

#### 1.1. Connect ke Server

```bash
ssh root@your-server-ip
# Atau
ssh username@your-server-ip
```

#### 1.2. Update System

```bash
sudo apt update
sudo apt upgrade -y
```

#### 1.3. Install Node.js

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

#### 1.4. Install MySQL

```bash
sudo apt install mysql-server -y

# Secure MySQL installation
sudo mysql_secure_installation

# Create MySQL user
sudo mysql -u root -p
```

Di MySQL prompt:
```sql
CREATE DATABASE bem_isi_yogyakarta;
CREATE USER 'bem_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON bem_isi_yogyakarta.* TO 'bem_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 1.5. Install Nginx

```bash
sudo apt install nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

#### 1.6. Install PM2

```bash
sudo npm install -g pm2

# Verify installation
pm2 --version
```

#### 1.7. Install Git (jika belum ada)

```bash
sudo apt install git -y
```

---

### 2. Install Dependencies

```bash
# Install build tools (untuk beberapa npm packages)
sudo apt install build-essential -y
```

---

### 3. Setup Database

#### 3.1. Upload Schema Database

**Opsi 1: Upload via SCP**
```bash
# Dari local computer
scp backend/database/schema.sql username@server-ip:/home/username/
```

**Opsi 2: Clone Repository**
```bash
# Di server
cd /var/www
git clone your-repository-url bem-fsrd-website
# Atau
# Upload project via FTP/SFTP
```

#### 3.2. Import Database

```bash
# Di server
mysql -u bem_user -p bem_isi_yogyakarta < schema.sql
# Atau jika file ada di project
cd /var/www/bem-fsrd-website/backend
mysql -u bem_user -p bem_isi_yogyakarta < database/schema.sql
```

#### 3.3. Create Admin User

```bash
cd /var/www/bem-fsrd-website/backend
npm install
npm run create-admin
```

---

### 4. Deploy Backend

#### 4.1. Upload Project ke Server

**Opsi 1: Git Clone**
```bash
cd /var/www
sudo git clone your-repository-url bem-fsrd-website
cd bem-fsrd-website
```

**Opsi 2: Upload via SFTP/SCP**
```bash
# Dari local computer
scp -r gabut username@server-ip:/var/www/bem-fsrd-website
```

#### 4.2. Setup Backend Environment

```bash
cd /var/www/bem-fsrd-website/backend
npm install --production

# Buat file .env
sudo nano .env
```

Isi file `.env`:
```env
PORT=5000
NODE_ENV=production
DB_HOST=localhost
DB_USER=bem_user
DB_PASSWORD=strong_password_here
DB_NAME=bem_isi_yogyakarta
JWT_SECRET=your_production_jwt_secret_minimum_32_characters_long
JWT_EXPIRES_IN=7d
UPLOAD_PATH=./uploads
```

**⚠️ PENTING:**
- Gunakan JWT_SECRET yang berbeda dari development
- Gunakan password database yang kuat
- Pastikan UPLOAD_PATH menggunakan absolute path untuk production

#### 4.3. Create Uploads Directory

```bash
cd /var/www/bem-fsrd-website/backend
mkdir -p uploads/{news,gallery,programs,events,organization,hero-slider,chairman,about,avatars,general}
chmod -R 755 uploads
```

#### 4.4. Test Backend

```bash
cd /var/www/bem-fsrd-website/backend
npm start
```

Cek di browser: `http://your-server-ip:5000/api/health`

Jika berhasil, stop dengan `Ctrl+C`.

#### 4.5. Setup PM2

```bash
cd /var/www/bem-fsrd-website/backend

# Start dengan PM2
pm2 start server.js --name "bem-backend"

# Atau dengan konfigurasi ecosystem (Recommended)
```

Buat file `ecosystem.config.js` di folder `backend/`:
```javascript
module.exports = {
  apps: [{
    name: 'bem-backend',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
```

Start dengan PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
# Ikuti instruksi yang muncul untuk auto-start saat reboot
```

PM2 Commands:
```bash
pm2 list                    # Lihat semua process
pm2 logs bem-backend        # Lihat logs
pm2 restart bem-backend     # Restart
pm2 stop bem-backend        # Stop
pm2 delete bem-backend      # Hapus dari PM2
```

---

### 5. Deploy Frontend

#### 5.1. Build Frontend

```bash
cd /var/www/bem-fsrd-website/frontend

# Buat file .env production
nano .env
```

Isi file `.env`:
```env
VITE_API_URL=http://your-domain.com/api
# Atau jika belum punya domain:
# VITE_API_URL=http://your-server-ip:5000/api
```

Build aplikasi:
```bash
npm install
npm run build
```

Build akan menghasilkan folder `dist/` yang berisi file static.

#### 5.2. Copy Build Files

```bash
# Copy ke folder nginx
sudo cp -r dist/* /var/www/html/bem-fsrd/

# Atau buat folder khusus
sudo mkdir -p /var/www/bem-fsrd
sudo cp -r dist/* /var/www/bem-fsrd/
sudo chown -R www-data:www-data /var/www/bem-fsrd
```

---

### 6. Setup Nginx

#### 6.1. Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/bem-fsrd
```

Isi dengan:
```nginx
# Frontend - Serve React App
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    # Atau gunakan IP: server_name your-server-ip;

    root /var/www/bem-fsrd;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Serve static files
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API Proxy - Forward ke backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Upload files - Serve dari backend
    location /uploads {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

#### 6.2. Enable Site

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/bem-fsrd /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

#### 6.3. Configure Firewall

```bash
# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'
# Atau
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

---

### 7. Setup SSL (HTTPS)

#### 7.1. Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

#### 7.2. Get SSL Certificate

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Certbot akan:
- Mendapatkan SSL certificate dari Let's Encrypt
- Mengkonfigurasi Nginx untuk HTTPS
- Setup auto-renewal

#### 7.3. Test Auto-Renewal

```bash
sudo certbot renew --dry-run
```

SSL certificate akan auto-renew setiap 90 hari.

---

### 8. Setup PM2 (Jika belum)

Jika belum setup PM2, ikuti langkah di section [4.5. Setup PM2](#45-setup-pm2).

---

## 📦 Deploy ke Shared Hosting

### Prerequisites
- Shared hosting dengan support Node.js (beberapa tidak support)
- FTP/SFTP access
- cPanel access
- MySQL database

### Langkah-Langkah

#### 1. Cek Support Node.js

Cek apakah hosting Anda support Node.js:
- Login ke cPanel
- Cari "Node.js Selector" atau "Node.js"
- Jika ada, hosting support Node.js

#### 2. Upload Project

Via FTP/SFTP:
```
/public_html/
  /api/          (Backend files)
  /uploads/      (Upload directory)
  /dist/         (Frontend build files)
```

#### 3. Setup Database

1. Buat database di cPanel > MySQL Databases
2. Import schema via phpMyAdmin atau command line
3. Catat credentials database

#### 4. Setup Backend

```bash
# Via SSH (jika tersedia)
cd public_html/api
npm install --production

# Buat .env
nano .env
```

Konfigurasi `.env`:
```env
PORT=3000
NODE_ENV=production
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
UPLOAD_PATH=./uploads
```

#### 5. Start Node.js App

Via cPanel Node.js Selector:
1. Pilih Node.js version
2. Set Application root: `public_html/api`
3. Set Application URL: `/api`
4. Set Application startup file: `server.js`
5. Set Environment variables (copy dari .env)
6. Click "Start App"

#### 6. Build Frontend

```bash
cd frontend
npm run build
```

Upload folder `dist/` ke `public_html/`

#### 7. Setup .htaccess (Jika diperlukan)

Buat file `.htaccess` di `public_html/`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## ☁️ Deploy ke Cloud Platform

### Deploy ke Railway

#### 1. Setup Backend

1. Login ke Railway (https://railway.app)
2. New Project > Deploy from GitHub
3. Connect repository
4. Add Service > Backend folder
5. Set Environment Variables:
   - `PORT`: Railway akan auto-set
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: Dari Railway MySQL addon
   - `JWT_SECRET`: Generate random string
6. Railway akan auto-deploy

#### 2. Setup Frontend

1. Add Service > Frontend folder
2. Set Build Command: `npm run build`
3. Set Start Command: `npm run preview` atau serve static files
4. Set Environment Variables:
   - `VITE_API_URL`: URL backend dari Railway (format: https://your-backend.up.railway.app/api)
5. Set Public Directory: `dist`

#### 3. Setup Domain

1. Settings > Custom Domain
2. Add domain
3. Setup DNS records sesuai instruksi Railway

---

### Deploy ke Render

#### 1. Setup Backend

1. Login ke Render (https://render.com)
2. New > Web Service
3. Connect repository
4. Settings:
   - **Name**: bem-backend
   - **Root Directory**: backend
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add Environment Variables (sama seperti Railway)
6. Deploy

#### 2. Setup Frontend

1. New > Static Site
2. Connect repository
3. Settings:
   - **Root Directory**: frontend
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: dist
4. Add Environment Variable:
   - `VITE_API_URL`: URL backend dari Render
5. Deploy

---

### Deploy ke Vercel (Frontend Only)

Vercel khusus untuk frontend. Backend harus di-hosting terpisah.

1. Login ke Vercel (https://vercel.com)
2. New Project > Import Git Repository
3. Root Directory: `frontend`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Environment Variables:
   - `VITE_API_URL`: URL backend Anda
7. Deploy

---

## ✅ Post-Deployment

### 1. Test Aplikasi

- [ ] Frontend dapat diakses
- [ ] Backend API dapat diakses (`/api/health`)
- [ ] Login admin berhasil
- [ ] Upload gambar berhasil
- [ ] Semua fitur berfungsi

### 2. Setup Monitoring

**PM2 Monitoring:**
```bash
pm2 monit
```

**Uptime Monitoring:**
- Gunakan layanan seperti UptimeRobot, Pingdom, atau StatusCake
- Monitor URL: `https://your-domain.com` dan `https://your-domain.com/api/health`

### 3. Setup Backup

**Database Backup:**
```bash
# Manual backup
mysqldump -u bem_user -p bem_isi_yogyakarta > backup_$(date +%Y%m%d).sql

# Automated backup (crontab)
crontab -e
```

Tambahkan:
```bash
# Backup database setiap hari jam 2 pagi
0 2 * * * mysqldump -u bem_user -p'password' bem_isi_yogyakarta > /backup/db_$(date +\%Y\%m\%d).sql
```

**Upload Files Backup:**
```bash
# Backup folder uploads
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz /var/www/bem-fsrd-website/backend/uploads
```

### 4. Security Checklist

- [ ] SSL/HTTPS sudah aktif
- [ ] JWT_SECRET menggunakan string acak yang kuat
- [ ] Database password kuat
- [ ] Firewall dikonfigurasi dengan benar
- [ ] Admin password sudah diubah
- [ ] File `.env` tidak di-commit ke Git
- [ ] File permissions sudah benar
- [ ] Regular security updates

---

## 🔄 Monitoring & Maintenance

### Daily Tasks

1. **Check Server Status**
   ```bash
   pm2 status
   sudo systemctl status nginx
   sudo systemctl status mysql
   ```

2. **Check Logs**
   ```bash
   pm2 logs bem-backend --lines 50
   sudo tail -f /var/log/nginx/error.log
   ```

### Weekly Tasks

1. **Update System**
   ```bash
   sudo apt update
   sudo apt upgrade
   ```

2. **Check Disk Space**
   ```bash
   df -h
   ```

3. **Check Database Size**
   ```bash
   mysql -u bem_user -p -e "SELECT table_schema AS 'Database', ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)' FROM information_schema.TABLES WHERE table_schema = 'bem_isi_yogyakarta' GROUP BY table_schema;"
   ```

### Monthly Tasks

1. **Backup Database**
2. **Backup Upload Files**
3. **Review Logs**
4. **Check SSL Certificate Expiry**
   ```bash
   sudo certbot certificates
   ```

---

## 🐛 Troubleshooting Deployment

### Backend tidak berjalan

```bash
# Cek logs
pm2 logs bem-backend

# Restart
pm2 restart bem-backend

# Cek port
sudo netstat -tulpn | grep 5000
```

### Frontend tidak bisa connect ke backend

1. Cek `VITE_API_URL` di frontend `.env`
2. Cek Nginx proxy configuration
3. Cek firewall/security group rules
4. Test backend langsung: `curl http://localhost:5000/api/health`

### Database connection failed

1. Cek credentials di `.env`
2. Cek MySQL service: `sudo systemctl status mysql`
3. Test connection: `mysql -u bem_user -p bem_isi_yogyakarta`
4. Cek firewall MySQL

### SSL Certificate Error

```bash
# Renew certificate
sudo certbot renew

# Reinstall certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com --force-renewal
```

### Permission Denied

```bash
# Fix file permissions
sudo chown -R www-data:www-data /var/www/bem-fsrd
sudo chmod -R 755 /var/www/bem-fsrd

# Fix uploads permission
sudo chown -R $USER:$USER /var/www/bem-fsrd-website/backend/uploads
sudo chmod -R 755 /var/www/bem-fsrd-website/backend/uploads
```

---

## 📞 Support

Jika mengalami masalah saat deployment:
1. Cek logs aplikasi dan server
2. Cek dokumentasi troubleshooting
3. Hubungi support hosting provider
4. Hubungi tim development

---

**Selamat! Aplikasi Anda sudah online! 🎉**

