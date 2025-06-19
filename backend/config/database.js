const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',  
    password: 'root', // Set this to your MySQL root password
    database: 'multimedia_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection
pool.getConnection()
    .then(connection => {
        console.log('Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to database:', err);
    });

module.exports = {
    pool,
    query: (sql, params) => pool.query(sql, params)
};