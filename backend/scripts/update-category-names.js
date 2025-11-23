const db = require('../config/database');
require('dotenv').config();

async function updateCategoryNames() {
  try {
    console.log('🔄 Mengupdate nama kategori Psdm dan Pupdok...\n');

    // Update PSDM
    await db.query(
      'UPDATE categories SET name = ? WHERE slug = ? AND type = ?',
      ['PSDM', 'psdm', 'program']
    );
    await db.query(
      'UPDATE categories SET name = ? WHERE slug = ? AND type = ?',
      ['PSDM', 'psdm-gallery', 'gallery']
    );
    console.log('✅ Kategori "Psdm" diupdate menjadi "PSDM"');

    // Update PUPDOK
    await db.query(
      'UPDATE categories SET name = ? WHERE slug = ? AND type = ?',
      ['PUPDOK', 'pupdok', 'program']
    );
    await db.query(
      'UPDATE categories SET name = ? WHERE slug = ? AND type = ?',
      ['PUPDOK', 'pupdok-gallery', 'gallery']
    );
    console.log('✅ Kategori "Pupdok" diupdate menjadi "PUPDOK"');

    console.log('\n✅ Update nama kategori selesai!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateCategoryNames();

