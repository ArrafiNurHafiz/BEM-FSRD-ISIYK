# 🔧 Konfigurasi Environment Variables

File ini berisi contoh konfigurasi untuk file `.env` yang perlu dibuat.

## Backend (.env)

Buat file `backend/.env` dengan isi berikut:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bem_isi_yogyakarta

# JWT Configuration
# IMPORTANT: Generate a secure random string (minimum 32 characters)
# You can use: openssl rand -base64 32
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRES_IN=7d

# Upload Configuration
UPLOAD_PATH=./uploads

# Email Configuration (Optional - for newsletter feature)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### Cara Generate JWT_SECRET

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Windows (PowerShell):**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

**Online Generator:**
- https://www.random.org/strings/
- Generate string dengan panjang minimal 32 karakter

### Contoh JWT_SECRET yang Valid:
```
BEM_FSRD_ISI_YOGYAKARTA_2025_SECRET_KEY_CHANGE_THIS_IN_PRODUCTION_XYZ123
```

---

## Frontend (.env)

Buat file `frontend/.env` dengan isi berikut:

```env
# Backend API URL
# For development
VITE_API_URL=http://localhost:5000/api

# For production (uncomment and update when deploying)
# VITE_API_URL=https://your-domain.com/api
```

---

## 📝 Checklist Setup

Setelah membuat file `.env`, pastikan:

- [ ] File `backend/.env` sudah dibuat
- [ ] `DB_PASSWORD` sudah diisi dengan password MySQL Anda
- [ ] `JWT_SECRET` sudah diisi dengan string minimal 32 karakter
- [ ] File `frontend/.env` sudah dibuat
- [ ] `VITE_API_URL` sesuai dengan port backend (default: 5000)

---

## ⚠️ PENTING

1. **Jangan commit file `.env` ke Git!**
   - File `.env` sudah ada di `.gitignore`
   - Jangan pernah share file `.env` yang berisi kredensial

2. **Untuk Production:**
   - Ganti `NODE_ENV=production`
   - Gunakan JWT_SECRET yang berbeda dan lebih kuat
   - Update `VITE_API_URL` dengan domain production
   - Setup HTTPS untuk keamanan

3. **Security:**
   - JWT_SECRET harus unik dan tidak bisa ditebak
   - Jangan gunakan JWT_SECRET yang sama untuk development dan production
   - Simpan file `.env` dengan permission yang tepat (chmod 600)

---

## 🔍 Verifikasi Konfigurasi

Setelah setup, test dengan:

**Backend:**
```bash
cd backend
npm start
```

Jika berhasil, Anda akan melihat:
```
✅ Database connected successfully
🚀 Server running on port 5000
🔐 JWT Secret: ✅ Set
```

**Frontend:**
```bash
cd frontend
npm run dev
```

Buka browser dan cek console (F12) untuk memastikan tidak ada error koneksi ke API.

