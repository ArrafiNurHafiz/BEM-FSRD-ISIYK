const db = require('../config/database');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function moveImages() {
  try {
    console.log('🔍 Memindahkan gambar ke folder yang benar...\n');

    const uploadDir = path.resolve(process.env.UPLOAD_PATH || './uploads');
    const generalDir = path.join(uploadDir, 'general');
    const newsDir = path.join(uploadDir, 'news');

    // Ensure news directory exists
    if (!fs.existsSync(newsDir)) {
      fs.mkdirSync(newsDir, { recursive: true });
    }

    // Get all news with images
    const [news] = await db.query('SELECT id, featured_image FROM news WHERE featured_image IS NOT NULL');

    for (const item of news) {
      if (!item.featured_image) continue;

      const dbPath = item.featured_image; // e.g., /uploads/news/filename.jpeg
      const filename = path.basename(dbPath);
      
      // Check where file actually is
      const generalPath = path.join(generalDir, filename);
      const newsPath = path.join(newsDir, filename);

      if (dbPath.includes('/uploads/news/')) {
        // Database says it's in news folder
        if (fs.existsSync(generalPath) && !fs.existsSync(newsPath)) {
          // File is in general but should be in news
          fs.renameSync(generalPath, newsPath);
          console.log(`✅ Moved: ${filename} from general to news`);
        } else if (fs.existsSync(newsPath)) {
          console.log(`✓ Already correct: ${filename} in news`);
        } else {
          // File doesn't exist, update database to point to general
          const newPath = `/uploads/general/${filename}`;
          if (fs.existsSync(generalPath)) {
            await db.query('UPDATE news SET featured_image = ? WHERE id = ?', [newPath, item.id]);
            console.log(`⚠️  Updated path to general: ${filename}`);
          } else {
            console.log(`❌ File not found: ${filename}`);
          }
        }
      } else if (dbPath.includes('/uploads/general/')) {
        // Database says it's in general folder
        if (fs.existsSync(generalPath)) {
          console.log(`✓ Correct: ${filename} in general`);
        } else if (fs.existsSync(newsPath)) {
          // File is in news but database says general
          const newPath = `/uploads/news/${filename}`;
          await db.query('UPDATE news SET featured_image = ? WHERE id = ?', [newPath, item.id]);
          console.log(`✅ Updated path to news: ${filename}`);
        } else {
          console.log(`❌ File not found: ${filename}`);
        }
      }
    }

    console.log('\n✅ Selesai!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

moveImages();

