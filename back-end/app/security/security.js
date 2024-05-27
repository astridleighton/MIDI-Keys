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
Object.defineProperty(exports, "__esModule", { value: true });
// bcrypt
var bcrypt = require('bcrypt');
const saltRounds = 10;
// jwt
const jwt = require('jsonwebtoken');
const secretKey = "astrid";
/**
 * Used to perform all security operations in user login/registration
 */
class Security {
    /**
     * Generates token using JWT and sets expiration for 1 hour
     * @param {*} payload
     * @returns token if successful, error message if rejection
     */
    static generateToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                jwt.sign(payload, secretKey, { expiresIn: '1h' }, (err, token) => {
                    if (err) {
                        console.error(err);
                        reject('Failed to generate token');
                    }
                    else {
                        resolve(token);
                    }
                });
            });
        });
    }
    /**
     * Checks if hashed and plaintext password match in the database
     * @param {*} plainPassword
     * @param {*} hashedPassword
     * @returns success message if they match, error on failure to find match
     */
    static comparePasswords(plainPassword, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                bcrypt.compare(plainPassword, hashedPassword, (error, result) => {
                    if (error) {
                        console.error(error);
                        reject(error);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
        });
    }
    /**
     * Hashes password using bcrypt hash function, set to 10 salt rounds
     * @param {*} plainPassword
     * @returns hashed password if successful, error message if failure
     */
    static hashPassword(plainPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hash = yield bcrypt.hash(plainPassword, saltRounds);
                return hash;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    /**
     * Verifies token matches with secret key
     * @param {*} token
     * @returns decoded token on success, error message and null on failure
     */
    static verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jwt.verify(token, secretKey);
                return decoded;
            }
            catch (error) {
                console.error('Token verification error.', error);
                return null;
            }
        });
    }
    /**
    * Verifies token matches with secret key
    * @param {*} token
    * @returns decoded token on success, error message and null on failure
    */
    static getUserNameFromToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jwt.verify(token, secretKey);
                console.log("test");
                return decoded.username;
            }
            catch (error) {
                console.error('Token verification error.', error);
                return null;
            }
        });
    }
}
exports.default = Security;
