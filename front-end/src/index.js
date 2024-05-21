"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
require("./index.scss");
const App_1 = __importDefault(require("./App"));
const MidiContext_1 = require("./MidiContext");
/* Application: MIDI Keys Web Application
* Developed by: Astrid Leighton
* Latest update: April 22nd, 2024
* Start-up: navigate to react directory, type "npm start" (ensure express back-end is working by navigating to express dir and typing "node index.js")*/
// renders application at App.js parent component
react_dom_1.default.render((0, jsx_runtime_1.jsx)(react_1.default.StrictMode, { children: (0, jsx_runtime_1.jsx)(MidiContext_1.MidiProvider, { children: (0, jsx_runtime_1.jsx)(App_1.default, {}) }) }), document.getElementById("root"));
