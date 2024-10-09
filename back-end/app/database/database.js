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
const mysql_1 = __importDefault(require("mysql"));
/**
 * Contains all database operations for back-end
 */
class Database {
    constructor(config) {
        this.connection = mysql_1.default.createConnection(config);
    }
    connect() {
        this.connection.connect((err) => {
            if (err) {
                console.error('Error connecting to the database:', err);
            }
            else {
                console.log('Connected to the database');
            }
        });
    }
    disconnect() {
        this.connection.end();
        console.log("Disconnected from the database.");
    }
    /**
     * Gets password and name from username in the database
     * @param {*} connection
     * @param {*} username
     * @returns SQL results on success, error message on fail
     */
    findPasswordAndNameByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.connection.query("CALL getUserByUsername(?)", [username], (error, results) => {
                    if (error) {
                        console.log("Error in findPasswordAndNameByUsername().");
                        reject(error);
                    }
                    else {
                        if (results && results[0] != null && results[0][0] != null) {
                            const userData = results[0][0];
                            const user = {
                                username: userData.username,
                                password: userData.password,
                                firstname: userData.firstname
                            };
                            resolve(user);
                        }
                        else {
                            console.log("Username does not exist.");
                            resolve(null);
                        }
                    }
                });
            });
        });
    }
    /**
     * Gets all rows with matching username
     * @param {*} connection
     * @param {*} username
     * @returns SQL results on success, error message on fail
     */
    findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.connection.query("SELECT * FROM users WHERE username = ?", [username], (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(results);
                    }
                });
            });
        });
    }
    /**
     * Adds a new user to the database
     * @param {*} connection
     * @param {*} username
     * @param {*} firstname
     * @param {*} password
     * @returns new user information on success, error message on fail
     */
    addNewUser(username, firstname, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.connection.query("INSERT INTO users (username, firstname, password) VALUES (?, ?, ?)", [username, firstname, password], (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(results);
                    }
                });
            });
        });
    }
    /**
     * ...
     * @param {*} connection
     * @param {*} username
     * @param {*} sound
     */
    removeFavorite(userID, soundID) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.connection.query("DELETE FROM favorites WHERE userID = ? AND soundID = ?", [userID, soundID], (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(results);
                    }
                });
            });
        });
    }
    /**
     * Adds a sound to a user's favorites
     * @param {*} connection
     * @param {*} username
     * @param {*} sound
     */
    addFavorite(userID, soundID) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.connection.query("INSERT INTO favorites (userID, soundID) VALUES (?, ?)", [userID, soundID], (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(results);
                    }
                });
            });
        });
    }
    /**
     * Adds a sound to a user's favorites
     * @param {*} connection
     * @param {*} username
     * @param {*} sound
     */
    findFavoriteByUserAndSound(userID, soundID) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.connection.query("SELECT * FROM favorites WHERE userID = ? AND soundID = ?", [userID, soundID], (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(results);
                    }
                });
            });
        });
    }
    /**
     * Gets all sounds from the user at specified username
     * @param {*} connection
     * @param {*} username
     * @returns all sounds from user on success, error message on failure
     */
    getAllFavoritesFromUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    this.connection.query("SELECT sounds.id, sounds.name, sounds.source FROM sounds JOIN favorites ON sounds.id = favorites.soundID WHERE favorites.userID = ?;", [username], (error, results) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            resolve(results);
                        }
                    });
                }
                catch (error) {
                    reject(error);
                }
            });
        });
    }
    /**
     * Gets all sounds from the user at specified username
     * @param {*} connection
     * @param {*} username
     * @returns all sounds from user on success, error message on failure
     */
    getAllSounds() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: astrid have this return as a sound object
            return new Promise((resolve, reject) => {
                try {
                    this.connection.query("CALL getAllSounds()", (error, results) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            resolve(results);
                        }
                    });
                }
                catch (error) {
                    reject(error);
                }
            });
        });
    }
    /**
     * Gets all rows with matching username
     * @param {*} connection
     * @param {*} username
     * @returns SQL results on success, error message on fail
     */
    getIDFromUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.connection.query("SELECT ID FROM users WHERE username = ?", [username], (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        const userID = results[0].ID.toString();
                        resolve(userID);
                    }
                });
            });
        });
    }
    /**
     * Gets all rows with matching username
     * @param {*} connection
     * @param {*} username
     * @returns SQL results on success, error message on fail
     */
    getIDFromSound(sound) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.connection.query("SELECT id FROM sounds WHERE name = ?", [sound], (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        const soundID = results[0].id.toString();
                        resolve(soundID);
                    }
                });
            });
        });
    }
}
exports.default = Database;
