const mysql = require('mysql');

/**
 * Contains all database operations for back-end
 */
class Database {

    /**
     * Gets password and name from username in the database
     * @param {*} connection 
     * @param {*} username 
     * @returns SQL results on success, error message on fail
     */
    async findPasswordAndNameByUsername(connection, username)
    {
        return new Promise((resolve, reject) => {
            connection.query("SELECT password, firstname FROM users WHERE username = ?", [username], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
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
    async findByUsername(connection, username)
    {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM users WHERE username = ?", [username], (error, results) => {
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
    async addNewUser(connection, username, firstname, password)
    {
        return new Promise((resolve, reject) => {
            connection.query("INSERT INTO users (username, firstname, password) VALUES (?, ?, ?)", [username, firstname, password], (error, results) => {
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
    async removeFavorite(connection, userID, soundID)
    {
        return new Promise((resolve, reject) => {
            connection.query("DELETE FROM favorites WHERE userID = ? AND soundID = ?", [userID, soundID], (error, results) => {
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
    async addFavorite(connection, userID, soundID)
    {
        return new Promise((resolve, reject) => {

            connection.query("INSERT INTO favorites (userID, soundID) VALUES (?, ?)", [userID, soundID], (error, results) => {
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
    async getAllSoundsFromUser(connection, username)
    {
        return new Promise((resolve, reject) => {
            try {
                connection.query("SELECT sounds FROM favorites WHERE userID = ?", [username], (error, results) => {
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
     async getAllSounds(connection)
     {
         return new Promise((resolve, reject) => {
             try {
                 connection.query("SELECT * FROM sounds", (error, results) => {
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
     * Gets all rows with matching username
     * @param {*} connection 
     * @param {*} username 
     * @returns SQL results on success, error message on fail
     */
    async getIDFromUser(connection, username)
    {
        return new Promise((resolve, reject) => {
            connection.query("SELECT ID FROM users WHERE username = ?", [username], (error, results) => {
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
    async getIDFromSound(connection, sound)
    {
        return new Promise((resolve, reject) => {
            connection.query("SELECT id FROM sounds WHERE name = ?", [sound], (error, results) => {
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

module.exports = new Database();