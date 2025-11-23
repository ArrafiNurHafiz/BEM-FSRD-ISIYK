# 🔐 Authentication untuk Push ke GitHub

Push ke GitHub memerlukan authentication. Berikut cara melakukan authentication:

## ✅ Remote Sudah Ditambahkan

Remote repository sudah berhasil ditambahkan:
```
origin  https://github.com/ArrafiNurHafiz/BEM-FSRD-ISIYK.git
```

## 🔑 Opsi Authentication

### Opsi 1: Personal Access Token (HTTPS) - Recommended

**Cara:**
1. **Buat Personal Access Token**:
   - Buka: https://github.com/settings/tokens
   - Klik **"Generate new token"** → **"Generate new token (classic)"**
   - **Note**: `BEM-FSRD-ISIYK`
   - **Expiration**: Pilih (90 days, 1 year, atau no expiration)
   - **Select scopes**: Centang **`repo`** (full control)
   - Klik **"Generate token"**
   - **COPY TOKEN** (hanya muncul sekali!)

2. **Push dengan Token**:
   ```bash
   git push -u origin main
   ```
   
   Saat diminta:
   - **Username**: `ArrafiNurHafiz`
   - **Password**: `PASTE_PERSONAL_ACCESS_TOKEN_DI_SINI` (bukan password GitHub!)

3. **Simpan Credentials** (opsional):
   ```bash
   git config --global credential.helper store
   ```
   
   Setelah push pertama, credentials akan tersimpan.

### Opsi 2: SSH Key (Lebih Aman)

**Cara:**

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
   - Buka: https://github.com/settings/keys
   - Klik **"New SSH key"**
   - **Title**: `BEM-FSRD-ISIYK`
   - **Key**: Paste public key
   - Klik **"Add SSH key"**

4. **Test SSH Connection**:
   ```bash
   ssh -T git@github.com
   # Should show: "Hi ArrafiNurHafiz! You've successfully authenticated..."
   ```

5. **Update Remote URL ke SSH**:
   ```bash
   git remote set-url origin git@github.com:ArrafiNurHafiz/BEM-FSRD-ISIYK.git
   ```

6. **Push dengan SSH**:
   ```bash
   git push -u origin main
   # Tidak perlu password!
   ```

### Opsi 3: GitHub CLI

**Cara:**

1. **Install GitHub CLI** (jika belum ada):
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
   sudo apt update && sudo apt install gh
   ```

2. **Login ke GitHub**:
   ```bash
   gh auth login
   # Follow instructions
   ```

3. **Push**:
   ```bash
   git push -u origin main
   ```

## 🚀 Quick Push (Setelah Authentication)

Setelah authentication setup, push:

```bash
cd /home/arrafinur/gabut
git push -u origin main
```

## 🔍 Check Status

```bash
# Check remote
git remote -v

# Check branch
git branch

# Check status
git status
```

## ⚠️ Troubleshooting

### Error: "Authentication failed"

**Untuk HTTPS:**
- Pastikan menggunakan **Personal Access Token** (bukan password)
- Pastikan token punya scope `repo`
- Token mungkin expired, buat token baru

**Untuk SSH:**
- Pastikan SSH key sudah di-add ke GitHub
- Test connection: `ssh -T git@github.com`
- Pastikan remote URL menggunakan SSH format

### Error: "Permission denied"

- Pastikan repository name benar: `BEM-FSRD-ISIYK`
- Pastikan username benar: `ArrafiNurHafiz`
- Pastikan Anda punya akses ke repository

### Error: "Repository not found"

- Pastikan repository sudah dibuat di GitHub
- Check URL: https://github.com/ArrafiNurHafiz/BEM-FSRD-ISIYK
- Pastikan visibility (public/private) sesuai

## 📝 Tips

1. **Personal Access Token**: Lebih mudah untuk pertama kali
2. **SSH Key**: Lebih aman untuk jangka panjang
3. **Credential Helper**: Simpan credentials agar tidak perlu input setiap kali
4. **Token Expiration**: Set expiration sesuai kebutuhan (90 days recommended)

---

**Setelah authentication berhasil, jalankan:**
```bash
git push -u origin main
```

**Repository akan tersedia di:**
https://github.com/ArrafiNurHafiz/BEM-FSRD-ISIYK

