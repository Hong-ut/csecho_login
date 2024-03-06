const mysql = require('mysql2');

const db = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'aga2me0827',
    database: 'login_register',
    port: 3306,
})

module.exports = db;