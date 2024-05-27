"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_1 = require("@mui/material");
const MidiContext_1 = require("../MidiContext");
// import {toast, Toaster} from 'react-hot-toast';
require("./Connect.scss");
/**
 * Allows the user to connect to a selected device
 */
/**
 * Allows the user to view available MIDI devices and connect to a selected device
 * @param {*} param
 * @returns
 */
const Connect = ({ updateConnectedDevice, midiInputDevices }) => {
    const [selectedDevice, setSelectedDevice] = (0, react_1.useState)(null);
    const connectedDevice = (0, react_1.useContext)(MidiContext_1.MidiContext);
    /**
     * Updates state based on selected device
     * @param {*} device selected device
     */
    const handleDeviceSelect = (device) => {
        setSelectedDevice(device);
    };
    /**
     * Connects to selected device using prop function from App
     */
    const handleDeviceConnect = () => {
        updateConnectedDevice(selectedDevice);
        // toast.success('Updated connected device.');
    };
    // returns connect view
    return ((0, jsx_runtime_1.jsxs)("div", { className: "connect-container", children: [(0, jsx_runtime_1.jsx)("div", { className: "connect-header", children: (0, jsx_runtime_1.jsx)("h1", { className: "connect-title", children: "Connect" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "connect-content", children: [(0, jsx_runtime_1.jsx)(material_1.FormLabel, { sx: { color: 'white', padding: '20px' }, children: "Select input MIDI device:" }), (0, jsx_runtime_1.jsxs)(material_1.RadioGroup, { "aria-label": "devices", name: "device-group", defaultValue: connectedDevice, onChange: (e) => handleDeviceSelect(midiInputDevices[e.target.value]), children: [(0, jsx_runtime_1.jsx)(material_1.List, { sx: {
                                    '& .MuiListItem-root': {
                                        borderRadius: '8px',
                                        backgroundColor: 'black',
                                        marginBottom: '8px',
                                        color: 'white'
                                    },
                                    '& .MuiRadio-root': {
                                        color: 'grey', // Radio button color
                                    }
                                }, children: midiInputDevices && midiInputDevices.length ? (midiInputDevices.map((device, index) => ((0, jsx_runtime_1.jsx)(material_1.ListItem, { sx: { color: "#FFF" }, children: (0, jsx_runtime_1.jsx)(material_1.FormControlLabel, { value: index, control: (0, jsx_runtime_1.jsx)(material_1.Radio, {}), label: device.name }) }, index)))) : ((0, jsx_runtime_1.jsx)("p", { children: "No available MIDI devices." })) }), (0, jsx_runtime_1.jsx)(material_1.Button, { type: "submit", fullWidth: true, variant: "contained", onClick: handleDeviceConnect, disabled: !selectedDevice, sx: {
                                    backgroundColor: 'grey',
                                    color: 'white',
                                    padding: '10px',
                                    margin: '15px'
                                }, children: "Connect" })] })] })] }));
};
exports.default = Connect;
