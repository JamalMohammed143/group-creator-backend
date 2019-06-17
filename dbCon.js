const mysql = require('mysql');
//require('dotenv').config();
require('dotenv').config();

var dbCon = mysql.createPool({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name
});

module.exports = dbCon;