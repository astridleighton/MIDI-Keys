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
    database: 'capstone'
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

// TODO: add hashing
app.post('/login', function(req, res, next) {

    const username = req.body.username;
    const password = req.body.password;

    // TODO: check that values are not blank, add promise?
    connection.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], function (error, results, fields)
    {
        if (error) throw error;

        if(results.length > 0)
        {
            res.send("Login success");
        }
        else
        {
            res.send("Login fail");
        }
        
    });
})

// TODO: add error handling
app.post('/register', function(req, res, next) {

    // TODO: remove id
    const id = 1;
    const firstName = req.body.firstName;
    const username = req.body.username;
    const password = req.body.password;

    var sql = "INSERT INTO users (id, username, password, firstName) VALUES ?";
    var values = [
        [id, username, password, firstName]
    ];

    connection.query(sql, [values], function (error, result)
    {
        if (error) throw error;

        if(result.length > 0)
        {
            res.status(200).send("Registration successful");
        }
        else
        {
            res.status(400).send("Registration failure. Duplicate value.");
        }

    })


    /*//var user = { username: username, password: password, firstName: firstName }
    connection.query("INSERT INTO users (ID, USERNAME, PASSWORD, firstName) VALUES (?,?,?,?)", [username, password, firstName], function(errors, results, fields)
    {
        if(error) throw error;
    })*/
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