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
    return ((0, jsx_runtime_1.jsx)("div", { className: "piano-container", children: (0, jsx_runtime_1.jsxs)("div", { className: "piano-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "white-key" + (isKeyPlayed("C4") ? " white-key-played" : ""), children: "A" }), " ", (0, jsx_runtime_1.jsx)("div", { className: "black-key" + ((isKeyPlayed("Db4") || isKeyPlayed("C#4")) ? " black-key-played" : ""), children: "W" }), " ", (0, jsx_runtime_1.jsx)("div", { className: "white-key" + (isKeyPlayed("D4") ? " white-key-played" : ""), children: "S" }), " ", (0, jsx_runtime_1.jsx)("div", { className: "black-key" + ((isKeyPlayed("Eb4") || isKeyPlayed("D#4")) ? " black-key-played" : ""), children: "E" }), " ", (0, jsx_runtime_1.jsx)("div", { className: "white-key" + (isKeyPlayed("E4") ? " white-key-played" : ""), children: "D" }), " ", (0, jsx_runtime_1.jsx)("div", { className: "white-key" + (isKeyPlayed("F4") ? " white-key-played" : ""), children: "F" }), " ", (0, jsx_runtime_1.jsx)("div", { className: "black-key" + ((isKeyPlayed("Gb4") || isKeyPlayed("F#4")) ? " black-key-played" : ""), children: "T" }), " ", (0, jsx_runtime_1.jsx)("div", { className: "white-key" + (isKeyPlayed("G4") ? " white-key-played" : ""), children: "G" }), " ", (0, jsx_runtime_1.jsx)("div", { className: "black-key" + ((isKeyPlayed("Ab4") || isKeyPlayed("G#4")) ? " black-key-played" : ""), children: "Y" }), " ", (0, jsx_runtime_1.jsx)("div", { className: "white-key" + (isKeyPlayed("A4") ? " white-key-played" : ""), children: "H" }), " ", (0, jsx_runtime_1.jsx)("div", { className: "black-key" + ((isKeyPlayed("Bb4") || isKeyPlayed("A#4")) ? " black-key-played" : ""), children: "U" }), " ", (0, jsx_runtime_1.jsx)("div", { className: "white-key" + (isKeyPlayed("B4") ? " white-key-played" : ""), children: "J" }), " ", (0, jsx_runtime_1.jsx)("div", { className: "white-key" + (isKeyPlayed("C5") ? " white-key-played" : ""), children: "K" }), " ", (0, jsx_runtime_1.jsx)("div", { className: "black-key" + ((isKeyPlayed("Db5") || isKeyPlayed("C#5")) ? " black-key-played" : "") }), " ", (0, jsx_runtime_1.jsx)("div", { className: "white-key" + (isKeyPlayed("D5") ? " white-key-played" : "") }), " ", (0, jsx_runtime_1.jsx)("div", { className: "black-key" + ((isKeyPlayed("Eb5") || isKeyPlayed("D#5")) ? " black-key-played" : "") }), " ", (0, jsx_runtime_1.jsx)("div", { className: "white-key" + (isKeyPlayed("E5") ? " white-key-played" : "") }), " ", (0, jsx_runtime_1.jsx)("div", { className: "white-key" + (isKeyPlayed("F5") ? " white-key-played" : "") }), " ", (0, jsx_runtime_1.jsx)("div", { className: "black-key" + ((isKeyPlayed("Gb5") || isKeyPlayed("F#5")) ? " black-key-played" : "") }), " ", (0, jsx_runtime_1.jsx)("div", { className: "white-key" + (isKeyPlayed("G5") ? " white-key-played" : "") }), " ", (0, jsx_runtime_1.jsx)("div", { className: "black-key" + ((isKeyPlayed("Ab5") || isKeyPlayed("G#5")) ? " black-key-played" : "") }), " ", (0, jsx_runtime_1.jsx)("div", { className: "white-key" + (isKeyPlayed("A5") ? " white-key-played" : "") }), " ", (0, jsx_runtime_1.jsx)("div", { className: "black-key" + ((isKeyPlayed("Bb5") || isKeyPlayed("A#5")) ? " black-key-played" : "") }), " ", (0, jsx_runtime_1.jsx)("div", { className: "white-key" + (isKeyPlayed("B5") ? " white-key-played" : "") }), " ", (0, jsx_runtime_1.jsx)("div", { className: "white-key" + (isKeyPlayed("C6") ? " white-key-played" : "") }), " "] }) }));
};
exports.default = Piano;
