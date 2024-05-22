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
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const material_1 = require("@mui/material");
require("./Login.scss");
const MidiContext_1 = require("../MidiContext");
const Auth_1 = require("./Auth");
// import {toast, Toaster} from 'react-hot-toast';
/**
 * Allows user to log in to account
 */
const Login = () => {
    const [username, setUsername] = (0, react_1.useState)(null);
    const [password, setPassword] = (0, react_1.useState)(null);
    const [firstName, setFirstName] = (0, react_1.useState)(null);
    const [submitted, setSubmitted] = (0, react_1.useState)(false);
    const [isFormValid, setIsFormValid] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)('');
    const navigate = (0, react_router_dom_1.useNavigate)();
    const midiContext = (0, react_1.useContext)(MidiContext_1.MidiContext);
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
     * Updates password and allows login if values are not blank
     */
    const handlePasswordChange = (event) => {
        event.preventDefault();
        const newPassword = event.target.value;
        setPassword(newPassword);
        setIsFormValid(username !== '' && newPassword !== null);
    };
    /**
     * Passes login credentials to login function
     * @param {*} event
     */
    const handleSubmit = (event) => __awaiter(void 0, void 0, void 0, function* () {
        if (event) {
            event.preventDefault();
        }
        setSubmitted(true);
        try {
            yield processLogin({ username, password });
        }
        catch (error) {
            console.log("Login failed:", error);
        }
        finally {
            setUsername(null);
            setPassword(null);
            setIsFormValid(false);
        }
    });
    /**
     * Sends login credentials to the back-end
     * Sets sessions cookies
     * @param {*} loginCredentials
     */
    const processLogin = (loginCredentials) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, Auth_1.signIn)(loginCredentials);
        if (result.isSuccess) {
            /* setFirstName(name);
            midiContext.setCurrentUser(name); */
            navigate('/');
            // toast.success('Login successful.');
        }
        else {
            setError(result.message);
        }
        /* TODO: may need this for a 401 error:
                setUsername(null);
                setPassword(null);
                setSubmitted(false);
        */
    });
    // returns login view
    return ((0, jsx_runtime_1.jsx)("div", { className: "login-container", children: (0, jsx_runtime_1.jsxs)(material_1.Container, { maxWidth: "xs", children: [(0, jsx_runtime_1.jsx)("div", { className: "login-header", children: (0, jsx_runtime_1.jsx)("h1", { children: "Sign In" }) }), (0, jsx_runtime_1.jsxs)(material_1.Box, { component: "form", onSubmit: handleSubmit, noValidate: true, sx: {
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        color: 'white'
                    }, children: [error &&
                            (0, jsx_runtime_1.jsx)(material_1.Alert, { severity: "error", children: error }), (0, jsx_runtime_1.jsx)(material_1.TextField, { margin: "normal", required: true, fullWidth: true, label: "Username", value: username, error: submitted && !username, helperText: submitted && !username ? 'Username is required ' : '', onChange: handleUsernameChange, focused: true, autoComplete: 'off', variant: "filled", sx: {
                                '& input': {
                                    color: 'white'
                                }
                            } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { margin: "normal", required: true, fullWidth: true, label: "Password", type: "password", value: password, error: submitted && !password, helperText: submitted && !password ? 'Password is required ' : '', onChange: handlePasswordChange, autoComplete: 'off', variant: 'filled', focused: true, sx: {
                                '& input': {
                                    color: 'white'
                                }
                            } }), (0, jsx_runtime_1.jsx)(material_1.Container, { sx: {
                                margin: '20px'
                            }, children: (0, jsx_runtime_1.jsx)(material_1.Button, { type: "submit", fullWidth: true, variant: "contained", onClick: handleSubmit, disabled: !isFormValid, sx: {
                                    backgroundColor: 'black',
                                    color: 'white',
                                    padding: '10px'
                                }, children: "Sign In" }) }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: ["Don't have an account?", (0, jsx_runtime_1.jsx)("a", { href: "/register", style: {
                                        textDecoration: 'underline',
                                        color: 'inherit',
                                        fontWeight: 'bold',
                                        padding: '5px',
                                    }, children: "Sign Up" })] })] })] }) }));
};
exports.default = Login;
