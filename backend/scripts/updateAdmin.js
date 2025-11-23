const bcrypt = require('bcryptjs');
const db = require('../config/database');
require('dotenv').config();

async function updateAdmin() {
  try {
    // Check if admin exists
    const [existing] = await db.query('SELECT id, username FROM users WHERE role = ?', ['admin']);
    
    const username = 'BEMYK';
    const password = 'admin-bemyk';
    const email = 'bemyk@isi.ac.id';
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existing.length > 0) {
      // Update existing admin
      const adminId = existing[0].id;
      // Check if full_name column exists
      try {
        await db.query(
          'UPDATE users SET username = ?, email = ?, password = ?, full_name = ? WHERE id = ?',
          [username, email, hashedPassword, 'BEM FSRD ISI Yogyakarta', adminId]
        );
      } catch (err) {
        // If full_name doesn't exist, update without it
        if (err.code === 'ER_BAD_FIELD_ERROR') {
          await db.query(
            'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?',
            [username, email, hashedPassword, adminId]
          );
        } else {
          throw err;
        }
      }
      console.log('✅ Admin user updated successfully!');
    } else {
      // Create new admin if doesn't exist
      try {
        await db.query(
          'INSERT INTO users (username, email, password, role, full_name) VALUES (?, ?, ?, ?, ?)',
          [username, email, hashedPassword, 'admin', 'BEM FSRD ISI Yogyakarta']
        );
      } catch (err) {
        // If full_name doesn't exist, insert without it
        if (err.code === 'ER_BAD_FIELD_ERROR') {
          await db.query(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, 'admin']
          );
        } else {
          throw err;
        }
      }
      console.log('✅ Admin user created successfully!');
    }
    
    console.log('Username: BEMYK');
    console.log('Password: admin-bemyk');
    console.log('⚠️  Please change the password after first login!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating admin user:', error);
    process.exit(1);
  }
}

updateAdmin();

