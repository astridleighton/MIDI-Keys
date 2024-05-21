"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const security_1 = __importDefault(require("./app/security/security"));
const database_1 = __importDefault(require("./app/database/database"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// sets up database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'capstone'
};
const db = new database_1.default(dbConfig);
/*
* Testing message at index page to ensure application is running
*/
app.get('/', (req, res) => {
    res.send("Testing express app");
});
/*
* Allows user to log in by validating password and token
*/
app.post('/login', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body) {
            const username = req.body.username;
            const password = req.body.password;
            // create JWT
            const payload = {
                username: username,
            };
            try {
                const usernameCheck = yield db.findPasswordAndNameByUsername(username);
                if (!usernameCheck) {
                    res.status(401).send("Username does not exist.");
                }
                else {
                    const storedUser = usernameCheck[0];
                    // Extract the stored password and first name
                    const storedHashedPassword = storedUser.password;
                    const firstName = storedUser.firstname;
                    const token = yield security_1.default.generateToken(payload);
                    const validPassword = yield security_1.default.comparePasswords(password, storedHashedPassword);
                    if (validPassword) {
                        res.status(200).json({ message: 'Login successful.', status: 200, token, firstName });
                    }
                    else {
                        res.status(401).json({ message: 'Login failed.', status: 401 });
                    }
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'An error occurred while checking the username.' });
            }
        }
    });
});
/*
* Allows user to create an account by registering
*/
app.post('/register', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const firstname = req.body.firstname;
        const username = req.body.username;
        const password = req.body.password;
        try {
            const usernameCheck = yield db.findByUsername(username); // checks if username exists
            if (usernameCheck) {
                res.status(403).send("Username already exists.");
                return;
            }
            else {
                const hashedPassword = yield security_1.default.hashPassword(password); // hashes password
                if (!hashedPassword) {
                    res.status(500).json({ error: "Password hashing failed. " });
                    return;
                }
                const insertNewUser = yield db.addNewUser(username, firstname, hashedPassword); // adds new user to database
                if (!insertNewUser) {
                    res.status(500).json({ error: "Database error. " });
                    return;
                }
                res.json({ message: 'Registration successful.', status: 200 });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Server error." });
        }
    });
});
/*
* Allows user to add sound to his favorites tab
*/
app.post('/add-favorite/:sound', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.headers.authorization && req.params.sound) {
            const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header
            const sound = req.params.sound;
            try {
                const username = yield security_1.default.getUserNameFromToken(token); // get username from token
                if (username) { // if token is valid
                    const userID = yield db.getIDFromUser(username);
                    const soundID = yield db.getIDFromSound(sound);
                    const favoriteExists = yield db.findFavoriteByUserAndSound(userID, soundID);
                    if (favoriteExists) {
                        const addFavorite = yield db.addFavorite(userID, soundID);
                        if (addFavorite) {
                            res.status(200).json({ message: 'Added favorite successfully.' });
                        }
                        else {
                            res.status(401).json({ message: 'Add favorite failed.' });
                        }
                    }
                    else { // favorite already exists in database
                        res.status(403).json({ message: 'Favorite already exists.' });
                    }
                }
                else {
                    res.status(401).json({ message: "Unauthorized to add favorite. Please log in." });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'An error occurred while checking the username.' });
            }
        }
        else {
            res.status(404).json({ message: 'Invalid input parameters. Please try again.' });
        }
    });
});
/*
* Allows user to remove sound from his favorites tab
*/
app.delete('/remove-favorite/:sound', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.authorization) {
        console.log('has token');
        const sound = req.params.sound;
        const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header
        try {
            const username = yield security_1.default.getUserNameFromToken(token); // get username from token
            console.log(username);
            if (username) {
                const userID = yield db.getIDFromUser(username);
                const soundID = yield db.getIDFromSound(sound);
                const removeFavorite = yield db.removeFavorite(userID, soundID);
                if (removeFavorite) {
                    res.status(200).json({ message: "Removed favorite successfully." });
                }
                else {
                    res.status(401).json({ message: 'Remove favorite failed.' });
                }
            }
            else {
                res.status(401).json({ message: "Unauthorized to remove favorite. Please log in." });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred while checking the username.' });
        }
    }
    else {
        res.status(404).json({ message: 'Invalid input parameters. Please try again.' });
    }
}));
/*
* Gets all sounds
*/
app.get('/all-sounds', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allSounds = yield db.getAllSounds();
        res.status(200).json(allSounds);
    }
    catch (error) {
        res.status(500).send("Unable to retrieve sounds from database.");
    }
}));
/*
* Get all favorites
*/
app.get('/all-favorites', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header
        console.log("Token: " + token);
        const username = yield security_1.default.getUserNameFromToken(token); // get username from token
        console.log("Username: " + username);
        const usernameCheck = yield db.findByUsername(username); // checks if username exists
        if (usernameCheck) {
            res.status(403).send("Invalid token or username not found.");
        }
        else {
            try {
                const userID = yield db.getIDFromUser(username);
                const allFavorites = yield db.getAllFavoritesFromUser(userID);
                if (allFavorites) {
                    return res.status(404).json({ error: 'No favorites found for the user.' });
                }
                else {
                    res.status(200).json(allFavorites);
                }
            }
            catch (error) {
                res.status(500).send("Unable to retrieve sounds from database.");
            }
        }
    }
    else {
        res.status(403).send("Invalid token or username not found.");
    }
}));
/*
* Testing message when express app runs
*/
app.listen(3000, () => {
    console.log("Server started on port 3000");
});
