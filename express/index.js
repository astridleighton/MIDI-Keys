//const { DAO } = require('./lib/app/database/dao.js');
const express = require('express');
const app = express();
const cors = require('cors');
const Security = require('./app/security/security');
const Database = require('./app/database/database');

app.use(cors());
app.use(express.json());

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
        const usernameCheck = await Database.findByUsername(username);

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
            res.json({ message: 'Login successful.', status: 200, token, firstName });
           } else {
            res.status(401).json({ message: 'Login failed.', status: 401 });
           }
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while checking the username.' });
    }

});

app.post('/register', function(req, res, next) {

    const firstname = req.body.firstname;
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
        
            // inserts new user into database
            var sql = "INSERT INTO users (username, password, firstname) VALUES ?";
            var values = [
                [username, hash, firstname]
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