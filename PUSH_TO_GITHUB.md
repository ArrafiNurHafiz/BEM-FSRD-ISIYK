# 📤 Cara Push ke GitHub

Repository Git sudah di-setup dan initial commit sudah dibuat! 

## ✅ Langkah yang Sudah Dilakukan

1. ✅ Git repository initialized
2. ✅ Branch renamed ke `main`
3. ✅ Semua files ditambahkan ke staging
4. ✅ Initial commit sudah dibuat

## 🚀 Langkah Selanjutnya untuk Push ke GitHub

### 1. Buat Repository di GitHub

**Via Website:**
1. Login ke GitHub: https://github.com
2. Klik **"+"** → **"New repository"**
3. Isi:
   - **Repository name**: `bem-fsrd-isi-website` (atau nama lain)
   - **Description**: Website BEM FSRD ISI Yogyakarta
   - **Visibility**: Public atau Private
   - **JANGAN** centang "Add a README file"
   - **JANGAN** centang "Add .gitignore"
   - **JANGAN** centang "Choose a license"
4. Klik **"Create repository"**

### 2. Add Remote Repository

Setelah repository dibuat di GitHub, jalankan command berikut (ganti `YOUR_USERNAME` dan `REPOSITORY_NAME`):

```bash
cd /home/arrafinur/gabut

# Add remote (HTTPS - Recommended untuk pertama kali)
git remote add origin https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git

# Atau jika sudah setup SSH key (Recommended untuk keamanan)
# git remote add origin git@github.com:YOUR_USERNAME/REPOSITORY_NAME.git

# Verify remote
git remote -v
```

### 3. Push ke GitHub

```bash
# Push ke GitHub
git push -u origin main
```

**Jika menggunakan HTTPS:**
- Akan diminta **username** dan **password**
- Untuk password, gunakan **Personal Access Token** (bukan password GitHub)

**Cara membuat Personal Access Token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Select scopes: `repo` (full control)
4. Copy token (hanya muncul sekali!)

**Jika menggunakan SSH:**
- Pastikan SSH key sudah di-setup di GitHub
- Tidak perlu password

### 4. Verify Upload

Buka repository di browser:
```
https://github.com/YOUR_USERNAME/REPOSITORY_NAME
```

Pastikan semua files sudah ter-upload!

## 🔐 Setup SSH Key (Recommended)

Untuk keamanan yang lebih baik, gunakan SSH:

### 1. Generate SSH Key

```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
# Tekan Enter untuk default location
# Atau set passphrase (optional)
```

### 2. Copy Public Key

```bash
cat ~/.ssh/id_ed25519.pub
# Copy output
```

### 3. Add ke GitHub

1. GitHub → Settings → SSH and GPG keys → New SSH key
2. Paste public key
3. Save

### 4. Test Connection

```bash
ssh -T git@github.com
# Should show: "Hi YOUR_USERNAME! You've successfully authenticated..."
```

### 5. Update Remote URL

```bash
git remote set-url origin git@github.com:YOUR_USERNAME/REPOSITORY_NAME.git
```

### 6. Push dengan SSH

```bash
git push -u origin main
# Tidak perlu password!
```

## 📝 Command Summary

```bash
# 1. Add remote repository (ganti URL dengan repository Anda)
git remote add origin https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git

# 2. Verify remote
git remote -v

# 3. Push ke GitHub
git push -u origin main
```

## 🔄 Update Repository (Setelah Initial Push)

Untuk update repository di masa depan:

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

## ⚠️ Troubleshooting

### Error: "remote origin already exists"

```bash
# Remove existing remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git
```

### Error: "Authentication failed"

- Pastikan username benar
- Gunakan Personal Access Token (bukan password)
- Atau setup SSH key

### Error: "Permission denied"

- Pastikan repository name benar
- Pastikan Anda punya akses ke repository
- Check repository visibility

### Error: "failed to push some refs"

Jika repository di GitHub sudah punya files:

```bash
# Pull changes terlebih dahulu
git pull origin main --allow-unrelated-histories

# Resolve conflicts (jika ada)
# Then push
git push -u origin main
```

## 📚 Dokumentasi Lengkap

Lihat [GITHUB_SETUP.md](./GITHUB_SETUP.md) untuk panduan lengkap.

---

**Selamat! Siap untuk push ke GitHub! 🚀**

