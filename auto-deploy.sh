#!/bin/bash

# Automated Deployment Script untuk BEM FSRD ISI Yogyakarta
# Script ini akan memandu Anda deploy ke Railway

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  🚀 Auto Deploy - BEM FSRD ISI Yogyakarta Website      ║"
echo "║  Deployment ke Railway (Hosting Gratis)                 ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Step 1: Check prerequisites
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}STEP 1: Checking Prerequisites${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js ditemukan: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js tidak ditemukan!${NC}"
    echo "   Install Node.js terlebih dahulu: https://nodejs.org/"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm ditemukan: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm tidak ditemukan!${NC}"
    exit 1
fi

# Check git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version | cut -d' ' -f3)
    echo -e "${GREEN}✅ Git ditemukan: $GIT_VERSION${NC}"
else
    echo -e "${RED}❌ Git tidak ditemukan!${NC}"
    exit 1
fi

# Check if Railway CLI is installed
if command -v railway &> /dev/null; then
    echo -e "${GREEN}✅ Railway CLI ditemukan${NC}"
    RAILWAY_INSTALLED=true
else
    echo -e "${YELLOW}⚠️  Railway CLI belum terinstall${NC}"
    RAILWAY_INSTALLED=false
fi

echo ""

# Step 2: Install Railway CLI if needed
if [ "$RAILWAY_INSTALLED" = false ]; then
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}STEP 2: Installing Railway CLI${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    read -p "Apakah Anda ingin menginstall Railway CLI sekarang? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Installing Railway CLI..."
        npm install -g @railway/cli
        echo -e "${GREEN}✅ Railway CLI berhasil diinstall${NC}"
    else
        echo -e "${RED}❌ Railway CLI diperlukan untuk deployment${NC}"
        exit 1
    fi
    echo ""
fi

# Step 3: Check Railway login
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}STEP 3: Railway Authentication${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if railway whoami &> /dev/null; then
    USER_EMAIL=$(railway whoami 2>/dev/null | grep -o '[a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]*\.[a-zA-Z]*' | head -1)
    echo -e "${GREEN}✅ Sudah login ke Railway sebagai: ${USER_EMAIL}${NC}"
else
    echo -e "${YELLOW}⚠️  Belum login ke Railway${NC}"
    echo ""
    echo "Untuk login ke Railway:"
    echo "  1. Browser akan otomatis terbuka"
    echo "  2. Login dengan GitHub account Anda"
    echo "  3. Authorize Railway untuk akses GitHub"
    echo ""
    read -p "Apakah Anda ingin login sekarang? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Membuka Railway login..."
        railway login
        if railway whoami &> /dev/null; then
            echo -e "${GREEN}✅ Login berhasil!${NC}"
        else
            echo -e "${RED}❌ Login gagal. Silakan coba lagi.${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ Login diperlukan untuk deployment${NC}"
        echo ""
        echo "Untuk login manual, jalankan: railway login"
        exit 1
    fi
fi

echo ""

# Step 4: Check if project is linked
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}STEP 4: Railway Project Setup${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ -f ".railway/service.toml" ] || railway status &> /dev/null; then
    echo -e "${GREEN}✅ Project sudah ter-link ke Railway${NC}"
    railway status
    PROJECT_LINKED=true
else
    echo -e "${YELLOW}⚠️  Project belum ter-link ke Railway${NC}"
    PROJECT_LINKED=false
fi

echo ""

if [ "$PROJECT_LINKED" = false ]; then
    echo "Untuk setup Railway project, Anda punya 2 opsi:"
    echo ""
    echo -e "${BLUE}Opsi 1: Via Railway Dashboard (Recommended - Paling Mudah)${NC}"
    echo "  1. Buka: https://railway.app/dashboard"
    echo "  2. Klik 'New Project' → 'Deploy from GitHub repo'"
    echo "  3. Pilih repo: ArrafiNurHafiz/BEM-FSRD-ISIYK"
    echo "  4. Railway akan auto-detect project"
    echo ""
    echo -e "${BLUE}Opsi 2: Via Railway CLI${NC}"
    echo "  1. Jalankan: railway init"
    echo "  2. Pilih: Deploy from GitHub repo"
    echo "  3. Pilih repo yang sudah ada atau buat baru"
    echo ""
    
    read -p "Pilih opsi (1/2) atau tekan Enter untuk skip: " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[1]$ ]]; then
        echo ""
        echo "Silakan buka Railway Dashboard dan ikuti langkah-langkah di atas."
        echo "Setelah project dibuat, tekan Enter untuk melanjutkan..."
        read
    elif [[ $REPLY =~ ^[2]$ ]]; then
        echo "Creating Railway project via CLI..."
        railway init
    fi
fi

echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}STEP 5: Generate Configuration Files${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "BEM_FSRD_ISI_YOGYAKARTA_2025_SECRET_KEY_MIN_32_CHARS_CHANGE_THIS_IN_PRODUCTION")

