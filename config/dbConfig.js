const { createPool } = require('mysql2/promise');

// Create a connection pool
const pool = createPool({
    user: 'root',
    host: 'localhost',
    database: 'shopping',
    password: '',
    port: 3306,
});

module.exports = pool;
