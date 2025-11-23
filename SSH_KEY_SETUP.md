# 🔑 Setup SSH Key untuk Push Workflow

SSH key sudah di-generate! Sekarang kita perlu menambahkannya ke GitHub.

## 📋 Langkah-Langkah

### 1. Copy Public Key

SSH public key sudah disiapkan. Jalankan command berikut untuk menampilkan:

```bash
cat ~/.ssh/id_ed25519_github.pub
```

**Atau copy dari file ini:**
Public key akan ditampilkan di terminal setelah command di atas.

### 2. Add SSH Key ke GitHub

1. **Buka**: https://github.com/settings/keys
2. Klik **"New SSH key"**
3. **Title**: `BEM-FSRD-ISIYK-Deploy`
4. **Key**: Paste public key yang sudah di-copy
5. Klik **"Add SSH key"**

### 3. Setup SSH Config

```bash
# Create atau edit SSH config
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

### 4. Test SSH Connection

```bash
ssh -T git@github.com
```

Should show: `Hi ArrafiNurHafiz! You've successfully authenticated...`

### 5. Update Remote URL

```bash
cd /home/arrafinur/gabut
git remote set-url origin git@github.com:ArrafiNurHafiz/BEM-FSRD-ISIYK.git
```

### 6. Push

```bash
git push
```

---

**Setelah SSH key di-add ke GitHub, jalankan command di atas untuk push workflow file!**

