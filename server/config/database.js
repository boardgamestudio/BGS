const mysql = require('mysql2/promise');

class Database {
  constructor() {
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'your_db_username',
      password: process.env.DB_PASSWORD || 'your_db_password',
      database: process.env.DB_NAME || 'your_database_name',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };
    
    this.pool = mysql.createPool(this.config);
  }

  async query(sql, params = []) {
    try {
      const [rows] = await this.pool.execute(sql, params);
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async getConnection() {
    return await this.pool.getConnection();
  }
}

module.exports = new Database();
