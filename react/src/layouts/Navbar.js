"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./Navbar.scss");
const js_cookie_1 = __importDefault(require("js-cookie"));
const material_1 = require("@mui/material");
const Piano_1 = __importDefault(require("@mui/icons-material/Piano"));
const MidiContext_1 = require("../MidiContext");
const react_hot_toast_1 = require("react-hot-toast");
/**
 * Displays navigation bar with basic site links
 */
const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = (0, react_1.useState)(false);
    const midiContext = (0, react_1.useContext)(MidiContext_1.MidiContext);
    // updates page based on auth status
    (0, react_1.useEffect)(() => {
        if (midiContext && midiContext.currentUser) {
            setIsAuthenticated(true);
        }
        else {
            setIsAuthenticated(false);
        }
    }, []);
    /**
     * Logs the user out and reloads the page
     */
    const handleLogout = () => {
        if (midiContext) {
            js_cookie_1.default.remove('token');
            js_cookie_1.default.remove('name');
            midiContext.setCurrentUser(null);
            react_hot_toast_1.toast.success('Sign out successful.');
        }
    };
    // shows navigation link and user authentication status
    return ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(material_1.AppBar, { color: "primary", sx: { backgroundColor: '#000000', position: 'fixed' }, children: (0, jsx_runtime_1.jsxs)(material_1.Toolbar, { children: [(0, jsx_runtime_1.jsx)(Piano_1.default, {}), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h5", sx: { my: 2, marginRight: '20px' }, children: "MIDI Keys" }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "outlined", children: (0, jsx_runtime_1.jsx)("a", { href: "/", style: { textDecoration: 'none', color: 'inherit', fontSize: '18px' }, children: "Play" }) }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "outlined", children: (0, jsx_runtime_1.jsx)("a", { href: "/connect", style: { textDecoration: 'none', color: 'inherit', fontSize: '18px' }, children: "Connect" }) }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "outlined", children: (0, jsx_runtime_1.jsx)("a", { href: "/about", style: { textDecoration: 'none', color: 'inherit', fontSize: '18px' }, children: "About" }) }), (0, jsx_runtime_1.jsx)("span", { style: { marginLeft: 'auto' }, children: isAuthenticated ? ((0, jsx_runtime_1.jsx)(material_1.Button, { variant: "outlined", onClick: handleLogout, children: "Sign Out" })) : ((0, jsx_runtime_1.jsx)(material_1.Button, { variant: "outlined", sx: { marginLeft: 'auto' }, children: (0, jsx_runtime_1.jsx)("a", { href: "/login", style: { textDecoration: 'none', color: 'white' }, children: "Sign In" }) })) })] }) }) }));
};
exports.default = Navbar;
