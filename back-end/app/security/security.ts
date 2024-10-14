var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const secretKey = "astrid";

/**
 * Used to perform all security operations in user login/registration
 */
export default class Security {

    /**
     * Generates token using JWT and sets expiration for 1 hour
     * @param {*} payload 
     * @returns token if successful, error message if rejection
     */
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
            });
        });
    }

    /**
     * Checks if hashed and plaintext password match in the database
     * @param {*} plainPassword 
     * @param {*} hashedPassword 
     * @returns success message if they match, error on failure to find match
     */
    static async comparePasswords(plainPassword, hashedPassword) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(plainPassword, hashedPassword, (error, result) => {
                if (error)
                {
                    console.error(error);
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        })
    }

    /**
     * Hashes password using bcrypt hash function, set to 10 salt rounds
     * @param {*} plainPassword 
     * @returns hashed password if successful, error message if failure
     */
    static async hashPassword(plainPassword) {

        try {
            const hash = await bcrypt.hash(plainPassword, saltRounds);
            return hash;
        } catch (error) {
            console.error(error);
        }


    }

    /**
     * Verifies token matches with secret key
     * @param {*} token 
     * @returns decoded token on success, error message and null on failure
     */
    static async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, secretKey);
            return decoded;
        } catch (error) {
            console.error('Token verification error.', error);
            return null;
        }
    }

    /**
    * Verifies token matches with secret key
    * @param {*} token 
    * @returns decoded token on success, error message and null on failure
    */
   static async getUserNameFromToken(token): Promise<string> {
       try {
           const decoded = jwt.verify(token, secretKey);
           return decoded.username;
       } catch (error) {
           console.error('Token verification error.', error);
           return null;
       }
   }

}

// export default Security;