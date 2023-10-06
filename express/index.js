//const { DAO } = require('./lib/app/database/dao.js');
const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());

// TODO: separate database logic from this file

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'capstone',
})

connection.connect((error) => {
    if (error)
    {
        console.log("Error connecting to database:", error);
    }
    else
    {
        console.log("Connected to database successfully.");
    }
})

app.get('/', (req, res) => {
    res.send("Testing express app");
})

/*app.get('/test', (req, res) => {

    const query = 'SELECT * FROM users';

    connection.query(query, (error, results) =>
    {
        if (error)
        {
            console.error("Error executing query:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    })

    //console.log(res);
    const jsonResults = JSON.stringify(results);
    res.json(JSON.parse(jsonResults));

})*/

app.listen(3000, () => {
    console.log("Server started on port 3000");
})