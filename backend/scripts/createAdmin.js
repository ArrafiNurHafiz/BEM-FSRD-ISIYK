const bcrypt = require('bcryptjs');
const db = require('../config/database');
require('dotenv').config();

async function createAdmin() {
  try {
    // Check if admin already exists
    const [existing] = await db.query('SELECT id FROM users WHERE username = ? OR role = ?', ['BEMYK', 'admin']);
    
    if (existing.length > 0) {
      console.log('Admin user already exists!');
      console.log('Run "npm run update-admin" to update credentials');
      process.exit(0);
    }

    const username = 'BEMYK';
    const password = 'admin-bemyk';
    const email = 'bemyk@isi.ac.id';
    const hashedPassword = await bcrypt.hash(password, 10);
    
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
    console.log('Username: BEMYK');
    console.log('Password: admin-bemyk');
    console.log('⚠️  Please change the password after first login!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();

