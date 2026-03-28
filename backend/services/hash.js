const { pool, connectDB } = require('../config/db');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@test.com']);
    if (existing.rows.length > 0) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const result = await pool.query(
      'INSERT INTO users (name, email, password, wallet, is_admin) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      ['Admin', 'admin@test.com', hashedPassword, 0, true]
    );

    console.log('Admin created:', result.rows[0].email);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
