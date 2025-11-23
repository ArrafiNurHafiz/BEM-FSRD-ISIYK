# Database Structure - BEM FSRD ISI Yogyakarta

## 📊 Overview

Database menggunakan MySQL dengan struktur relasional yang dirancang untuk mendukung semua fitur website.

## 🗄️ Tables

### 1. `users`
Tabel untuk menyimpan data admin dan staff.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto increment |
| username | VARCHAR(50) | Unique username |
| email | VARCHAR(100) | Unique email |
| password | VARCHAR(255) | Hashed password (bcrypt) |
| role | ENUM | 'admin', 'editor', 'staff' |
| full_name | VARCHAR(100) | Full name |
| avatar | VARCHAR(255) | Avatar image path |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Update timestamp |

### 2. `categories`
Kategori untuk news, programs, dan gallery.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| name | VARCHAR(100) | Category name |
| slug | VARCHAR(100) | URL-friendly slug |
| type | ENUM | 'news', 'program', 'gallery' |
| description | TEXT | Category description |
| created_at | TIMESTAMP | Creation timestamp |

**Default Categories:**
- Program: Seni Rupa, Musik, Tari, Teater, Media
- News: Berita, Pengumuman, Kegiatan
- Gallery: Pameran, Konser, Pertunjukan, Workshop

### 3. `news`
Tabel untuk berita dan artikel.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| title | VARCHAR(255) | News title |
| slug | VARCHAR(255) | URL-friendly slug |
| excerpt | TEXT | Short description |
| content | LONGTEXT | Full content (HTML) |
| featured_image | VARCHAR(255) | Featured image path |
| category_id | INT | Foreign key to categories |
| author_id | INT | Foreign key to users |
| status | ENUM | 'draft', 'published' |
| views | INT | View count |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Update timestamp |

### 4. `comments`
Komentar untuk berita.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| news_id | INT | Foreign key to news |
| name | VARCHAR(100) | Commenter name |
| email | VARCHAR(100) | Commenter email |
| content | TEXT | Comment content |
| status | ENUM | 'pending', 'approved', 'rejected' |
| created_at | TIMESTAMP | Creation timestamp |

### 5. `programs`
Program kerja BEM.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| title | VARCHAR(255) | Program title |
| slug | VARCHAR(255) | URL-friendly slug |
| description | TEXT | Short description |
| content | LONGTEXT | Full content (HTML) |
| category_id | INT | Foreign key to categories |
| image | VARCHAR(255) | Program image |
| start_date | DATE | Start date |
| end_date | DATE | End date |
| location | VARCHAR(255) | Location |
| status | ENUM | 'upcoming', 'ongoing', 'completed', 'cancelled' |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Update timestamp |

### 6. `events`
Kegiatan dan agenda.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| title | VARCHAR(255) | Event title |
| description | TEXT | Event description |
| start_datetime | DATETIME | Start date and time |
| end_datetime | DATETIME | End date and time |
| location | VARCHAR(255) | Event location |
| image | VARCHAR(255) | Event image |
| max_participants | INT | Maximum participants |
| status | ENUM | 'draft', 'published', 'cancelled' |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Update timestamp |

### 7. `rsvps`
RSVP untuk events.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| event_id | INT | Foreign key to events |
| name | VARCHAR(100) | Participant name |
| email | VARCHAR(100) | Participant email |
| phone | VARCHAR(20) | Phone number |
| status | ENUM | 'confirmed', 'cancelled' |
| created_at | TIMESTAMP | Creation timestamp |

**Unique Constraint:** (event_id, email)

### 8. `gallery`
Galeri foto dan karya.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| title | VARCHAR(255) | Image title |
| description | TEXT | Image description |
| image_path | VARCHAR(255) | Image file path |
| category_id | INT | Foreign key to categories |
| alt_text | VARCHAR(255) | Alt text for SEO |
| created_at | TIMESTAMP | Creation timestamp |

### 9. `newsletter_subscribers`
Subscriber newsletter.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| email | VARCHAR(100) | Unique email |
| name | VARCHAR(100) | Subscriber name |
| status | ENUM | 'active', 'unsubscribed' |
| subscribed_at | TIMESTAMP | Subscription timestamp |

### 10. `contact_messages`
Pesan dari form kontak.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| name | VARCHAR(100) | Sender name |
| email | VARCHAR(100) | Sender email |
| subject | VARCHAR(255) | Message subject |
| message | TEXT | Message content |
| status | ENUM | 'unread', 'read', 'replied' |
| created_at | TIMESTAMP | Creation timestamp |

### 11. `about_sections`
Section untuk halaman About.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| section_type | ENUM | 'history', 'vision', 'mission', 'structure' |
| title | VARCHAR(255) | Section title |
| content | LONGTEXT | Section content (HTML) |
| image | VARCHAR(255) | Section image |
| order_index | INT | Display order |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Update timestamp |

### 12. `social_media`
Link media sosial.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| platform | VARCHAR(50) | Platform name |
| url | VARCHAR(255) | Social media URL |
| icon | VARCHAR(50) | Icon name (Font Awesome) |
| order_index | INT | Display order |
| created_at | TIMESTAMP | Creation timestamp |

## 🔗 Relationships

- `news.category_id` → `categories.id`
- `news.author_id` → `users.id`
- `comments.news_id` → `news.id`
- `programs.category_id` → `categories.id`
- `gallery.category_id` → `categories.id`
- `rsvps.event_id` → `events.id`

## 📝 Indexes

Indexes telah dibuat untuk:
- `news.slug` - Untuk URL lookup
- `news.status` - Untuk filtering
- `news.created_at` - Untuk sorting
- `comments.news_id` - Untuk join
- `events.start_datetime` - Untuk calendar queries
- `gallery.category_id` - Untuk filtering

## 🔒 Security Notes

1. **Password Hashing:** Semua password di-hash menggunakan bcrypt dengan salt rounds 10
2. **SQL Injection:** Menggunakan parameterized queries
3. **XSS Protection:** Content disimpan sebagai HTML, perlu sanitization di frontend
4. **File Upload:** Validasi file type dan size di middleware

## 📊 Sample Queries

### Get published news with category
```sql
SELECT n.*, c.name as category_name 
FROM news n 
LEFT JOIN categories c ON n.category_id = c.id 
WHERE n.status = 'published' 
ORDER BY n.created_at DESC;
```

### Get upcoming events
```sql
SELECT * FROM events 
WHERE status = 'published' 
AND start_datetime >= NOW() 
ORDER BY start_datetime ASC;
```

### Get comments for news
```sql
SELECT * FROM comments 
WHERE news_id = ? AND status = 'approved' 
ORDER BY created_at DESC;
```

## 🚀 Migration

Untuk membuat database dari awal:

```bash
cd backend
npm run migrate
```

Atau manual:

```bash
mysql -u root -p bem_isi_yogyakarta < database/schema.sql
```

## 🔄 Backup & Restore

### Backup
```bash
mysqldump -u root -p bem_isi_yogyakarta > backup.sql
```

### Restore
```bash
mysql -u root -p bem_isi_yogyakarta < backup.sql
```

