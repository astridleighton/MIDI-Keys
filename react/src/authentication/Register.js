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
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const axios_1 = __importDefault(require("axios"));
const react_router_dom_1 = require("react-router-dom");
const material_1 = require("@mui/material");
require("./Register.scss");
const react_hot_toast_1 = require("react-hot-toast");
/**
 * Allows user to create an account
 */
const Register = () => {
    const [firstname, setFirstName] = (0, react_1.useState)(null);
    const [username, setUsername] = (0, react_1.useState)(null);
    const [password, setPassword] = (0, react_1.useState)(null);
    const [firstNameMessage, /* setFirstNameMessage */] = (0, react_1.useState)("");
    const [usernameMessage, setUsernameMessage] = (0, react_1.useState)("");
    const [passwordMessage, setPasswordMessage] = (0, react_1.useState)("");
    const [isFormValid, setIsFormValid] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)('');
    const navigate = (0, react_router_dom_1.useNavigate)();
    /**
     * Updates first name
     * @param {*} event
     */
    const handleFirstNameChange = (event) => {
        event.preventDefault();
        const newFirstName = event.target.value;
        setFirstName(newFirstName);
    };
    /**
     * Updates username
     * @param {*} event
     */
    const handleUsernameChange = (event) => {
        event.preventDefault();
        const newUsername = event.target.value;
        setUsername(newUsername);
    };
    /**
     * Updates password and allows register if values are not blank
     * @param {*} event
     */
    const handlePasswordChange = (event) => {
        event.preventDefault();
        const newPassword = event.target.value;
        setPassword(newPassword);
        setIsFormValid(firstname != null && username != null && newPassword != null);
    };
    /**
     * Passes registration credentials to registration function
     * @param {*} event
     */
    const handleSubmit = (event) => __awaiter(void 0, void 0, void 0, function* () {
        if (event) {
            event.preventDefault();
        }
        const usernameValid = yield validateUsername(username);
        const passwordValid = yield validatePassword(password);
        if (usernameValid && passwordValid) {
            try {
                yield processRegister({ username, firstname, password });
            }
            catch (error) {
                console.log("Registration failed: ", error);
            }
            finally {
                setFirstName(null);
                setUsername(null);
                setPassword(null);
                setIsFormValid(false);
            }
        }
    });
    /**
     * Ensures username is not blank
     * @param {*} username
     * @returns boolean value for error message
     */
    const validateUsername = (user) => {
        if (user.length === 0) {
            setUsernameMessage('Username cannot be left blank');
            return false; // username is not valid
        }
        return true; // username is valid
    };
    /**
     * Checks if password meets complexity and security requirements
     * @param {*} password
     * @returns boolean value for error message
     */
    const validatePassword = (pass) => {
        if (pass.length < 8) {
            setPasswordMessage('Password must be at least 8 characters long');
            return false;
        }
        else if (!/\d/.test(pass)) {
            setPasswordMessage('Password must contain at least one number');
            return false;
        }
        else {
            setPasswordMessage(''); // Reset message if password is valid
            return true;
        }
    };
    /**
     * Sends registration credentials to back-end
     * @param {*} registerCredentials
     */
    const processRegister = (registerCredentials) => __awaiter(void 0, void 0, void 0, function* () {
        yield axios_1.default.post(`http://localhost:3000/register`, registerCredentials)
            .then((result) => {
            console.log(result);
            react_hot_toast_1.toast.success('Registration successful. Please log in with your current credentials.');
            navigate('/login');
        }).catch((error) => {
            if (error.response.status === 403) {
                setError("Username already exists. Please choose another one.");
            }
            else if (error.response.status === 500) {
                setError("Network error. Please try again.");
            }
            else {
                setError("An unknown error occurred. Please try again.");
            }
        });
    });
    /**
     * Displays registration form
     */
    return ((0, jsx_runtime_1.jsx)("div", { className: "register-container", children: (0, jsx_runtime_1.jsxs)(material_1.Container, { maxWidth: "xs", children: [(0, jsx_runtime_1.jsx)("div", { className: "register-header", children: (0, jsx_runtime_1.jsx)("h1", { children: "Create An Account" }) }), (0, jsx_runtime_1.jsxs)(material_1.Box, { component: "form", onSubmit: handleSubmit, noValidate: true, sx: {
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }, children: [error && (0, jsx_runtime_1.jsx)(material_1.Alert, { severity: "error", children: error }), (0, jsx_runtime_1.jsx)(material_1.TextField, { margin: "normal", required: true, fullWidth: true, label: "First Name", error: !!firstNameMessage, helperText: firstNameMessage, value: firstname, onChange: handleFirstNameChange, autoComplete: "off", focused: true, sx: {
                                '& input': {
                                    color: 'white'
                                }
                            } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { margin: "normal", required: true, fullWidth: true, label: "Username", value: username, error: !!usernameMessage, helperText: usernameMessage, onChange: handleUsernameChange, autoComplete: "off", focused: true, sx: {
                                '& input': {
                                    color: 'white'
                                }
                            } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { margin: "normal", required: true, fullWidth: true, label: "Password", type: "password", value: password, error: !!passwordMessage, helperText: passwordMessage // Show password message if provided
                            , onChange: handlePasswordChange, autoComplete: "off", focused: true, sx: {
                                '& input': {
                                    color: 'white'
                                }
                            } }), (0, jsx_runtime_1.jsx)(material_1.Container, { sx: {
                                margin: '20px'
                            }, children: (0, jsx_runtime_1.jsx)(material_1.Button, { type: "submit", fullWidth: true, variant: "contained", onClick: handleSubmit, disabled: !isFormValid, sx: {
                                    backgroundColor: 'black',
                                    color: 'white',
                                    padding: '10px',
                                }, children: "Register" }) }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: ["Already have an account?", (0, jsx_runtime_1.jsx)("a", { href: "/login", style: {
                                        textDecoration: 'underline',
                                        color: 'inherit',
                                        fontWeight: 'bold',
                                        padding: '5px'
                                    }, children: "Sign In" })] })] })] }) }));
};
exports.default = Register;
