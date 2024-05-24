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
const react_router_dom_1 = require("react-router-dom");
require("./App.css");
const Connect_1 = __importDefault(require("./pages/Connect"));
const Play_1 = __importDefault(require("./pages/Play"));
const Navbar_1 = __importDefault(require("./layouts/Navbar"));
const About_1 = __importDefault(require("./pages/About"));
const Login_1 = __importDefault(require("./pages/Login"));
const Register_1 = __importDefault(require("./pages/Register"));
const Footer_1 = __importDefault(require("./layouts/Footer"));
const MidiContext_1 = require("./MidiContext");
/**
 * Main component used to handle Tone.js, MIDI device connections, and routing
 * @returns routes
 */
const App = () => {
    const [fullName] = (0, react_1.useState)(null);
    const [connectedDeviceName, setConnectedDeviceName] = (0, react_1.useState)();
    const [inputDevices, setInputDevices] = (0, react_1.useState)([]);
    const [midiStateChanged, setMidiStateChanged] = (0, react_1.useState)(false);
    const midiContext = (0, react_1.useContext)(MidiContext_1.MidiContext);
    /*
    * Runs when component mounts, sets up MIDI access and lists MIDI devices
    */
    (0, react_1.useEffect)(() => {
        /**
         * Sets up MIDI access
         */
        const setUpMIDI = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const midiAccess = yield navigator.requestMIDIAccess();
                midiAccess.addEventListener("statechange", handleStateChange);
                yield listMIDIInputs(midiAccess);
            }
            catch (error) {
                console.error('MIDI Access failed: ', error);
            }
        });
        setUpMIDI();
        // cleanup when component unmounts
        return () => {
            navigator.requestMIDIAccess().then((midiAccess) => {
                midiAccess.removeEventListener('statechange', handleStateChange);
            }).catch((error) => {
                console.error('Error removing event listener', error);
            });
        };
    }, [midiStateChanged]);
    /**
      * Handles MIDI event (connect, disconnect)
      * @param {*} event MIDI change
      */
    const handleStateChange = (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        if (event.port.state === 'disconnected') {
            /* toast.dismiss();
            toast.error('MIDI device disconnected.'); */
            setMidiStateChanged(true);
        }
        else if (event.port.state === 'connected') {
            /* toast.dismiss();
            toast.success('MIDI device connected.'); */
            setMidiStateChanged(true);
            window.location.reload();
        }
    });
    /**
     * Lists MIDI inputs and adds to state
     * @param {*} midiAccess
     * @returns MIDI inputs
     */
    const listMIDIInputs = (midiAccess) => __awaiter(void 0, void 0, void 0, function* () {
        const inputs = Array.from(midiAccess.inputs.values());
        inputs.forEach(input => {
            console.log(input);
        });
        setInputDevices(inputs);
        return inputs;
    });
    /**
     * Changes connected device and updates state
     * @param {*} device MIDI device to connect
     */
    const updateConnectedDevice = (device) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Connected device: ${device.name}`);
    });
    /**
     * Removes connected device and updates state
     * Removes Tone.js input device
     */
    const removeConnectedDevice = () => {
        midiContext === null || midiContext === void 0 ? void 0 : midiContext.setConnectedDevice(null);
        setConnectedDeviceName(null);
        console.log('Disconnecting device.');
        // Tone.Transport.set({ midi: null });
    };
    // returns routes and basic view
    return ((0, jsx_runtime_1.jsxs)("div", { className: "app-container d-flex flex-column", style: { backgroundColor: '#f8f8f8', marginTop: '60px' }, children: [(0, jsx_runtime_1.jsxs)(react_router_dom_1.BrowserRouter, { children: [(0, jsx_runtime_1.jsx)(Navbar_1.default, {}), (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/", element: (0, jsx_runtime_1.jsx)(Play_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/connect", element: (0, jsx_runtime_1.jsx)(Connect_1.default, { updateConnectedDevice: updateConnectedDevice, midiInputDevices: inputDevices }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/about", element: (0, jsx_runtime_1.jsx)(About_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/login", element: (0, jsx_runtime_1.jsx)(Login_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/register", element: (0, jsx_runtime_1.jsx)(Register_1.default, {}) })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "fixed-bottom", children: (0, jsx_runtime_1.jsx)(Footer_1.default, { removeConnectedDevice: removeConnectedDevice }) })] }));
};
exports.default = App;