echo "Generated JWT Secret: $JWT_SECRET"
echo ""

# Create environment variables template
echo "Membuat file template environment variables..."

# Backend env template
cat > backend/.env.railway << EOF
# Railway Production Environment Variables
# Copy values ini ke Railway Dashboard → Backend Service → Variables

NODE_ENV=production
PORT=10000

# Database (akan di-set otomatis oleh Railway jika menggunakan MySQL service reference)
# Gunakan format: \${{MySQL.MYSQLHOST}} untuk reference ke MySQL service
DB_HOST=\${{MySQL.MYSQLHOST}}
DB_PORT=\${{MySQL.MYSQLPORT}}
DB_USER=\${{MySQL.MYSQLUSER}}
DB_PASSWORD=\${{MySQL.MYSQLPASSWORD}}
DB_NAME=\${{MySQL.MYSQLDATABASE}}

# JWT Configuration
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=7d

# Upload Configuration
UPLOAD_PATH=./uploads

# Frontend URL (akan di-update setelah frontend deploy)
FRONTEND_URL=https://your-frontend-url.railway.app
EOF

# Frontend env template
cat > frontend/.env.railway << EOF
# Railway Production Environment Variables
# Copy values ini ke Railway Dashboard → Frontend Service → Variables

VITE_API_URL=https://your-backend-url.railway.app/api
NODE_ENV=production
GITHUB_PAGES=false
EOF

echo -e "${GREEN}✅ File template created:${NC}"
echo "   - backend/.env.railway"
echo "   - frontend/.env.railway"
echo ""

echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}STEP 6: Deployment Instructions${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${BLUE}Langkah-langkah deployment di Railway Dashboard:${NC}"
echo ""
echo "1️⃣  CREATE MYSQL DATABASE:"
echo "   - Railway Dashboard → Your Project → 'New +' → 'Database' → 'Add MySQL'"
echo "   - Tunggu sampai database ready"
echo "   - Klik database → 'Variables' tab → SIMPAN semua credentials"
echo ""
echo "2️⃣  CREATE BACKEND SERVICE:"
echo "   - Railway Dashboard → Your Project → 'New +' → 'GitHub Repo'"
echo "   - Pilih repo: ArrafiNurHafiz/BEM-FSRD-ISIYK"
echo "   - Settings:"
echo "     • Root Directory: backend"
echo "     • Start Command: npm start"
echo "     • Build Command: npm install"
echo "   - Variables tab: Copy semua dari backend/.env.railway"
echo "   - Networking: Generate Domain → SIMPAN URL backend"
echo ""
echo "3️⃣  CREATE FRONTEND SERVICE:"
echo "   - Railway Dashboard → Your Project → 'New +' → 'GitHub Repo'"
echo "   - Pilih repo: ArrafiNurHafiz/BEM-FSRD-ISIYK"
echo "   - Settings:"
echo "     • Root Directory: frontend"
echo "     • Build Command: npm install && npm run build"
echo "     • Start Command: npx serve dist -s -l \$PORT"
echo "   - Variables tab: Copy dari frontend/.env.railway"
echo "     • Update VITE_API_URL dengan URL backend dari step 2"
echo "   - Networking: Generate Domain → SIMPAN URL frontend"
echo ""
echo "4️⃣  UPDATE BACKEND CORS:"
echo "   - Backend Service → Variables → Add:"
echo "     FRONTEND_URL=[URL_FRONTEND_DARI_STEP_3]"
echo "   - Redeploy backend"
echo ""
echo "5️⃣  SETUP DATABASE:"
echo "   - Connect ke MySQL database (via Railway terminal atau MySQL client)"
echo "   - Import schema: backend/database/schema.sql"
echo "   - Create admin user (optional):"
echo "     cd backend && npm run create-admin"
echo ""
echo "6️⃣  TEST:"
echo "   - Backend: https://[BACKEND_URL]/api/health"
echo "   - Frontend: https://[FRONTEND_URL]"
echo "   - Admin: https://[FRONTEND_URL]/admin/login"
echo ""

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "📚 Dokumentasi lengkap:"
echo "   - QUICK_DEPLOY.md (10 menit setup)"
echo "   - RAILWAY_DEPLOY.md (panduan lengkap)"
echo "   - DEPLOY_CHECKLIST.md (checklist lengkap)"
echo ""
echo "🚀 Next steps: Ikuti langkah-langkah di atas di Railway Dashboard"
echo ""
echo -e "${YELLOW}Tips:${NC}"
echo "   • Buka Railway Dashboard: https://railway.app/dashboard"
echo "   • Semua file template sudah dibuat:"
echo "     - backend/.env.railway"
echo "     - frontend/.env.railway"
echo "   • Copy values dari file-file tersebut ke Railway Dashboard"
echo ""

