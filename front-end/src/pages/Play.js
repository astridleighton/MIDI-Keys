"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const Tone = __importStar(require("tone"));
const js_cookie_1 = __importDefault(require("js-cookie"));
const material_1 = require("@mui/material");
const Star_1 = __importDefault(require("@mui/icons-material/Star"));
const Piano_1 = __importDefault(require("./Piano"));
const MidiContext_1 = require("../MidiContext");
const MidiInstrument_1 = require("../instruments/MidiInstrument");
const QwertyInstrument_1 = require("../instruments/QwertyInstrument");
const SoundService_1 = __importDefault(require("../services/SoundService"));
require("./Play.scss");
/**
 * Initiates QWERTY and MIDI keyboard setup
 * Contains the Tone.JS instruments and database samples
 * Allows user to select between instruments
 * Displays notes played
 * TODO: render when new notes are being played to show visual (new useEffect?)
 */
const Play = () => {
    const midiContext = (0, react_1.useContext)(MidiContext_1.MidiContext);
    const isAuthenticated = !!js_cookie_1.default.get('token');
    const firstName = js_cookie_1.default.get('name');
    const [chordNotes, setChordNotes] = (0, react_1.useState)([]);
    const [soundObjects, setSoundObjects] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [url, setURL] = (0, react_1.useState)(null);
    const [notesEnabled, setNotesEnabled] = (0, react_1.useState)(false);
    const [selectedSound, setSelectedSound] = (0, react_1.useState)();
    const connectedDevice = midiContext === null || midiContext === void 0 ? void 0 : midiContext.connectedDevice;
    const soundService = new SoundService_1.default();
    /**
       * Starts tone.JS and sets up MIDI input devices
       */
    (0, react_1.useEffect)(() => {
        console.log('in use effect');
        const initTone = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                Tone.start();
                yield initializeSounds();
                const testSound = {
                    id: '0',
                    name: 'Synth',
                    location: '',
                    isFavorite: false,
                    urls: ''
                };
                if (testSound) { // TODO: fix this so it connects to connectedDevice
                    const midiInstrument = new MidiInstrument_1.MidiInstrument(testSound);
                    const qwertyInstrument = new QwertyInstrument_1.QwertyInstrument(testSound, addNote, removeNote);
                }
                else {
                    console.log("Missing some info.");
                }
            }
            catch (error) {
                console.error('Error setting up MIDI in your browser. Please reload and try again.', error);
            }
        });
        initTone();
    }, [selectedSound]);
    /**
     * Connects to MIDI device
     * @returns connected device
     */
    const connectMIDIInputDevice = (deviceName) => __awaiter(void 0, void 0, void 0, function* () {
        const midiAccess = yield navigator.requestMIDIAccess();
        const inputs = Array.from(midiAccess.inputs.values());
        const device = inputs.find(input => input.name === deviceName);
        if (device) {
            return device;
        }
    });
    /**
     * Ensures sounds are loaded before receiving favorite sounds
     */
    const initializeSounds = () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Getting all sounds and favorites.");
        try {
            setIsLoading(true);
            const soundsData = yield soundService.getAllSounds();
            const token = js_cookie_1.default.get('token');
            if (soundsData) {
                if (isAuthenticated) {
                    yield soundService.getAllFavorites(token, soundsData);
                }
                setSoundObjects(soundsData);
            }
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setIsLoading(false);
        }
    });
    /**
     * Changes state based on note toggle
     */
    const handleNotesToggle = () => {
        setNotesEnabled(!notesEnabled);
    };
    /*
        Adds note to state array, checks for duplicates
    */
    const addNote = (newNote) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Adding note: ' + newNote);
        setChordNotes((previousChord) => {
            if (previousChord && !previousChord.includes(newNote)) {
                return [...previousChord, newNote];
            }
            else {
                return previousChord;
            }
        });
    });
    /*
        Removes note from state array
    */
    const removeNote = (oldNote) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Stopped playing ' + oldNote);
        const previousChord = chordNotes;
        if (previousChord) {
            const newChord = previousChord.filter((note) => note !== oldNote);
            setChordNotes(newChord);
        }
    });
    /*
        Selects instrument type based on user option
    */
    const handleSelectSound = (event) => {
        const instrument = event.target.value;
        let location;
        if (soundObjects) {
            soundObjects.forEach((sound) => {
                if (sound.name === instrument) {
                    location = sound.location;
                }
            });
        }
        if ((location === "react" || location) && midiContext) {
            if (instrument === 'Synth') {
                midiContext.setSelectedSound(instrument);
            }
            else if (instrument === 'AM Synth') {
                midiContext.setSelectedSound(instrument);
            }
            else if (instrument === 'Mono Synth') {
                midiContext.setSelectedSound(instrument);
            }
            else if (instrument === 'Casio Piano') {
                midiContext.setSelectedSound(instrument);
            }
            else if (instrument === 'Salamander') {
                midiContext.setSelectedSound(instrument);
                setURL(location);
            }
            else if (instrument === 'Choir') {
                midiContext.setSelectedSound(instrument);
                setURL(location);
            }
            else if (instrument === 'Eerie Pad') {
                midiContext.setSelectedSound(instrument);
                setURL(location);
            }
            else if (instrument === 'Guitar') {
                midiContext.setSelectedSound(instrument);
                setURL(location);
            }
            else if (instrument === 'Kalimba') {
                midiContext.setSelectedSound(instrument);
                setURL(location);
            }
            else {
                console.log("Error! Could not set selected instrument.");
            }
        }
        else { // external sample
            console.log('Error! Could not set selected instrument.');
        }
    };
    /**
     * Adds a specified sound to the user's favorites
     * Only called if user is logged in with a valid token
     * @param {*} soundName
     */
    const addFavorite = (soundName) => __awaiter(void 0, void 0, void 0, function* () {
        const token = js_cookie_1.default.get('token');
        soundService.addFavorite(token, soundName, soundObjects);
    });
    /**
     * Removes a specified sound from the user's favorites
     * Only called if user is logged in with a valid token
     * @param {*} soundName
     */
    const removeFavorite = (soundName) => __awaiter(void 0, void 0, void 0, function* () {
        const token = js_cookie_1.default.get('token');
        soundService.removeFavorite(token, soundName, soundObjects);
    });
    // renders user session and displays available sounds and notes played
    return ((0, jsx_runtime_1.jsxs)("div", { className: "play-container", children: [(0, jsx_runtime_1.jsx)("div", { className: "play-container play-header", children: isAuthenticated ? ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("h1", { children: ["Welcome,\u00A0", firstName, "!"] }) })) : ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("h1", { children: "MIDI Made Simple." }) })) }), (0, jsx_runtime_1.jsx)("div", { className: "play-container play-content", children: isLoading ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("p", { children: "Could not load sounds from database. Please refresh to try again." }), (0, jsx_runtime_1.jsx)(material_1.CircularProgress, {})] })) : ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)(material_1.FormControl, { variant: "standard", sx: { m: 1, minWidth: 120 }, children: [(0, jsx_runtime_1.jsx)(material_1.InputLabel, { id: "select-sound-label", sx: { color: 'white', fontSize: '20px' }, children: "Selected Sound" }), (0, jsx_runtime_1.jsx)(material_1.Select, { sx: { marginTop: '35px', width: '250px', height: '50px', color: 'white' }, labelId: "select-sound-label", value: selectedSound, onChange: (event) => handleSelectSound(event), label: "Sound", children: soundObjects && soundObjects.map((sound, index) => ((0, jsx_runtime_1.jsxs)(material_1.MenuItem, { value: sound.name, children: [sound.name, isAuthenticated && ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: sound.isFavorite ?
                                                (0, jsx_runtime_1.jsx)(material_1.IconButton, { style: { color: 'white' }, onClick: () => removeFavorite(sound.name), children: (0, jsx_runtime_1.jsx)(Star_1.default, { style: { color: 'yellow' } }) })
                                                :
                                                    (0, jsx_runtime_1.jsx)(material_1.IconButton, { style: { color: 'white' }, onClick: () => addFavorite(sound.name), children: (0, jsx_runtime_1.jsx)(Star_1.default, { style: { color: 'primary' } }) }) }))] }, index))) })] }) })) }), (0, jsx_runtime_1.jsx)(Piano_1.default, { notes: chordNotes }), (0, jsx_runtime_1.jsx)("div", { className: "chord-container", children: (0, jsx_runtime_1.jsx)(material_1.FormGroup, { children: (0, jsx_runtime_1.jsxs)("div", { className: "display-notes-container", children: [(0, jsx_runtime_1.jsx)(material_1.FormControlLabel, { control: (0, jsx_runtime_1.jsx)(material_1.Switch, {}), label: "Notes:", onChange: handleNotesToggle }), (0, jsx_runtime_1.jsx)("div", { className: "note-content", children: notesEnabled && ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: chordNotes === null || chordNotes === void 0 ? void 0 : chordNotes.map((note) => ((0, jsx_runtime_1.jsxs)("p", { className: "d-inline", children: [note, "\u00A0"] }))) })) })] }) }) })] }));
};
exports.default = Play;
