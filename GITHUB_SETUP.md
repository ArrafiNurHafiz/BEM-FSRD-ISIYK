# 📤 Panduan Upload ke GitHub

Panduan lengkap untuk mengunggah project Website BEM FSRD ISI Yogyakarta ke GitHub.

## 📋 Prerequisites

1. **Git** sudah terinstall
   ```bash
   git --version
   ```

2. **GitHub Account** sudah dibuat
   - Daftar di: https://github.com

3. **GitHub Repository** sudah dibuat (opsional, bisa dibuat via command line)

## 🚀 Langkah-Langkah

### 1. Initialize Git Repository

```bash
cd /home/arrafinur/gabut

# Initialize git repository
git init

# Set default branch name (jika belum di-set global)
git config --global init.defaultBranch main
```

### 2. Configure Git (Jika belum)

```bash
# Set your name and email (jika belum di-set)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. Add Files ke Staging

```bash
# Check files yang akan di-commit
git status

# Add semua files (kecuali yang di .gitignore)
git add .

# Atau add specific files
git add README.md
git add frontend/
git add backend/
```

### 4. Initial Commit

```bash
# Buat initial commit
git commit -m "Initial commit: BEM FSRD ISI Yogyakarta Website"

# Atau dengan message yang lebih detail
git commit -m "Initial commit: BEM FSRD ISI Yogyakarta Website

- Complete website with frontend (React) and backend (Node.js/Express)
- Admin panel for content management
- Features: News, Programs, Events, Gallery, Aspirations
- Production ready with PM2, Nginx configuration
- Full documentation included"
```

### 5. Buat Repository di GitHub

**Opsi A: Via GitHub Website**

1. Login ke GitHub: https://github.com
2. Klik **"New"** atau **"+"** → **"New repository"**
3. Isi:
   - **Repository name**: `bem-fsrd-isi-website` (atau nama lain)
   - **Description**: Website BEM FSRD ISI Yogyakarta
   - **Visibility**: Public atau Private
   - **JANGAN** centang "Add a README file" (sudah ada)
   - **JANGAN** centang "Add .gitignore" (sudah ada)
   - **JANGAN** centang "Choose a license" (jika sudah ada LICENSE file)
4. Klik **"Create repository"**

**Opsi B: Via GitHub CLI** (jika terinstall)

```bash
# Install GitHub CLI terlebih dahulu jika belum
# Ubuntu/Debian:
# curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
# echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
# sudo apt update && sudo apt install gh

# Login ke GitHub
gh auth login

# Create repository
gh repo create bem-fsrd-isi-website --public --description "Website BEM FSRD ISI Yogyakarta" --source=. --remote=origin --push
```

### 6. Add Remote Repository

```bash
# Add remote repository
# Ganti YOUR_USERNAME dan REPOSITORY_NAME dengan yang sesuai
git remote add origin https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git

# Atau menggunakan SSH (jika sudah setup SSH key)
# git remote add origin git@github.com:YOUR_USERNAME/REPOSITORY_NAME.git

# Verify remote
git remote -v
```

### 7. Push ke GitHub

```bash
# Push ke GitHub
git push -u origin main

# Atau jika branch name berbeda (master, main, dll)
# git branch -M main  # Rename branch ke main
# git push -u origin main
```

**Jika perlu authentication:**
- **HTTPS**: Akan diminta username dan password (atau Personal Access Token)
- **SSH**: Pastikan SSH key sudah di-setup di GitHub

### 8. Verify Upload

1. Buka repository di browser: `https://github.com/YOUR_USERNAME/REPOSITORY_NAME`
2. Pastikan semua files sudah ter-upload
3. Pastikan `.gitignore` bekerja (tidak ada node_modules, .env, dll)

## 🔐 Authentication

### Personal Access Token (HTTPS)

Jika menggunakan HTTPS, GitHub tidak lagi menerima password. Gunakan Personal Access Token:

1. **Buat Token**:
   - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token (classic)
   - Select scopes: `repo` (full control)
   - Copy token (hanya muncul sekali!)

2. **Gunakan Token**:
   ```bash
   # Saat push, gunakan token sebagai password
   git push -u origin main
   # Username: YOUR_USERNAME
   # Password: YOUR_PERSONAL_ACCESS_TOKEN
   ```

3. **Atau simpan credentials**:
   ```bash
   git config --global credential.helper store
   # Next push akan menyimpan credentials
   ```

### SSH Key (Recommended)

1. **Generate SSH Key** (jika belum ada):
   ```bash
   ssh-keygen -t ed25519 -C "your.email@example.com"
   # Tekan Enter untuk default location
   # Atau set passphrase (optional)
   ```

2. **Copy Public Key**:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   # Copy output
   ```

3. **Add ke GitHub**:
   - GitHub → Settings → SSH and GPG keys → New SSH key
   - Paste public key
   - Save

4. **Test Connection**:
   ```bash
   ssh -T git@github.com
   # Should show: "Hi YOUR_USERNAME! You've successfully authenticated..."
   ```

5. **Update Remote URL**:
   ```bash
   git remote set-url origin git@github.com:YOUR_USERNAME/REPOSITORY_NAME.git
   ```

## 📝 Quick Commands Summary

```bash
# Initialize repository
git init

# Configure git (jika belum)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Add files
git add .

# Commit
git commit -m "Initial commit: BEM FSRD ISI Yogyakarta Website"

# Add remote (ganti URL dengan repository Anda)
git remote add origin https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git

# Push
git push -u origin main
```

## 🔄 Update Repository

Setelah initial commit, untuk update repository:

```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Update: description of changes"

# Push changes
git push
```

## ⚠️ Important Notes

### Files yang TIDAK akan di-upload (dari .gitignore):

- ✅ `node_modules/` - Dependencies (harus diinstall ulang)
- ✅ `.env` - Environment variables (sensitive data)
- ✅ `dist/` - Build files (akan di-generate ulang)
- ✅ `uploads/*` - Uploaded files (hanya struktur folder)
- ✅ `logs/` - Log files
- ✅ `.gitkeep` files akan tetap ada untuk folder structure

### Files yang AKAN di-upload:

- ✅ Source code (`frontend/src/`, `backend/`)
- ✅ Configuration files (`package.json`, `vite.config.js`, dll)
- ✅ Documentation (`README.md`, `DEPLOY.md`, dll)
- ✅ Example files (`.example` files)
- ✅ Scripts (`*.sh`, `*.bat`)

## 🐛 Troubleshooting

### Error: "remote origin already exists"

```bash
# Remove existing remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git
```

### Error: "failed to push some refs"

```bash
# Pull changes terlebih dahulu (jika ada)
git pull origin main --allow-unrelated-histories

# Atau force push (hati-hati!)
# git push -u origin main --force
```

### Error: "Authentication failed"

- Pastikan username dan password/token benar
- Atau setup SSH key (recommended)

### Error: "Permission denied"

- Pastikan repository name benar
- Pastikan Anda punya akses ke repository
- Check repository visibility (public/private)

## 📚 Additional Resources

- [GitHub Docs](https://docs.github.com)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Authentication](https://docs.github.com/en/authentication)

---

**Selamat! Project Anda sekarang sudah di GitHub! 🎉**

