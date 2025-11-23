const db = require('../config/database');
require('dotenv').config();

async function addKabinetSasmitaTable() {
  try {
    console.log('🔍 Menambahkan tabel kabinet_sasmita...\n');

    // Check if table exists
    const [tables] = await db.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'kabinet_sasmita'
    `);

    if (tables.length === 0) {
      // Create table
      await db.query(`
        CREATE TABLE IF NOT EXISTS kabinet_sasmita (
          id INT PRIMARY KEY AUTO_INCREMENT,
          title VARCHAR(255) DEFAULT 'Mengenal Kabinet Sasmita',
          description LONGTEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      // Insert default description
      await db.query(`
        INSERT INTO kabinet_sasmita (title, description) VALUES 
        ('Mengenal Kabinet Sasmita', 
        '<p>Kabinet Sasmita adalah kepengurusan Badan Eksekutif Mahasiswa Fakultas Seni Rupa dan Desain (BEM FSRD) Institut Seni Indonesia Yogyakarta. Nama "Sasmita" yang berarti <em>pesan</em> atau <em>makna</em> dalam bahasa Jawa, mencerminkan visi kepengurusan untuk menyampaikan pesan positif dan memberikan makna melalui setiap program kerja yang dijalankan.</p>
        <p>Kabinet ini berkomitmen untuk mengembangkan potensi mahasiswa FSRD dalam berbagai aspek, baik akademik, organisasi, maupun pengembangan diri. Melalui berbagai program kerja yang inovatif dan relevan, Kabinet Sasmita berupaya menciptakan lingkungan yang mendukung kreativitas, kolaborasi, dan semangat kebersamaan di kalangan mahasiswa FSRD.</p>
        <p>Dengan semangat <em>Sasmita</em>, setiap langkah yang diambil diharapkan dapat memberikan dampak positif yang berkelanjutan bagi kemajuan Fakultas Seni Rupa dan Desain ISI Yogyakarta, serta membawa nama baik institusi ke tingkat yang lebih tinggi.</p>')
      `);

      console.log('✅ Tabel kabinet_sasmita berhasil dibuat dengan data default');
    } else {
      console.log('✅ Tabel kabinet_sasmita sudah ada');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addKabinetSasmitaTable();

