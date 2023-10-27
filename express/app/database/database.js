const mysql = require('mysql');

class Database {

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

    async deleteSound(connection, username, sound)
    {
        /*return new Promise((resolve, reject) => {
            connection.query("SELECT sounds FROM users WHERE username = ?", [username], (error, results) => {
                if (error) {
                    reject(error);
                } else {

                    try {
                        const soundData = JSON.parse(results[0].sounds);
                        const updatedData = userData.filter(item => item !== sound);

                        connection.query("UPDATE users SET sounds = ? WHERE username = ?", [JSON.stringify(updatedData), username], (updateError, updateResults) => {
                            if (updateError) {
                                reject(updateError);
                            } else {
                                resolve(updateResults);
                            }
                        })
                    } catch (parseError) {
                        reject(parseError);
                    }
                    
                }
            })
        })*/
    }

    async addSound(connection, username, sound)
    {
        /*return new Promise((resolve, reject) => {
            connection.query("SELECT sounds FROM users WHERE username = ?", [username], (error, results) => {
                if (error) {
                    reject(error);
                } else {

                    try {
                        const soundData = JSON.parse(results[0].sounds);
                        const updatedData = userData.filter(item => item !== sound);

                        connection.query("UPDATE users SET sounds = ? WHERE username = ?", [JSON.stringify(updatedData), username], (updateError, updateResults) => {
                            if (updateError) {
                                reject(updateError);
                            } else {
                                resolve(updateResults);
                            }
                        })
                    } catch (parseError) {
                        reject(parseError);
                    }
                    
                }
            })
        })*/
    
    }

    async getAllSoundsFromUser(connection, username)
    {
        return new Promise((resolve, reject) => {
            try {
                connection.query("SELECT sounds FROM users WHERE username = ?", [username], (error, results) => {
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

}

module.exports = new Database();