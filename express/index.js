//const { DAO } = require('./lib/app/database/dao.js');
const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

// bcrypt
//const db = require('../models');
var bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');
const secretKey = "astrid";

app.use(cors());
app.use(express.json());

// TODO: separate database logic from this file

// used to verify token from user
/*const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');

    if(!token)
    {
        return res.status(401).json({ message: 'Access denied. No token provided.'});
    }

    try
    {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    }
    catch (error)
    {
        return res.status(403).json({ message: "Invalid token." });
    }
    
}*/

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

app.post('/login', function(req, res, next) {

    const username = req.body.username;
    const password = req.body.password;

    connection.query("SELECT * FROM users WHERE username = ?", [username], function (error, results) {
        if (error) {
            console.error(error);
                results.status(500).send("Database Error");
                return;
        }

    if (results.length === 0) {
        res.status(401).send("Username not found.");
        return;
    }

    const storedHashedPassword = results[0].password;

    bcrypt.compare(password, storedHashedPassword, function (error, result) {
        if (error)
        {
            console.error(error);
            res.status(500).send("Internal server error.");
            return;
        }

        if (result) {
            res.status(200).send("Login successful.");
        } else {
            res.status(401).send("Login failed.");
        }
    })

    // TODO: check that values are not blank, add promise?
    /*connection.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], function (error, results, fields)
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
        
    });*/
})
})

app.post('/register', function(req, res, next) {

    const fullname = req.body.fullname;
    const username = req.body.username;
    const password = req.body.password;

    // checks if username already exists in the database -- FIXME
    connection.query("SELECT * FROM users WHERE username = ?", [username], function (error, results) {
        if (error) {
            console.error(error);
            res.status(500).send("Database Error");
            return;
        }

        if (results.length > 0) {
            res.status(401).send("Username exists in the database.");
            return;
        } else {

            // hashes password
            bcrypt.hash(password, saltRounds, function (error, hash) {
        
                if (error) {
                    console.error(error);
                    res.status(500).send("Server Error");
                    return;
                }
        
                // create JWT token
                const payload = {
                    username: username,
                }

                jwt.sign(payload, secretKey, {expiresIn: '1h'}, (err, token) => {
                    if (err)
                    {
                        console.error(err);
                        return res.status(500).json({ error: 'Failed to generated token'});
                    }
                    console.log("Token:" + token);
                    res.json({ token: token});
                })
        
            // inserts new user into database
            var sql = "INSERT INTO users (username, password, fullname) VALUES ?";
            var values = [
                [username, hash, fullname]
            ];
        
            connection.query(sql, [values], function (error, result)
            {
                if (error) {
                    throw error;
                } else {
                    res.status(200).send("Registration successful.");
                }
        
            })
            })
        }
    }) 
    
})

// retrieves full name from the user based on username -- needed?
app.get('/name/:username', (req, res, next) => {

    // TODO: add logic

})

app.listen(3000, () => {
    console.log("Server started on port 3000");
})