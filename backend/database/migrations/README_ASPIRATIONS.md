# Aspirations Table Migration

Jika terjadi error saat mengirim aspirasi, kemungkinan tabel `aspirations` belum dibuat di database.

## Cara Membuat Tabel

### Opsi 1: Menggunakan MySQL Command Line

```bash
mysql -u root -p bem_isi_yogyakarta < backend/database/migrations/create_aspirations_table.sql
```

### Opsi 2: Menggunakan MySQL Client

1. Masuk ke MySQL:
```bash
mysql -u root -p
```

2. Pilih database:
```sql
USE bem_isi_yogyakarta;
```

3. Jalankan query:
```sql
CREATE TABLE IF NOT EXISTS aspirations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100),
    message TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT TRUE,
    status ENUM('unread', 'read', 'addressed') DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created (created_at),
    INDEX idx_anonymous (is_anonymous)
);
```

4. Verifikasi tabel dibuat:
```sql
SHOW TABLES LIKE 'aspirations';
DESCRIBE aspirations;
```

### Opsi 3: Menggunakan phpMyAdmin atau Adminer

1. Buka phpMyAdmin/Adminer
2. Pilih database `bem_isi_yogyakarta`
3. Buka tab SQL
4. Paste dan jalankan query dari file `create_aspirations_table.sql`

## Verifikasi

Setelah tabel dibuat, pastikan backend server berjalan dan coba kirim aspirasi lagi dari halaman Kontak.

