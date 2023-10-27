// bcrypt
var bcrypt = require('bcrypt');
const saltRounds = 10;

// jwt
const jwt = require('jsonwebtoken');
const secretKey = "astrid";

class Security {

    static async generateToken(payload)
    {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, secretKey, { expiresIn: '1h' }, (err, token) => {
                if (err) {
                    console.error(err);
                    reject('Failed to generate token');
                } else {
                    resolve(token);
                }
            })
        })
    }

    static async comparePasswords(plainPassword, hashedPassword) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(plainPassword, hashedPassword, (error, result) => {
                if (error)
                {
                    console.error(error);
                    reject(error);
                    console.log("test");
                } else {
                    resolve(result);
                }
            })
        })
    }

    static async hashPassword(plainPassword) {

        try {
            const hash = await bcrypt.hash(plainPassword, saltRounds);
            return hash;
        } catch (error) {
            console.error(error);
        }

    }

}

module.exports = Security;