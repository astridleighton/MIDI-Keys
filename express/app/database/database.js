const mysql = require('mysql');

/*const express = require("express")
const app = express()

const mysql = require('mysql');

const dao = mysql.createPool({
    connectionLimit: 100,
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "capstone",
    port: "3306"
})

dao.getConnection((err, connection) => {
    
    if (err)
    {
        throw err
    }
    else
    {
        console.log("Database connection successful: " + connection.threadId);
    }

})*/

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'capstone'
})

connection.connect();

class Database {

    async findByUsername(username)
    {
        return new Promise((resolve, reject) => {
            connection.query("SELECT password, firstname FROM users WHERE username = ?", [username], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            })
        })
    }

}

module.exports = new Database();