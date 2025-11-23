const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function migrate() {
    let connection;
    
    try {
        // Connect to MySQL
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
        });

        console.log('Connected to MySQL server');

        // Read schema file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split by semicolon and execute each statement
        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        for (const statement of statements) {
            if (statement.trim()) {
                try {
                    await connection.query(statement);
                    console.log('✓ Executed statement');
                } catch (error) {
                    // Ignore errors for existing tables/objects
                    if (!error.message.includes('already exists')) {
                        console.error('Error executing statement:', error.message);
                    }
                }
            }
        }

        console.log('\n✅ Database migration completed successfully!');
        console.log('Default admin credentials:');
        console.log('Username: admin');
        console.log('Password: admin123');
        console.log('\n⚠️  Please change the default password after first login!');

    } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

migrate();

