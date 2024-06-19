"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./Piano.scss");
/**
 * Defines the on-screen keyboard view with black and white keys
 * @param {*} notes
 * @returns piano view
 */
const Piano = ({ notes }) => {
    (0, react_1.useEffect)(() => {
        // re-renders when notes is updated
    }, [notes]);
    // determines if a note is played to render component with specified key
    const isKeyPlayed = (key) => {
        if (notes) {
            return notes.includes(key);
        }
    };
    // piano view
    return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "piano-container" }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "piano-content" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "white-key" + (isKeyPlayed("C3") ? " white-key-played" : "") }, { children: "A" })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "black-key" + ((isKeyPlayed("Db3") || isKeyPlayed("C#3")) ? " black-key-played" : "") }, { children: "W" })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "white-key" + (isKeyPlayed("D3") ? " white-key-played" : "") }, { children: "S" })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "black-key" + ((isKeyPlayed("Eb3") || isKeyPlayed("D#3")) ? " black-key-played" : "") }, { children: "E" })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "white-key" + (isKeyPlayed("E3") ? " white-key-played" : "") }, { children: "D" })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "white-key" + (isKeyPlayed("F3") ? " white-key-played" : "") }, { children: "F" })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "black-key" + ((isKeyPlayed("Gb3") || isKeyPlayed("F#3")) ? " black-key-played" : "") }, { children: "T" })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "white-key" + (isKeyPlayed("G3") ? " white-key-played" : "") }, { children: "G" })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "black-key" + ((isKeyPlayed("Ab3") || isKeyPlayed("G#3")) ? " black-key-played" : "") }, { children: "Y" })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "white-key" + (isKeyPlayed("A3") ? " white-key-played" : "") }, { children: "H" })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "black-key" + ((isKeyPlayed("Bb3") || isKeyPlayed("A#3")) ? " black-key-played" : "") }, { children: "U" })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "white-key" + (isKeyPlayed("B3") ? " white-key-played" : "") }, { children: "J" })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "white-key" + (isKeyPlayed("C4") ? " white-key-played" : "") }, { children: "K" })), (0, jsx_runtime_1.jsx)("div", { className: "black-key" + ((isKeyPlayed("Db4") || isKeyPlayed("C#4")) ? " black-key-played" : "") }), (0, jsx_runtime_1.jsx)("div", { className: "white-key" + (isKeyPlayed("D4") ? " white-key-played" : "") }), (0, jsx_runtime_1.jsx)("div", { className: "black-key" + ((isKeyPlayed("Eb4") || isKeyPlayed("D#4")) ? " black-key-played" : "") }), (0, jsx_runtime_1.jsx)("div", { className: "white-key" + (isKeyPlayed("E4") ? " white-key-played" : "") }), (0, jsx_runtime_1.jsx)("div", { className: "white-key" + (isKeyPlayed("F4") ? " white-key-played" : "") }), (0, jsx_runtime_1.jsx)("div", { className: "black-key" + ((isKeyPlayed("Gb4") || isKeyPlayed("F#4")) ? " black-key-played" : "") }), (0, jsx_runtime_1.jsx)("div", { className: "white-key" + (isKeyPlayed("G4") ? " white-key-played" : "") }), (0, jsx_runtime_1.jsx)("div", { className: "black-key" + ((isKeyPlayed("Ab4") || isKeyPlayed("G#4")) ? " black-key-played" : "") }), (0, jsx_runtime_1.jsx)("div", { className: "white-key" + (isKeyPlayed("A4") ? " white-key-played" : "") }), (0, jsx_runtime_1.jsx)("div", { className: "black-key" + ((isKeyPlayed("Bb4") || isKeyPlayed("A#4")) ? " black-key-played" : "") }), (0, jsx_runtime_1.jsx)("div", { className: "white-key" + (isKeyPlayed("B4") ? " white-key-played" : "") }), (0, jsx_runtime_1.jsx)("div", { className: "white-key" + (isKeyPlayed("C5") ? " white-key-played" : "") })] })) })));
};
exports.default = Piano;
