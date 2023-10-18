const express = require("express")
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

})