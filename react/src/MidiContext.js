"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MidiProvider = exports.MidiContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const MidiContext = (0, react_1.createContext)(undefined);
exports.MidiContext = MidiContext;
/**
 * Defines connected device and user context
 * @param {*} children
 * @returns MIDI context for application
 */
const MidiProvider = ({ children }) => {
    const [connectedDevice, setConnectedDevice] = (0, react_1.useState)(null);
    const [currentUser, setCurrentUser] = (0, react_1.useState)(null);
    const [selectedSound, setSelectedSound] = (0, react_1.useState)(null);
    // export values
    const contextInterface = {
        connectedDevice,
        setConnectedDevice,
        currentUser,
        setCurrentUser,
        selectedSound,
        setSelectedSound
    };
    // values that will be utilized by child components
    return ((0, jsx_runtime_1.jsx)(MidiContext.Provider, { value: contextInterface, children: children }));
};
exports.MidiProvider = MidiProvider;
