# ⚡ Quick Reference: Deployment Checklist

Cheat sheet cepat untuk deployment Website BEM FSRD ISI Yogyakarta.

## 📦 Pre-Deployment

```bash
# 1. Build Frontend
cd frontend
npm run build

# 2. Test Backend
cd ../backend
npm start
# Test di browser: http://localhost:5000/api/health
```

## 🖥️ VPS Deployment (Quick Steps)

### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install mysql-server -y

# Install Nginx
sudo apt install nginx -y

# Install PM2
sudo npm install -g pm2
```

### 2. Database Setup
```bash
# Create database
mysql -u root -p
CREATE DATABASE bem_isi_yogyakarta;
CREATE USER 'bem_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON bem_isi_yogyakarta.* TO 'bem_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import schema
mysql -u bem_user -p bem_isi_yogyakarta < schema.sql
```

### 3. Deploy Backend
```bash
# Upload project ke /var/www/bem-fsrd-website
cd /var/www/bem-fsrd-website/backend

# Install dependencies
npm install --production

# Create .env file
nano .env
# (Isi dengan production config)

# Create uploads folder
mkdir -p uploads/{news,gallery,programs,events,organization,hero-slider,chairman,about,avatars,general}

# Create admin user
npm run create-admin

# Start with PM2
pm2 start server.js --name "bem-backend"
pm2 save
pm2 startup
```

### 4. Deploy Frontend
```bash
cd /var/www/bem-fsrd-website/frontend

# Create .env production
nano .env
VITE_API_URL=https://your-domain.com/api

# Build
npm install
npm run build

# Copy to web root
sudo cp -r dist/* /var/www/bem-fsrd/
sudo chown -R www-data:www-data /var/www/bem-fsrd
```

### 5. Setup Nginx
```bash
# Create config
sudo nano /etc/nginx/sites-available/bem-fsrd
# (Copy dari nginx.config.example)

# Enable site
sudo ln -s /etc/nginx/sites-available/bem-fsrd /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Setup SSL
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## 🔍 Verification

```bash
# Check PM2
pm2 status
pm2 logs bem-backend

# Check Nginx
sudo systemctl status nginx
sudo nginx -t

# Check MySQL
sudo systemctl status mysql

# Test API
curl http://localhost:5000/api/health
curl https://your-domain.com/api/health
```

## 🔧 Common Commands

### PM2 Commands
```bash
pm2 list                    # List all processes
pm2 logs bem-backend        # View logs
pm2 restart bem-backend     # Restart app
pm2 stop bem-backend        # Stop app
pm2 delete bem-backend      # Remove from PM2
pm2 monit                   # Monitor resources
```

### Nginx Commands
```bash
sudo nginx -t               # Test configuration
sudo systemctl reload nginx # Reload config
sudo systemctl restart nginx # Restart Nginx
sudo tail -f /var/log/nginx/error.log # View error log
```

### MySQL Commands
```bash
mysql -u bem_user -p bem_isi_yogyakarta  # Login
sudo systemctl restart mysql              # Restart MySQL
mysqldump -u bem_user -p bem_isi_yogyakarta > backup.sql  # Backup
```

## 📝 Environment Variables Checklist

### Backend (.env)
- [ ] `NODE_ENV=production`
- [ ] `PORT=5000`
- [ ] `DB_HOST=localhost`
- [ ] `DB_USER=bem_user`
- [ ] `DB_PASSWORD=strong_password`
- [ ] `DB_NAME=bem_isi_yogyakarta`
- [ ] `JWT_SECRET=strong_random_string_32+_chars`
- [ ] `JWT_EXPIRES_IN=7d`
- [ ] `UPLOAD_PATH=./uploads`

### Frontend (.env)
- [ ] `VITE_API_URL=https://your-domain.com/api`

## 🔐 Security Checklist

- [ ] SSL/HTTPS aktif
- [ ] JWT_SECRET kuat dan unik
- [ ] Database password kuat
- [ ] Firewall dikonfigurasi (UFW)
- [ ] Admin password diubah
- [ ] File `.env` tidak di-commit
- [ ] File permissions benar (755 untuk folders, 644 untuk files)
- [ ] Regular updates: `sudo apt update && sudo apt upgrade`

## 📊 Monitoring

```bash
# Disk space
df -h

# Memory usage
free -h

# CPU usage
top
# atau
htop

# PM2 monitoring
pm2 monit

# Nginx access logs
sudo tail -f /var/log/nginx/bem-fsrd-access.log
```

## 🔄 Backup

```bash
# Database backup
mysqldump -u bem_user -p bem_isi_yogyakarta > backup_$(date +%Y%m%d).sql

# Uploads backup
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz /var/www/bem-fsrd-website/backend/uploads

# Automated backup (add to crontab)
0 2 * * * mysqldump -u bem_user -p'password' bem_isi_yogyakarta > /backup/db_$(date +\%Y\%m\%d).sql
```

## 🐛 Troubleshooting Quick Fixes

```bash
# Backend tidak berjalan
pm2 logs bem-backend
pm2 restart bem-backend

# Port already in use
sudo lsof -i :5000
sudo kill -9 <PID>

# Nginx error
sudo nginx -t
sudo tail -f /var/log/nginx/error.log

# Permission denied
sudo chown -R www-data:www-data /var/www/bem-fsrd
sudo chmod -R 755 /var/www/bem-fsrd

# Database connection failed
sudo systemctl status mysql
mysql -u bem_user -p bem_isi_yogyakarta
```

## 📚 Full Documentation

Untuk panduan lengkap, lihat:
- [DEPLOY.md](./DEPLOY.md) - Panduan deployment lengkap
- [README.md](./README.md) - Dokumentasi utama
- [INSTALL.md](./INSTALL.md) - Quick start guide

---

**Selamat Deploy! 🚀**

