# 🔧 Fix: Push Workflow File

GitHub CLI token tidak memiliki scope `workflow` yang diperlukan untuk push workflow files.

## ✅ Solusi

### Opsi 1: Re-authenticate GitHub CLI (Recommended)

Jalankan command berikut untuk re-authenticate dengan scope workflow:

```bash
gh auth login --hostname github.com --scopes workflow
```

Atau login ulang dengan semua scopes:

```bash
gh auth login --hostname github.com --scopes repo,workflow,write:packages
```

Setelah itu, push lagi:

```bash
git push
```

### Opsi 2: Push via Web Interface

1. Buka repository: https://github.com/ArrafiNurHafiz/BEM-FSRD-ISIYK
2. Klik **"Add file"** → **"Create new file"**
3. Path: `.github/workflows/deploy-pages.yml`
4. Copy isi file dari `.github/workflows/deploy-pages.yml`
5. Paste dan commit

### Opsi 3: Use Personal Access Token

1. Buat Personal Access Token dengan scope `workflow`:
   - https://github.com/settings/tokens
   - Generate new token (classic)
   - Scopes: `repo`, `workflow`
   - Copy token

2. Push dengan token:

```bash
git push https://YOUR_TOKEN@github.com/ArrafiNurHafiz/BEM-FSRD-ISIYK.git main
```

### Opsi 4: Setup SSH (Long-term Solution)

1. Generate SSH key (jika belum):
   ```bash
   ssh-keygen -t ed25519 -C "your.email@example.com"
   ```

2. Add ke GitHub:
   - Copy: `cat ~/.ssh/id_ed25519.pub`
   - Add di: https://github.com/settings/keys

3. Update remote:
   ```bash
   git remote set-url origin git@github.com:ArrafiNurHafiz/BEM-FSRD-ISIYK.git
   ```

4. Push:
   ```bash
   git push
   ```

## 🚀 Setelah Workflow File Ter-push

1. **Enable GitHub Pages**:
   - Settings → Pages
   - Source: **GitHub Actions**
   - Save

2. **Check Actions**:
   - Buka tab **Actions**
   - Workflow akan otomatis jalan
   - Tunggu 2-3 menit

3. **Verify Website**:
   - https://arrafinurhafiz.github.io/BEM-FSRD-ISIYK/

## 📝 Quick Fix Command

```bash
# Re-authenticate dengan workflow scope
gh auth login --hostname github.com --scopes workflow

# Push
git push
```

---

**Setelah workflow file ter-push, GitHub Pages akan otomatis deploy! 🚀**

