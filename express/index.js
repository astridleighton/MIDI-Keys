//const { DAO } = require('./lib/app/database/dao.js');
const express = require('express');
const app = express();
const cors = require('cors');
const Security = require('./app/security/security');
const Database = require('./app/database/database');

app.use(cors());
app.use(express.json());

const mysql = require('mysql');

// sets up database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'capstone'
}

const connection = mysql.createConnection(dbConfig);

/*
* Connects to the database at the specified database credentials
*/
connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
    } else {
      console.log('Connected to the database');
    }
  });

/*
* Testing message at index page to ensure application is running
*/
app.get('/', (req, res) => {
    res.send("Testing express app");
})

/*
* Allows user to log in by validating password and token
*/
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

/*
* Allows user to create an account by registering
*/
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
* Allows user to add sound to his favorites tab
*/
app.post('/add-favorite', async function(req, res) {

    const username = req.body.username;
    const sound = req.body.sound;
    
    try {

        // TODO: check if token is valid?

        const userIDObject = await Database.getIDFromUser(connection, username);

        const soundIDObject = await Database.getIDFromSound(connection, sound);

        // TODO: convert values to numbers

        /*const addFavorite = await Database.addFavorite(connection, userID, soundID);

        /*if (addFavorite) 
            res.status(200).send("Added favorite successfully.");
        } else {*/
            res.status(401).json({ message: 'Add favorite failed.', status: 401 });
        //}

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while checking the username.' });
    }

})

/*
* Allows user to remove sound from his favorites tab (INCOMPLETE)
*/
app.delete('/remove-favorite', async (req, res) => {

    const userID = req.body.username;
    const soundID = req.body.sound;

    // TODO: check if token is valid?
    
    //const validateToken = await Security.validateToken(token);

    // TODO: get user ID

    // TODO: get sound ID

    // TODO: fix SQL error

    //const removeFavorite = await Database.deleteFavorite(connection, userID, soundID);

    res.status(200).send("Remove sound - Nothing set here yet.");

})

/*
* Gets all sounds from the user to add to the favorites tab (INCOMPLETE)
*/
app.get('/all-sounds/:username', async (req, res) => {

    const username = req.params.username;
    const token = req.body.token;
    
    const validateToken = await Security.verifyToken(token);

    if(validateToken)
    {
        const allSounds = await Database.getAllSoundsFromUser(connection, username);
        res.status(200).json(allSounds);
    } else {
        res.status(401).send("Invalid token.");
    }

})

/*
* Testing message when express app runs
*/
app.listen(3000, () => {
    console.log("Server started on port 3000");
})