#!/bin/bash

# Script untuk deploy website BEM FSRD ISI Yogyakarta ke Railway
# Script ini akan membantu setup Railway project secara otomatis

set -e  # Exit on error

echo "🚀 Railway Deployment Script untuk BEM FSRD ISI Yogyakarta"
echo "=========================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI tidak ditemukan!${NC}"
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
fi

echo -e "${GREEN}✅ Railway CLI ditemukan${NC}"

# Check if logged in
echo ""
echo "Checking Railway login status..."
if railway whoami &> /dev/null; then
    echo -e "${GREEN}✅ Sudah login ke Railway${NC}"
    railway whoami
else
    echo -e "${YELLOW}⚠️  Belum login ke Railway${NC}"
    echo ""
    echo "Untuk login ke Railway:"
    echo "1. Jalankan: railway login"
    echo "2. Browser akan terbuka untuk autentikasi"
    echo "3. Setelah login, jalankan script ini lagi"
    echo ""
    read -p "Apakah Anda ingin login sekarang? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        railway login
        echo ""
        echo -e "${GREEN}✅ Login berhasil!${NC}"
    else
        echo "Silakan login terlebih dahulu dengan: railway login"
        exit 1
    fi
fi

echo ""
echo "=========================================================="
echo "📋 Langkah-langkah Deployment:"
echo "=========================================================="
echo ""
echo "1. ✅ Railway CLI sudah terinstall"
echo "2. ✅ Login ke Railway"
echo ""
echo "Selanjutnya, ikuti langkah-langkah berikut:"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "LANGKAH 3: Create Railway Project"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Pilih salah satu:"
echo ""
echo "A. Create project baru (recommended)"
echo "   Jalankan: railway init"
echo "   Pilih: Deploy from GitHub repo"
echo "   Pilih repo: ArrafiNurHafiz/BEM-FSRD-ISIYK"
echo ""
echo "B. Link ke project yang sudah ada"
echo "   Jalankan: railway link"
echo ""
read -p "Pilih (A/B) atau tekan Enter untuk skip: " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Aa]$ ]]; then
    echo "Creating new Railway project..."
    railway init
elif [[ $REPLY =~ ^[Bb]$ ]]; then
    echo "Linking to existing project..."
    railway link
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "LANGKAH 4: Setup MySQL Database"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Untuk setup MySQL database di Railway:"
echo "1. Buka Railway Dashboard: https://railway.app/dashboard"
echo "2. Klik pada project Anda"
echo "3. Klik 'New +' → 'Database' → 'Add MySQL'"
echo "4. Tunggu sampai database ready"
echo "5. Klik pada database → 'Variables' tab"
echo "6. SIMPAN credentials berikut:"
echo "   - MYSQLHOST"
echo "   - MYSQLPORT"
echo "   - MYSQLUSER"
echo "   - MYSQLPASSWORD"
echo "   - MYSQLDATABASE"
echo "   - MYSQL_URL"
echo ""
read -p "Apakah database sudah dibuat? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Silakan buat database terlebih dahulu di Railway Dashboard"
    echo "Setelah database dibuat, jalankan script ini lagi"
    exit 0
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "LANGKAH 5: Setup Backend Service"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Untuk setup backend:"
echo "1. Di Railway Dashboard, klik 'New +' → 'GitHub Repo'"
echo "2. Pilih repo: ArrafiNurHafiz/BEM-FSRD-ISIYK"
echo "3. Settings:"
echo "   - Root Directory: backend"
echo "   - Start Command: npm start"
echo "   - Build Command: npm install"
echo ""
echo "4. Environment Variables (Variables tab):"
echo "   NODE_ENV=production"
echo "   PORT=10000"
echo "   DB_HOST=\${{MySQL.MYSQLHOST}}"
echo "   DB_PORT=\${{MySQL.MYSQLPORT}}"
echo "   DB_USER=\${{MySQL.MYSQLUSER}}"
echo "   DB_PASSWORD=\${{MySQL.MYSQLPASSWORD}}"
echo "   DB_NAME=\${{MySQL.MYSQLDATABASE}}"
echo "   JWT_SECRET=$(openssl rand -base64 32)"
echo "   JWT_EXPIRES_IN=7d"
echo "   UPLOAD_PATH=./uploads"
echo ""
echo "5. Generate domain: Settings → Networking → Generate Domain"
echo ""
read -p "Apakah backend service sudah dibuat? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Silakan setup backend service di Railway Dashboard"
    echo "Setelah backend service dibuat, jalankan script ini lagi"
    exit 0
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "LANGKAH 6: Setup Frontend Service"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Untuk setup frontend:"
echo "1. Di Railway Dashboard, klik 'New +' → 'GitHub Repo'"
echo "2. Pilih repo: ArrafiNurHafiz/BEM-FSRD-ISIYK"
echo "3. Settings:"
echo "   - Root Directory: frontend"
echo "   - Build Command: npm install && npm run build"
echo "   - Start Command: npx serve dist -s -l \$PORT"
echo ""
echo "4. Environment Variables (Variables tab):"
echo "   VITE_API_URL=[URL_BACKEND_ANDA]/api"
echo "   NODE_ENV=production"
echo "   GITHUB_PAGES=false"
echo ""
echo "   (Ganti [URL_BACKEND_ANDA] dengan URL backend dari Langkah 5)"
echo ""
echo "5. Generate domain: Settings → Networking → Generate Domain"
echo ""
read -p "Apakah frontend service sudah dibuat? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Silakan setup frontend service di Railway Dashboard"
    echo "Setelah frontend service dibuat, jalankan script ini lagi"
    exit 0
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "LANGKAH 7: Update CORS & Test"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Setelah frontend URL diketahui:"
echo "1. Update backend environment variable:"
echo "   FRONTEND_URL=[URL_FRONTEND_ANDA]"
echo "2. Redeploy backend"
echo "3. Test:"
echo "   - Backend: https://[BACKEND_URL]/api/health"
echo "   - Frontend: https://[FRONTEND_URL]"
echo ""

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Deployment Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Untuk panduan lengkap, lihat:"
echo "  - RAILWAY_DEPLOY.md"
echo "  - QUICK_DEPLOY.md"
echo "  - DEPLOY_CHECKLIST.md"
echo ""

