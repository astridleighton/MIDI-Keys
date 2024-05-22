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
exports.signUp = exports.signIn = void 0;
const axios_1 = __importDefault(require("axios"));
const js_cookie_1 = __importDefault(require("js-cookie"));
const signIn = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield axios_1.default.post(`http://localhost:3000/login`, credentials);
        if (result.data && result.data.status === 200) {
            const token = result.data.token;
            const name = result.data.firstName;
            if (token && name) {
                js_cookie_1.default.set('token', token, { expires: 1 });
                js_cookie_1.default.set('name', name, { expires: 1 });
                return { isSuccess: true, message: "Login successful." };
            }
            else {
                return { isSuccess: false, message: "An error occurred during the login. Please try again." };
            }
        }
        else {
            return { isSuccess: false, message: "An error occurred during the login. Please try again." };
        }
    }
    catch (error) {
        if (error.response && error.response.status === 401) {
            return { isSuccess: false, message: "Invalid login credentials. Please try again." };
        }
        else if (error.response && error.response.status === 500) {
            return { isSuccess: false, message: "A network error occurred. Please try again." };
        }
        else {
            return { isSuccess: false, message: "An unknown error occurred. Please try again." };
        }
    }
});
exports.signIn = signIn;
const signUp = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield axios_1.default.post(`http://localhost:3000/register`, credentials);
        return { isSuccess: true, message: "Registration successful. Please log in with your current credentials." };
    }
    catch (error) {
        if (error.response && error.response.status === 403) {
            return { isSuccess: false, message: "Username already exists. Please choose another one." };
        }
        else if (error.response && error.response.status === 500) {
            return { isSuccess: false, message: "Network error. Please try again." };
        }
        else {
            return { isSuccess: false, message: "An unknown error occurred. Please try again." };
        }
    }
});
exports.signUp = signUp;
