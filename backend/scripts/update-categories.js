const db = require('../config/database');
require('dotenv').config();

async function updateCategories() {
  try {
    console.log('🔄 Mengupdate kategori Program Kerja dan Galeri...\n');

    // Kategori baru untuk Program Kerja dan Galeri
    const newProgramCategories = [
      { name: 'Humas', slug: 'humas' },
      { name: 'PSDM', slug: 'psdm' },
      { name: 'Desain', slug: 'desain' },
      { name: 'PUPDOK', slug: 'pupdok' },
      { name: 'Kewirausahaan', slug: 'kewirausahaan' },
      { name: 'BPH', slug: 'bph' }
    ];

    const oldProgramSlugs = ['seni-rupa', 'musik', 'tari', 'teater', 'media'];
    const oldGallerySlugs = ['pameran', 'konser', 'pertunjukan', 'workshop'];

    // Hapus kategori program lama
    for (const slug of oldProgramSlugs) {
      await db.query('DELETE FROM categories WHERE slug = ? AND type = ?', [slug, 'program']);
      console.log(`✅ Kategori program lama "${slug}" dihapus`);
    }

    // Hapus kategori gallery lama
    for (const slug of oldGallerySlugs) {
      await db.query('DELETE FROM categories WHERE slug = ? AND type = ?', [slug, 'gallery']);
      console.log(`✅ Kategori gallery lama "${slug}" dihapus`);
    }

    // Tambahkan kategori program baru jika belum ada
    for (const cat of newProgramCategories) {
      const [existing] = await db.query(
        'SELECT id FROM categories WHERE slug = ? AND type = ?',
        [cat.slug, 'program']
      );
      
      if (existing.length === 0) {
        await db.query(
          'INSERT INTO categories (name, slug, type) VALUES (?, ?, ?)',
          [cat.name, cat.slug, 'program']
        );
        console.log(`✅ Kategori program "${cat.name}" ditambahkan`);
      } else {
        console.log(`ℹ️  Kategori program "${cat.name}" sudah ada`);
      }
    }

    // Tambahkan kategori gallery baru jika belum ada
    // Karena slug harus unique, kita gunakan slug yang berbeda untuk gallery
    for (const cat of newProgramCategories) {
      const gallerySlug = `${cat.slug}-gallery`;
      const [existing] = await db.query(
        'SELECT id FROM categories WHERE slug = ? AND type = ?',
        [gallerySlug, 'gallery']
      );
      
      if (existing.length === 0) {
        await db.query(
          'INSERT INTO categories (name, slug, type) VALUES (?, ?, ?)',
          [cat.name, gallerySlug, 'gallery']
        );
        console.log(`✅ Kategori gallery "${cat.name}" ditambahkan`);
      } else {
        console.log(`ℹ️  Kategori gallery "${cat.name}" sudah ada`);
      }
    }

    console.log('\n✅ Update kategori selesai!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateCategories();

