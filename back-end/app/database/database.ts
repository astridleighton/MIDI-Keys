import mysql, {Connection} from 'mysql';
import {User} from "../models/User";
import {Sound} from "../models/Sound";

/**
 * Contains all database operations for back-end
 */
class Database {

    private connection: Connection;

    constructor(config: mysql.ConnectionConfig) {
        this.connection = mysql.createConnection(config);
    }

    /**
     * Gets password and name from username in the database
     * @param {*} connection
     * @param {*} username
     * @returns SQL results on success, error message on fail
     */
    public async getUserByUsername(username: string): Promise<User | null> {
        return new Promise((resolve, reject) => {
            this.connection.query("CALL getUserByUsername(?)", [username], (error, results) => {
                if (error) {
                    console.log("Error in findPasswordAndNameByUsername().");
                    reject(error);
                } else {
                    if (results && results[0] != null && results[0][0] != null) {
                        const userData = results[0][0];
                        const user: User = {
                            username: userData.username,
                            password: userData.password,
                            firstname: userData.firstname
                        };
                        resolve(user);
                    } else {
                        console.log("Username does not exist.");
                        resolve(null);
                    }
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
    public async checkUserExists(username): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.connection.query("CALL checkUsernameExists(?)", [username], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    // TODO: astrid ensure this logic works as expected
                    const exists = results && results[0] && results[0][0] && results[0][0].exists === 1;
                    resolve(exists);
                }
            })
        })
    }

    /**
     * Adds a new user to the database
     * @param {*} connection
     * @param {*} username
     * @param {*} firstname
     * @param {*} password
     * @returns new user information on success, error message on fail
     */
    public async addNewUser(user:User): Promise<User> {
        return new Promise((resolve, reject) => {
            this.connection.query("CALL createUser(?,?,?)", [user.username, user.firstname, user.password], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            })
        })
    }

    /**
     * ...
     * @param {*} connection
     * @param {*} username
     * @param {*} sound
     */
    public async removeFavorite(userID, soundID) {
        // TODO: astrid fix return type
        return new Promise((resolve, reject) => {
            this.connection.query("CALL deleteFavorite(?,?)", [userID, soundID], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            })
        })
    }

    /**
     * Adds a sound to a user's favorites
     * @param {*} connection
     * @param {*} username
     * @param {*} sound
     */
    public async addFavorite(userID, soundID) {
        return new Promise((resolve, reject) => {

            this.connection.query("CALL createFavorite(?,?)", [userID, soundID], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            })

        })

    }

    /**
     * Adds a sound to a user's favorites
     * @param {*} connection
     * @param {*} username
     * @param {*} sound
     */
    public async findFavoriteByUserAndSound(userID, soundID) {

        return new Promise((resolve, reject) => {
            // TODO: astrid update return types to be sounds
            this.connection.query("CALL checkFavoriteExists(?,?)", [userID, soundID], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            })

        })

    }

    /**
     * Gets all sounds from the user at specified username
     * @param {*} connection
     * @param {*} username
     * @returns all sounds from user on success, error message on failure
     */
    public async getAllFavoritesFromUser(username) {
        // TODO: astrid change return type to sound
        return new Promise((resolve, reject) => {
            try {
                this.connection.query("CALL getAllFavoritesForUser(?);", [username], (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                })
            } catch (error) {
                reject(error);
            }

        })

    }

    /**
     * Gets all sounds from the user at specified username
     * @param {*} connection
     * @param {*} username
     * @returns all sounds from user on success, error message on failure
     */
    public async getAllSounds() {
        // TODO: astrid have this return as a sound object
        return new Promise((resolve, reject) => {
            try {
                this.connection.query("CALL getAllSounds()", (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });

    }

    /**
     * Gets all rows with matching username
     * @param {*} connection
     * @param {*} username
     * @returns SQL results on success, error message on fail
     */
    public async getIDFromUser(username): Promise<string> {
        return new Promise((resolve, reject) => {
            this.connection.query("CALL getIDFromUser(?)", [username], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    const userID = results[0].ID.toString();
                    resolve(userID);
                }
            })
        })
    }

    /**
     * Gets all rows with matching username
     * @param {*} connection
     * @param {*} username
     * @returns SQL results on success, error message on fail
     */
    public async getIDFromSound(sound): Promise<Sound> {
        return new Promise((resolve, reject) => {
            this.connection.query("CALL getIDFromSound(?)", [sound], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    const sound: Sound = {
                        id: results[0].id,
                        name: results[0].name.toString()
                    }
                    resolve(sound);
                }
            })
        })
    }

}

export default Database;