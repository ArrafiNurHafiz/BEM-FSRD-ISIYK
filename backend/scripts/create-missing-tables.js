const db = require('../config/database');
require('dotenv').config();

async function createMissingTables() {
  try {
    console.log('🔍 Memeriksa dan membuat tabel yang diperlukan...\n');

    // Categories Table
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS categories (
          id INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(100) NOT NULL,
          slug VARCHAR(100) UNIQUE NOT NULL,
          type ENUM('news', 'program', 'gallery') NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Tabel categories dibuat');

      // Insert default categories if table is empty
      const [catCount] = await db.query('SELECT COUNT(*) as count FROM categories');
      if (catCount[0].count === 0) {
        await db.query(`
          INSERT INTO categories (name, slug, type) VALUES
          ('Humas', 'humas', 'program'),
          ('PSDM', 'psdm', 'program'),
          ('Desain', 'desain', 'program'),
          ('PUPDOK', 'pupdok', 'program'),
          ('Kewirausahaan', 'kewirausahaan', 'program'),
          ('BPH', 'bph', 'program'),
          ('Berita', 'berita', 'news'),
          ('Pengumuman', 'pengumuman', 'news'),
          ('Kegiatan', 'kegiatan', 'news'),
          ('Humas', 'humas-gallery', 'gallery'),
          ('PSDM', 'psdm-gallery', 'gallery'),
          ('Desain', 'desain-gallery', 'gallery'),
          ('PUPDOK', 'pupdok-gallery', 'gallery'),
          ('Kewirausahaan', 'kewirausahaan-gallery', 'gallery'),
          ('BPH', 'bph-gallery', 'gallery')
        `);
        console.log('✅ Default categories ditambahkan');
      }
    } catch (error) {
      if (!error.message.includes('already exists')) {
        console.error('❌ Error creating categories:', error.message);
      }
    }

    // News Table
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS news (
          id INT PRIMARY KEY AUTO_INCREMENT,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          excerpt TEXT,
          content LONGTEXT NOT NULL,
          featured_image VARCHAR(255),
          category_id INT,
          author_id INT,
          status ENUM('draft', 'published') DEFAULT 'draft',
          views INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
          FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
          INDEX idx_slug (slug),
          INDEX idx_status (status),
          INDEX idx_created (created_at)
        )
      `);
      console.log('✅ Tabel news dibuat');
    } catch (error) {
      if (!error.message.includes('already exists')) {
        console.error('❌ Error creating news:', error.message);
      }
    }

    // Comments Table
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS comments (
          id INT PRIMARY KEY AUTO_INCREMENT,
          news_id INT NOT NULL,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL,
          content TEXT NOT NULL,
          status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE,
          INDEX idx_news (news_id),
          INDEX idx_status (status)
        )
      `);
      console.log('✅ Tabel comments dibuat');
    } catch (error) {
      if (!error.message.includes('already exists')) {
        console.error('❌ Error creating comments:', error.message);
      }
    }

    // Programs Table
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS programs (
          id INT PRIMARY KEY AUTO_INCREMENT,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          description TEXT,
          content LONGTEXT,
          category_id INT,
          image VARCHAR(255),
          start_date DATE,
          end_date DATE,
          location VARCHAR(255),
          status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
          INDEX idx_slug (slug),
          INDEX idx_status (status)
        )
      `);
      console.log('✅ Tabel programs dibuat');
    } catch (error) {
      if (!error.message.includes('already exists')) {
        console.error('❌ Error creating programs:', error.message);
      }
    }

    // Events Table
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS events (
          id INT PRIMARY KEY AUTO_INCREMENT,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          start_datetime DATETIME NOT NULL,
          end_datetime DATETIME,
          location VARCHAR(255),
          image VARCHAR(255),
          max_participants INT,
          status ENUM('draft', 'published', 'cancelled') DEFAULT 'draft',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_datetime (start_datetime),
          INDEX idx_status (status)
        )
      `);
      console.log('✅ Tabel events dibuat');
    } catch (error) {
      if (!error.message.includes('already exists')) {
        console.error('❌ Error creating events:', error.message);
      }
    }

    // RSVP Table
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS rsvps (
          id INT PRIMARY KEY AUTO_INCREMENT,
          event_id INT NOT NULL,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL,
          phone VARCHAR(20),
          status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
          INDEX idx_event (event_id),
          UNIQUE KEY unique_rsvp (event_id, email)
        )
      `);
      console.log('✅ Tabel rsvps dibuat');
    } catch (error) {
      if (!error.message.includes('already exists')) {
        console.error('❌ Error creating rsvps:', error.message);
      }
    }

    // Gallery Table
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS gallery (
          id INT PRIMARY KEY AUTO_INCREMENT,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          image_path VARCHAR(255) NOT NULL,
          category_id INT,
          alt_text VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
          INDEX idx_category (category_id),
          INDEX idx_created (created_at)
        )
      `);
      console.log('✅ Tabel gallery dibuat');
    } catch (error) {
      if (!error.message.includes('already exists')) {
        console.error('❌ Error creating gallery:', error.message);
      }
    }

    // Newsletter Subscribers
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
          id INT PRIMARY KEY AUTO_INCREMENT,
          email VARCHAR(100) UNIQUE NOT NULL,
          name VARCHAR(100),
          status ENUM('active', 'unsubscribed') DEFAULT 'active',
          subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_email (email),
          INDEX idx_status (status)
        )
      `);
      console.log('✅ Tabel newsletter_subscribers dibuat');
    } catch (error) {
      if (!error.message.includes('already exists')) {
        console.error('❌ Error creating newsletter_subscribers:', error.message);
      }
    }

    // Contact Messages
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS contact_messages (
          id INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL,
          subject VARCHAR(255),
          message TEXT NOT NULL,
          status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_status (status),
          INDEX idx_created (created_at)
        )
      `);
      console.log('✅ Tabel contact_messages dibuat');
    } catch (error) {
      if (!error.message.includes('already exists')) {
        console.error('❌ Error creating contact_messages:', error.message);
      }
    }

    // About Sections
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS about_sections (
          id INT PRIMARY KEY AUTO_INCREMENT,
          section_type ENUM('history', 'vision', 'mission', 'structure') NOT NULL,
          title VARCHAR(255),
          content LONGTEXT NOT NULL,
          image VARCHAR(255),
          order_index INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_type (section_type),
          INDEX idx_order (order_index)
        )
      `);
      console.log('✅ Tabel about_sections dibuat');
    } catch (error) {
      if (!error.message.includes('already exists')) {
        console.error('❌ Error creating about_sections:', error.message);
      }
    }

    // Social Media
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS social_media (
          id INT PRIMARY KEY AUTO_INCREMENT,
          platform VARCHAR(50) NOT NULL,
          url VARCHAR(255) NOT NULL,
          icon VARCHAR(50),
          order_index INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_platform (platform)
        )
      `);
      console.log('✅ Tabel social_media dibuat');

      // Insert default social media if empty
      const [smCount] = await db.query('SELECT COUNT(*) as count FROM social_media');
      if (smCount[0].count === 0) {
        await db.query(`
          INSERT INTO social_media (platform, url, icon, order_index) VALUES
          ('Facebook', 'https://facebook.com/bemkmisi', 'facebook', 1),
          ('Instagram', 'https://instagram.com/bemkmisi', 'instagram', 2),
          ('Twitter', 'https://twitter.com/bemkmisi', 'twitter', 3),
          ('YouTube', 'https://youtube.com/bemkmisi', 'youtube', 4)
        `);
        console.log('✅ Default social media ditambahkan');
      }
    } catch (error) {
      if (!error.message.includes('already exists')) {
        console.error('❌ Error creating social_media:', error.message);
      }
    }

    // Chairman Greeting
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS chairman_greeting (
          id INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(100) NOT NULL,
          position VARCHAR(100) DEFAULT 'Ketua BEM FSRD ISI Yogyakarta',
          greeting LONGTEXT NOT NULL,
          photo VARCHAR(255),
          signature VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Tabel chairman_greeting dibuat');
    } catch (error) {
      if (!error.message.includes('already exists')) {
        console.error('❌ Error creating chairman_greeting:', error.message);
      }
    }

    // Organization Structure
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS organization_structure (
          id INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(100) NOT NULL,
          position VARCHAR(100) NOT NULL,
          division VARCHAR(100),
          bio TEXT,
          photo VARCHAR(255),
          email VARCHAR(100),
          phone VARCHAR(20),
          order_index INT DEFAULT 0,
          status ENUM('active', 'inactive') DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_position (position),
          INDEX idx_status (status),
          INDEX idx_order (order_index)
        )
      `);
      console.log('✅ Tabel organization_structure dibuat');
    } catch (error) {
      if (!error.message.includes('already exists')) {
        console.error('❌ Error creating organization_structure:', error.message);
      }
    }

    console.log('\n✅ Semua tabel berhasil dibuat/diperiksa!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createMissingTables();

