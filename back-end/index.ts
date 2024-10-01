import express, { Request, Response } from 'express';
import cors from 'cors';
import Security from './app/security/security';
import Database from './app/database/database';

const app = express(); // Explicitly typing the app variable
app.use(cors());
app.use(express.json());

// TODO: take a look at this article: https://medium.com/@gfujii-cmd/getting-started-with-express-typescript-with-mysql-api-b31c5a648aac


// TODO: fix this
const db = new Database();

/*
* Testing message at index page to ensure application is running
*/
app.get('/', (req, res) => {
    res.send("Testing express app");
})

/*
* Allows user to log in by validating password and token
*/
app.post('/login', async function(req: Request, res: Response) {

    if(req.body) {
        const username = req.body.username;
        const password = req.body.password;

    // create JWT
    const payload = {
        username: username,
    }

    try {
        const usernameCheck = await db.findPasswordAndNameByUsername(username);

        if (!usernameCheck) {
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
    }
    

});

/*
* Allows user to create an account by registering
*/
app.post('/register', async function(req, res) {
    const firstname = req.body.firstname;
    const username = req.body.username;
    const password = req.body.password;

    try {
        // TODO: update this with stored procedure
        const usernameCheck: any = await db.findByUsername(username); // checks if username exists

        if(usernameCheck && usernameCheck.length > 0) {
            res.status(403).send("Username already exists.");
            return;
        } else {
            const hashedPassword = await Security.hashPassword(password); // hashes password

            if (!hashedPassword) {
                res.status(500).json({ error: "Password hashing failed. "});
                return;
            }

            // TODO: update this with stored
            const insertNewUser = await db.addNewUser(username, firstname, hashedPassword); // adds new user to database

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
app.post('/add-favorite/:sound', async function(req, res) {

    if (req.headers.authorization && req.params.sound) {

        const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header
        const sound = req.params.sound;
    
        try {
            const username:any = await Security.getUserNameFromToken(token); // get username from token

            if(username && username.length > 0) { // if token is valid
                const userID = await db.getIDFromUser(username);
                const soundID = await db.getIDFromSound(sound);

                const favoriteExists = await db.findFavoriteByUserAndSound(userID, soundID);

                if(favoriteExists) {
                    const addFavorite = await db.addFavorite(userID, soundID);

                    if (addFavorite) {
                        res.status(200).json({ message: 'Added favorite successfully.'});
                    } else {
                        res.status(401).json({ message: 'Add favorite failed.'});
                    }
                } else { // favorite already exists in database
                    res.status(403).json({ message: 'Favorite already exists.'});
                }
            } else {
                res.status(401).json({ message: "Unauthorized to add favorite. Please log in." });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred while checking the username.' });
        }
    } else {
        res.status(404).json({ message: 'Invalid input parameters. Please try again.'})
    }
})

/*
* Allows user to remove sound from his favorites tab
*/
app.delete('/remove-favorite/:sound', async (req, res) => {

    if(req.headers.authorization) {
        console.log('has token');
        const sound = req.params.sound;
        const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header

        try {

            const username:any = await Security.getUserNameFromToken(token); // get username from token

            console.log(username && username.length > 0);

            if(username) {

                const userID = await db.getIDFromUser(username);
                const soundID = await db.getIDFromSound(sound);
                const removeFavorite = await db.removeFavorite(userID, soundID);

                if (removeFavorite) {
                    res.status(200).json({message: "Removed favorite successfully."});
                } else {
                    res.status(401).json({ message: 'Remove favorite failed.'});
                }
            } else {
                res.status(401).json({ message: "Unauthorized to remove favorite. Please log in."});
            }

            
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred while checking the username.'});
        }
    } else {
        res.status(404).json({ message: 'Invalid input parameters. Please try again.'})
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
        console.error("Error retrieving sounds: ", error);
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

                if(!allFavorites) {
                    res.status(404).json({ error: 'No favorites found for the user.' });
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