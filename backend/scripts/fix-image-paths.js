const db = require('../config/database');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

async function fixImagePaths() {
  try {
    console.log('🔍 Memperbaiki path gambar...\n');

    // Fix news images
    const [news] = await db.query('SELECT id, featured_image FROM news WHERE featured_image IS NOT NULL');
    
    for (const item of news) {
      if (item.featured_image) {
        let newPath = item.featured_image;
        
        // If path is /uploads/news/ but file is in general, fix it
        if (newPath.startsWith('/uploads/news/')) {
          const filename = path.basename(newPath);
          const generalPath = path.join(process.env.UPLOAD_PATH || './uploads', 'general', filename);
          const newsPath = path.join(process.env.UPLOAD_PATH || './uploads', 'news', filename);
          
          // Check if file exists in general folder
          if (fs.existsSync(generalPath)) {
            // Move file to news folder
            if (!fs.existsSync(path.dirname(newsPath))) {
              fs.mkdirSync(path.dirname(newsPath), { recursive: true });
            }
            fs.renameSync(generalPath, newsPath);
            console.log(`✅ Moved: ${filename} to news folder`);
          } else if (fs.existsSync(newsPath)) {
            // File already in correct location
            console.log(`✓ Already correct: ${filename}`);
          } else {
            // File doesn't exist, update path to general
            newPath = `/uploads/general/${filename}`;
            await db.query('UPDATE news SET featured_image = ? WHERE id = ?', [newPath, item.id]);
            console.log(`⚠️  Updated path to general: ${filename}`);
          }
        } else if (newPath.startsWith('/uploads/general/')) {
          // File is in general, move to news
          const filename = path.basename(newPath);
          const generalPath = path.join(process.env.UPLOAD_PATH || './uploads', 'general', filename);
          const newsPath = path.join(process.env.UPLOAD_PATH || './uploads', 'news', filename);
          
          if (fs.existsSync(generalPath)) {
            if (!fs.existsSync(path.dirname(newsPath))) {
              fs.mkdirSync(path.dirname(newsPath), { recursive: true });
            }
            fs.renameSync(generalPath, newsPath);
            newPath = `/uploads/news/${filename}`;
            await db.query('UPDATE news SET featured_image = ? WHERE id = ?', [newPath, item.id]);
            console.log(`✅ Moved and updated: ${filename}`);
          }
        }
      }
    }

    console.log('\n✅ Path gambar berhasil diperbaiki!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixImagePaths();

