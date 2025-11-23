const db = require('../config/database');
require('dotenv').config();

async function addBatchIdColumn() {
  try {
    console.log('🔍 Menambahkan kolom batch_id ke tabel gallery...\n');

    // Check if column exists
    const [columns] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'gallery' 
      AND COLUMN_NAME = 'batch_id'
    `);

    if (columns.length === 0) {
      // Add batch_id column
      await db.query(`
        ALTER TABLE gallery 
        ADD COLUMN batch_id VARCHAR(50) NULL,
        ADD INDEX idx_batch_id (batch_id)
      `);
      console.log('✅ Kolom batch_id berhasil ditambahkan ke tabel gallery');
    } else {
      console.log('✅ Kolom batch_id sudah ada di tabel gallery');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addBatchIdColumn();

