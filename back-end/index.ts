const express  = require('express');
// const {Request, Response} = require('express');
const cors = require('cors');
const Security = require('./app/security/security');
import Database from './app/database/database';

const app = express();
app.use(cors());
app.use(express.json());

// sets up database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'capstone'
}

const db = new Database(dbConfig);

/*
* Testing message at index page to ensure application is running
*/
app.get('/', (req, res) => {
    res.send("Testing express app");
})

/*
* Allows user to log in by validating password and token
*/
app.post('/login', async function (req, res) {

    if (req.body) {
        const username: string = req.body.username;
        const password: string = req.body.password;

        // create JWT
        const payload = {
            username: username,
        }

        try {
            const storedUser = await db.findPasswordAndNameByUsername(username);

            if (storedUser == null) {
                res.status(404).json({message: 'Username does not exist or returned null from database.', status: 404});
            } else {
                // Extract the stored password and first name
                const firstName = storedUser.firstname;

                // TODO: astrid fix these class function references -- remove these values
                const token = "test";
                const validPassword = true;
                /* const token = await Security.generateToken(payload);
                const validPassword = await Security.comparePasswords(password, storedUser.password); */

                if (validPassword) {
                    res.status(200).json({message: 'Login successful.', status: 200, token, firstName});
                } else {
                    res.status(401).json({message: 'Login failed.', status: 401});
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'An error occurred while checking the username.'});
        }
    }
});

/*
* Allows user to create an account by registering
*/
app.post('/register', async function (req, res) {
    const firstname = req.body.firstname;
    const username = req.body.username;
    const password = req.body.password;

    try {
        const usernameCheck: any = await db.findByUsername(username); // checks if username exists

        if (usernameCheck && usernameCheck.length > 0) {
            res.status(403).send("Username already exists.");
            return;
        } else {
            const hashedPassword = await Security.hashPassword(password); // hashes password

            if (!hashedPassword) {
                res.status(500).json({error: "Password hashing failed. "});
                return;
            }

            const insertNewUser = await db.addNewUser(username, firstname, hashedPassword); // adds new user to database

            if (!insertNewUser) {
                res.status(500).json({error: "Database error. "});
                return;
            }
            res.json({message: 'Registration successful.', status: 200});
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Server error."});
    }

})

/*
* Allows user to add sound to his favorites tab
*/
app.post('/add-favorite/:sound', async function (req, res) {

    if (req.headers.authorization && req.params.sound) {

        const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header
        const sound = req.params.sound;

        try {
            const username: any = await Security.getUserNameFromToken(token); // get username from token

            if (username && username.length > 0) { // if token is valid
                const userID = await db.getIDFromUser(username);
                const soundID = await db.getIDFromSound(sound);

                const favoriteExists = await db.findFavoriteByUserAndSound(userID, soundID);

                if (favoriteExists) {
                    const addFavorite = await db.addFavorite(userID, soundID);

                    if (addFavorite) {
                        res.status(200).json({message: 'Added favorite successfully.'});
                    } else {
                        res.status(401).json({message: 'Add favorite failed.'});
                    }
                } else { // favorite already exists in database
                    res.status(403).json({message: 'Favorite already exists.'});
                }
            } else {
                res.status(401).json({message: "Unauthorized to add favorite. Please log in."});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'An error occurred while checking the username.'});
        }
    } else {
        res.status(404).json({message: 'Invalid input parameters. Please try again.'})
    }
})

/*
* Allows user to remove sound from his favorites tab
*/
app.delete('/remove-favorite/:sound', async (req, res) => {

    if (req.headers.authorization) {
        console.log('has token');
        const sound = req.params.sound;
        const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header

        try {

            const username: any = await Security.getUserNameFromToken(token); // get username from token

            console.log(username && username.length > 0);

            if (username) {

                const userID = await db.getIDFromUser(username);
                const soundID = await db.getIDFromSound(sound);
                const removeFavorite = await db.removeFavorite(userID, soundID);

                if (removeFavorite) {
                    res.status(200).json({message: "Removed favorite successfully."});
                } else {
                    res.status(401).json({message: 'Remove favorite failed.'});
                }
            } else {
                res.status(401).json({message: "Unauthorized to remove favorite. Please log in."});
            }


        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'An error occurred while checking the username.'});
        }
    } else {
        res.status(404).json({message: 'Invalid input parameters. Please try again.'})
    }


})

/*
* Gets all sounds
*/
app.get('/all-sounds', async (req, res) => {
    try {
        const allSounds = await db.getAllSounds();
        res.status(200).json(allSounds);
    } catch (error) {
        res.status(500).send("Unable to retrieve sounds from database.");
    }

})

/*
* Get all favorites
*/
app.get('/all-favorites', async (req, res) => {

    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header
        console.log("Token: " + token);

        const username = await Security.getUserNameFromToken(token); // get username from token
        const usernameCheck = await db.findByUsername(username); // checks if username exists

        if (!usernameCheck) {
            res.status(403).send("Invalid token or username not found.");
        } else {
            try {
                const userID = await db.getIDFromUser(username);
                const allFavorites = await db.getAllFavoritesFromUser(userID);

                if (!allFavorites) {
                    return res.status(404).json({error: 'No favorites found for the user.'});
                } else {
                    res.status(200).json(allFavorites);
                }

            } catch (error) {
                res.status(500).send("Unable to retrieve sounds from database.");
            }
        }
    } else {
        res.status(403).send("Invalid token or username not found.");
    }
})

/*
* Testing message when express app runs
*/
app.listen(3000, () => {
    console.log("Server started on port 3000");
})