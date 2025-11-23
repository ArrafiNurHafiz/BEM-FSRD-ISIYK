# 🚀 Quick Fix: GitHub Pages Deployment

Panduan cepat untuk deploy website ke GitHub Pages.

## ❌ Masalah

GitHub Pages hanya menampilkan README.md karena:
- Workflow file belum ter-push (perlu scope `workflow`)
- Build files belum ada di GitHub Pages

## ✅ Solusi Cepat

### Langkah 1: Tambahkan SSH Key ke GitHub

**SSH Public Key yang sudah di-generate:**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIHZzzAkC1Ml3jyyXAnG4xvs9S4pCPn48LOE1jS80CQH8 github-pages-setup
```

**Cara menambahkan:**
1. Buka: https://github.com/settings/keys
2. Klik **"New SSH key"**
3. **Title**: `BEM-FSRD-ISIYK-Deploy`
4. **Key**: Paste public key di atas
5. Klik **"Add SSH key"**

### Langkah 2: Jalankan Script Setup

```bash
cd /home/arrafinur/gabut
./setup-ssh-and-push.sh
```

Script akan:
- Setup SSH config
- Test SSH connection
- Update remote URL ke SSH
- Push workflow file

### Langkah 3: Enable GitHub Pages

1. Buka: https://github.com/ArrafiNurHafiz/BEM-FSRD-ISIYK/settings/pages
2. **Source**: Pilih **"GitHub Actions"**
3. Klik **"Save"**

### Langkah 4: Tunggu Deployment

1. Buka tab **Actions**: https://github.com/ArrafiNurHafiz/BEM-FSRD-ISIYK/actions
2. Tunggu workflow **"Deploy to GitHub Pages"** selesai (2-3 menit)
3. Website akan tersedia di: https://arrafinurhafiz.github.io/BEM-FSRD-ISIYK/

## 🔧 Manual Setup (Jika Script Tidak Bisa)

### 1. Setup SSH Config

```bash
nano ~/.ssh/config
```

Tambahkan:
```
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_github
    IdentitiesOnly yes
```

### 2. Test SSH

```bash
ssh -T git@github.com
```

Should show: `Hi ArrafiNurHafiz! You've successfully authenticated...`

### 3. Update Remote

```bash
cd /home/arrafinur/gabut
git remote set-url origin git@github.com:ArrafiNurHafiz/BEM-FSRD-ISIYK.git
```

### 4. Push

```bash
git push
```

## ⚠️ Important Notes

1. **Backend API**: Pastikan backend sudah di-deploy dan accessible
   - Set `VITE_API_URL` di Repository Secrets jika diperlukan
   - Settings → Secrets and variables → Actions → New secret

2. **Base Path**: Website akan diakses dengan path `/BEM-FSRD-ISIYK/`

3. **First Deploy**: Mungkin butuh 2-3 menit untuk first deployment

## 🐛 Troubleshooting

### SSH key tidak bekerja

- Pastikan SSH key sudah di-add ke GitHub
- Check permissions: `chmod 600 ~/.ssh/id_ed25519_github`
- Test: `ssh -T git@github.com`

### Workflow tidak jalan

- Check tab Actions untuk error messages
- Pastikan GitHub Pages source sudah di-set ke "GitHub Actions"
- Re-run workflow jika perlu

### Website masih menampilkan README

- Clear browser cache (Ctrl+Shift+R)
- Tunggu beberapa menit (GitHub Pages butuh waktu untuk update)
- Check Actions tab apakah workflow sudah selesai

---

**Selamat! Setelah selesai, website akan tersedia di GitHub Pages! 🎉**

