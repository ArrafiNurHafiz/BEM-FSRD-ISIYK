# Fix Database - Error 500

## 🔴 Masalah
Error 500 saat menambahkan konten karena tabel database tidak ada:
- `Table 'bem_isi_yogyakarta.events' doesn't exist`
- `Table 'bem_isi_yogyakarta.categories' doesn't exist`
- `Table 'bem_isi_yogyakarta.news' doesn't exist`

## ✅ Solusi

### 1. Buat Tabel yang Diperlukan

Jalankan script untuk membuat semua tabel:

```bash
cd backend
npm run create-tables
```

Script ini akan:
- ✅ Membuat semua tabel yang diperlukan
- ✅ Menambahkan default categories
- ✅ Menambahkan default social media links
- ✅ Membuat indexes untuk performa

### 2. Tabel yang Dibuat

- `categories` - Kategori untuk news, programs, gallery
- `news` - Berita dan artikel
- `comments` - Komentar untuk berita
- `programs` - Program kerja
- `events` - Kegiatan dan agenda
- `rsvps` - RSVP untuk events
- `gallery` - Galeri foto
- `newsletter_subscribers` - Subscriber newsletter
- `contact_messages` - Pesan dari form kontak
- `about_sections` - Section untuk halaman About
- `social_media` - Link media sosial

### 3. Verifikasi

Test API endpoints:

```bash
# Test categories
curl http://localhost:5000/api/categories?type=news

# Test events
curl http://localhost:5000/api/events

# Test news
curl http://localhost:5000/api/news
```

## 🔧 Jika Masih Error

### Periksa Database Connection

```bash
cd backend
node -e "require('./config/database').getConnection().then(() => console.log('OK')).catch(e => console.error(e))"
```

### Periksa Tabel

```bash
mysql -u root -p bem_isi_yogyakarta -e "SHOW TABLES;"
```

### Recreate Tables

```bash
cd backend
npm run create-tables
```

## 📝 Catatan

- Script `create-tables` menggunakan `CREATE TABLE IF NOT EXISTS`, jadi aman dijalankan berkali-kali
- Tabel yang sudah ada tidak akan dihapus
- Default data hanya ditambahkan jika tabel kosong

## ✅ Status

Setelah menjalankan `npm run create-tables`, semua error 500 seharusnya sudah teratasi.

