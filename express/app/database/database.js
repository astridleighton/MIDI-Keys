

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

}

module.exports = new Database();