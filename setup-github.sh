#!/bin/bash

# Script untuk setup GitHub repository dan push project

echo "🚀 Setup GitHub Repository"
echo "=========================="
echo ""

# Cek apakah sudah di-root project
if [ ! -f "package.json" ] && [ ! -f "README.md" ]; then
    echo "❌ Error: Pastikan Anda berada di root directory project"
    exit 1
fi

# Input repository name
read -p "📦 Masukkan nama repository GitHub (contoh: BEM-FSRD-ISIYK): " REPO_NAME

if [ -z "$REPO_NAME" ]; then
    echo "❌ Error: Nama repository tidak boleh kosong"
    exit 1
fi

# Input GitHub username
read -p "👤 Masukkan username GitHub Anda: " GITHUB_USER

if [ -z "$GITHUB_USER" ]; then
    echo "❌ Error: Username GitHub tidak boleh kosong"
    exit 1
fi

# Input branch name
read -p "🌿 Masukkan nama branch (default: main): " BRANCH_NAME
BRANCH_NAME=${BRANCH_NAME:-main}

echo ""
echo "📋 Konfigurasi:"
echo "   Repository: $REPO_NAME"
echo "   Username: $GITHUB_USER"
echo "   Branch: $BRANCH_NAME"
echo ""

read -p "✅ Lanjutkan? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    echo "❌ Dibatalkan"
    exit 1
fi

# Cek apakah remote sudah ada
if git remote | grep -q "^origin$"; then
    echo "⚠️  Remote 'origin' sudah ada. Menghapus remote lama..."
    git remote remove origin
fi

# Setup remote
echo "🔗 Menambahkan remote origin..."
git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"

# Verifikasi remote
echo ""
echo "✅ Remote berhasil ditambahkan:"
git remote -v

echo ""
echo "📝 Status git:"
git status

echo ""
echo "🚀 Langkah selanjutnya:"
echo "   1. Buat repository '$REPO_NAME' di GitHub:"
echo "      https://github.com/new"
echo ""
echo "   2. Setelah repository dibuat, jalankan:"
echo "      git push -u origin $BRANCH_NAME"
echo ""
echo "   Atau jalankan script ini lagi dengan opsi 'push':"
echo "      ./setup-github.sh push"
echo ""

# Jika argumen 'push' diberikan
if [ "$1" == "push" ]; then
    echo "📤 Push ke GitHub..."
    
    # Rename branch jika perlu
    CURRENT_BRANCH=$(git branch --show-current)
    if [ "$CURRENT_BRANCH" != "$BRANCH_NAME" ]; then
        echo "🔄 Rename branch dari '$CURRENT_BRANCH' ke '$BRANCH_NAME'..."
        git branch -M "$BRANCH_NAME"
    fi
    
    git push -u origin "$BRANCH_NAME"
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Berhasil push ke GitHub!"
        echo "🌐 Repository: https://github.com/$GITHUB_USER/$REPO_NAME"
    else
        echo ""
        echo "❌ Error: Gagal push ke GitHub"
        echo "   Pastikan repository sudah dibuat di GitHub"
        exit 1
    fi
fi

