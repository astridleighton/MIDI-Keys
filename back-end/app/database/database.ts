import mysql, {Connection} from 'mysql';


interface User {
    username: string;
    firstname: string;
    password: string;
}

/**
 * Contains all database operations for back-end
 */
class Database {

    private connection: mysql.Connection;

    constructor(config: mysql.ConnectionConfig) {
        this.connection = mysql.createConnection(config);
    }

    connect(): void {
        this.connection.connect((err: any) => {
            if (err) {
                console.error('Error connecting to the database:', err);
            } else {
                console.log('Connected to the database');
            }
        })
    }

    disconnect(): void {
        this.connection.end();
        console.log("Disconnected from the database.");
    }

    /**
     * Gets password and name from username in the database
     * @param {*} connection
     * @param {*} username
     * @returns SQL results on success, error message on fail
     */
    public async findPasswordAndNameByUsername(username: string): Promise<User | null> {
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
    async findByUsername(username) {
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT * FROM users WHERE username = ?", [username], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
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
    async addNewUser(username, firstname, password) {
        return new Promise((resolve, reject) => {
            this.connection.query("INSERT INTO users (username, firstname, password) VALUES (?, ?, ?)", [username, firstname, password], (error, results) => {
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
    async removeFavorite(userID, soundID) {
        return new Promise((resolve, reject) => {
            this.connection.query("DELETE FROM favorites WHERE userID = ? AND soundID = ?", [userID, soundID], (error, results) => {
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
    async addFavorite(userID, soundID) {
        return new Promise((resolve, reject) => {

            this.connection.query("INSERT INTO favorites (userID, soundID) VALUES (?, ?)", [userID, soundID], (error, results) => {
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
    async findFavoriteByUserAndSound(userID, soundID) {
        return new Promise((resolve, reject) => {

            this.connection.query("SELECT * FROM favorites WHERE userID = ? AND soundID = ?", [userID, soundID], (error, results) => {
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
    async getAllFavoritesFromUser(username) {
        return new Promise((resolve, reject) => {
            try {
                this.connection.query("SELECT sounds.id, sounds.name, sounds.source FROM sounds JOIN favorites ON sounds.id = favorites.soundID WHERE favorites.userID = ?;", [username], (error, results) => {
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
    async getIDFromUser(username) {
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT ID FROM users WHERE username = ?", [username], (error, results) => {
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
    async getIDFromSound(sound) {
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT id FROM sounds WHERE name = ?", [sound], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    const soundID = results[0].id.toString();
                    resolve(soundID);
                }
            })
        })
    }

}

export default Database;