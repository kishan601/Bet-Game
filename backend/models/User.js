const { pool } = require('../config/db');

const User = {
  async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  },

  async findById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async create({ name, email, password }) {
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, password]
    );
    return result.rows[0];
  },

  async updateWallet(id, newWallet) {
    const result = await pool.query(
      'UPDATE users SET wallet = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [newWallet, id]
    );
    return result.rows[0];
  },

  async findAll() {
    const result = await pool.query(
      'SELECT id, name, email, wallet, is_admin, created_at FROM users ORDER BY created_at DESC'
    );
    return result.rows;
  }
};

module.exports = User;
