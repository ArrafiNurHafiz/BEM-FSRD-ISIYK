const db = require('../config/database');
require('dotenv').config();

async function fixAdminRole() {
  try {
    // First, update enum to include superadmin if needed
    await db.query(`
      ALTER TABLE users 
      MODIFY role ENUM('admin', 'editor', 'staff', 'superadmin') 
      DEFAULT 'staff'
    `);
    console.log('✅ Enum role updated');

    // Update admin user role
    const [result] = await db.query(
      'UPDATE users SET role = ? WHERE username = ?',
      ['admin', 'admin']
    );

    if (result.affectedRows > 0) {
      console.log('✅ Admin role updated to "admin"');
    } else {
      console.log('⚠️  No user found with username "admin"');
    }

    // Verify
    const [users] = await db.query(
      'SELECT id, username, email, role FROM users WHERE username = ?',
      ['admin']
    );

    if (users.length > 0) {
      console.log('✅ Current admin user:');
      console.log(users[0]);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixAdminRole();

