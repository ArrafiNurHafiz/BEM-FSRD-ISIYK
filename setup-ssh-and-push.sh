#!/bin/bash

# Script untuk Setup SSH dan Push Workflow File
# Website: BEM FSRD ISI Yogyakarta

echo "🔑 Setting up SSH Key untuk GitHub..."

# 1. Display public key
echo ""
echo "📋 PUBLIC SSH KEY (Copy ini):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cat ~/.ssh/id_ed25519_github.pub
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 2. Create SSH config
echo "⚙️  Setting up SSH config..."
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Check if config exists
if [ ! -f ~/.ssh/config ]; then
    touch ~/.ssh/config
    chmod 600 ~/.ssh/config
fi

# Add GitHub host config
if ! grep -q "Host github.com" ~/.ssh/config; then
    echo "" >> ~/.ssh/config
    echo "Host github.com" >> ~/.ssh/config
    echo "    HostName github.com" >> ~/.ssh/config
    echo "    User git" >> ~/.ssh/config
    echo "    IdentityFile ~/.ssh/id_ed25519_github" >> ~/.ssh/config
    echo "    IdentitiesOnly yes" >> ~/.ssh/config
    echo "✅ SSH config created"
else
    echo "✅ SSH config already exists"
fi

# 3. Set correct permissions
chmod 600 ~/.ssh/id_ed25519_github
chmod 644 ~/.ssh/id_ed25519_github.pub

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 LANGKAH SELANJUTNYA:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Copy public key di atas"
echo "2. Buka: https://github.com/settings/keys"
echo "3. Klik 'New SSH key'"
echo "4. Title: BEM-FSRD-ISIYK-Deploy"
echo "5. Paste public key"
echo "6. Klik 'Add SSH key'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "Sudah menambahkan SSH key ke GitHub? (y/n): " answer

if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
    echo ""
    echo "🔍 Testing SSH connection..."
    ssh -T git@github.com
    
    echo ""
    echo "🔄 Updating remote URL ke SSH..."
    cd /home/arrafinur/gabut
    git remote set-url origin git@github.com:ArrafiNurHafiz/BEM-FSRD-ISIYK.git
    
    echo ""
    echo "📤 Pushing workflow file..."
    git push
    
    echo ""
    echo "✅ Selesai! Workflow file sudah di-push."
    echo "📋 Next steps:"
    echo "   1. Buka: https://github.com/ArrafiNurHafiz/BEM-FSRD-ISIYK/settings/pages"
    echo "   2. Source: GitHub Actions"
    echo "   3. Save"
    echo "   4. Tunggu workflow selesai di tab Actions"
else
    echo ""
    echo "⏸️  Silakan tambahkan SSH key ke GitHub terlebih dahulu."
    echo "   Jalankan script ini lagi setelah menambahkan SSH key."
fi

