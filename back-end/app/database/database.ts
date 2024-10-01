import mysql from 'mysql';

interface User {
    firstname: string;
    password: string;
}

// Define the database configuration directly in this file
const dbConfig = {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'capstone'
};

/**
 * Contains all database operations for back-end
 */
class Database {

    private connection: mysql.Connection;

    constructor() {
        this.connection = mysql.createConnection(dbConfig);
    }

    connect(): void {
        this.connection.connect((err:any) => {
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
    async findPasswordAndNameByUsername(username: string): Promise<User | null>
    {
        return new Promise((resolve, reject) => {
            // TODO: combine this into a single method that returns the user object instead of having separate functions that return parts of the user
            this.connection.query("SELECT password, firstname FROM users WHERE username = ?", [username], (error, results) => {
                if (error) {
                    return reject(error);
                } 
                // Ensure the result is an array before checking its length
                if (!Array.isArray(results) || results.length === 0) {
                    return resolve(null); // Resolve with null if no user is found
                }

                // Assuming results[0] has the password and firstname fields
                const user = {
                    firs: results[0].password,
                    firstname: results[0].firstname,
                };

                return user;
                
            })
        })
    }

    /**
     * Gets all rows with matching username
     * @param {*} connection 
     * @param {*} username 
     * @returns SQL results on success, error message on fail
     */
    async findByUsername(username)
    {
        // TODO: combine this to return a sound object and then go from there instead of having a separate call for just the ID and just the username
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
            const query : String = `CALL createUser('${username}', '${firstname}', '${password}')`;
    
            this.connection.query(query, (error, results) => {
                if (error) {
                    reject(error); // Reject on error
                } else {
                    resolve(results); // Resolve with the results
                }
            });
        });
    }

    /**
     * ...
     * @param {*} connection 
     * @param {*} username 
     * @param {*} sound 
     */
    async removeFavorite(userID, soundID)
    {
        return new Promise((resolve, reject) => {
            const query : String = `CALL deleteFavorite('${userID}', '${soundID}')`;
            this.connection.query(query, (error, results) => {
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
    async addFavorite(userID, soundID)
    {
        return new Promise((resolve, reject) => {

            const query : String = `CALL createFavorite('${userID}', '${soundID}')`;
            this.connection.query(query, (error, results) => {
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
    async findFavoriteByUserAndSound(userID, soundID)
    {
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
    async getAllFavoritesFromUser(username)
    {
        // TODO: this should return an arraylist of favorite sounds
        return new Promise((resolve, reject) => {
            try {
                const query : String = `CALL getAllFavoritesForUser('${username}')`;
                this.connection.query(query, (error, results) => {
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
     async getAllSounds()
     {
        // TODO: this should return an arraylist of sounds or json
         return new Promise((resolve, reject) => {
             try {
                const query : String = "CALL getAllSounds()";
                 this.connection.query(query, (error, results) => {
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
    async getIDFromUser(username)
    {        
        return new Promise((resolve, reject) => {
            const query : String = `CALL getIDFromUser('${username}')`;
            this.connection.query(query, (error, results) => {
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
    async getIDFromSound(sound)
    {
        return new Promise((resolve, reject) => {
            const query : String = `CALL getIDFromSound('${sound}')`;
            this.connection.query(query, (error, results) => {
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