"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_1 = require("@mui/material");
require("./Footer.scss");
const MidiContext_1 = require("../MidiContext");
/**
 * Displays connected device and allows user to remove it
 */
const Footer = ({ removeConnectedDevice }) => {
    const midiContext = (0, react_1.useContext)(MidiContext_1.MidiContext);
    if (!midiContext) {
        return null;
    }
    /**
     * Uses parent function to remove connected device
     */
    const removeDevice = () => {
        removeConnectedDevice();
    };
    // displays footer view and shows connected device
    return ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(material_1.BottomNavigation, { component: "footer", sx: { position: 'fixed', width: '100%', bottom: 0 }, className: "footer", children: (0, jsx_runtime_1.jsx)(material_1.Toolbar, { children: (0, jsx_runtime_1.jsx)("div", { className: "container text-center p-3", children: (0, jsx_runtime_1.jsx)("span", { className: "text-light", children: midiContext.connectedDevice ? ((0, jsx_runtime_1.jsxs)("span", { className: "connectedDevice", children: ["Connected Device:\u00A0V49 Keyboard\u00A0", (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "outlined", onClick: removeDevice, sx: { marginLeft: '10px' }, children: "Disconnect" })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "connectedDevice", children: "No device connected." })) }) }) }) }) }));
};
exports.default = Footer;
