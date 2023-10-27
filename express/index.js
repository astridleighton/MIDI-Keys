//const { DAO } = require('./lib/app/database/dao.js');
const express = require('express');
const app = express();
const cors = require('cors');
const Security = require('./app/security/security');
const Database = require('./app/database/database');

app.use(cors());
app.use(express.json());

const mysql = require('mysql');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'capstone'
}

const connection = mysql.createConnection(dbConfig);

// Connect to the database
connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
    } else {
      console.log('Connected to the database');
    }
  });

app.get('/', (req, res) => {
    res.send("Testing express app");
})

app.post('/login', async function(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    // create JWT token
    const payload = {
        username: username,
    }

    try {
        const usernameCheck = await Database.findPasswordAndNameByUsername(connection, username);

        if (usernameCheck.length === 0) {
            res.status(401).send("Username does not exist.");
        } else {

           const storedUser = usernameCheck[0];

            // Extract the stored password and first name
            const storedHashedPassword = storedUser.password;
            const firstName = storedUser.firstname;

           const token = await Security.generateToken(payload);

           const validPassword = await Security.comparePasswords(password, storedHashedPassword);

           if (validPassword)
           {
            res.status(200).json({ message: 'Login successful.', status: 200, token, firstName });
           } else {
            res.status(401).json({ message: 'Login failed.', status: 401 });
           }
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while checking the username.' });
    }

});

app.post('/register', async function(req, res, next) {

    const firstname = req.body.firstname;
    const username = req.body.username;
    const password = req.body.password;

    try {
        
        const usernameCheck = await Database.findByUsername(connection, username); // checks if username exists

        if(usernameCheck.length > 0) {
            res.status(403).send("Username already exists.");
            return;
        } else {
            const hashedPassword = await Security.hashPassword(password); // hashes password

            if (!hashedPassword) {
                res.status(500).json({ error: "Password hashing failed. "});
                return;
            }

            const insertNewUser = await Database.addNewUser(connection, username, firstname, hashedPassword); // adds new user to database

            if(!insertNewUser) {
                res.status(500).json({ error: "Database error. "});
                return;
            }

            res.json({ message: 'Registration successful.', status: 200 });

        }

    } catch (error) {

        console.error(error);
        res.status(500).json({ error: "Server error." });

    }
    
})
/*
app.delete('/remove-sound/:id/:soundID', (req, res) => {

    const id = req.params.id;
    const deleteSound = req.params.soundID;
    
    // TODO: validate index
    // TODO: get all sounds from database at specified user
    // TODO: update json and remove selected sound
    // TODO: add response messages

})

/*
app.post('/add-sound/:id/:soundID', (req, res) => {

    const id = req.params.id;
    const newSound = req.params.soundID;

    // TODO: get values from database and add to array
    // TODO: update database with new sound
    // TODO: data validation

    if(!addedSound) {
        // retrn 400 error
    }

    sounds.push(addedSound);

    // TODO: ADD success response

})*/

app.listen(3000, () => {
    console.log("Server started on port 3000");
})