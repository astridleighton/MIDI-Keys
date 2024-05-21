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
const audiokeys_1 = __importDefault(require("audiokeys"));
const js_cookie_1 = __importDefault(require("js-cookie"));
const axios_1 = __importDefault(require("axios"));
const material_1 = require("@mui/material");
const Star_1 = __importDefault(require("@mui/icons-material/Star"));
const Piano_1 = __importDefault(require("./Piano"));
const MidiContext_1 = require("../MidiContext");
const MidiInstrument_1 = require("../MidiInstrument");
require("./Play.scss");
/**
 * Initiates QWERTY and MIDI keyboard setup
 * Contains the Tone.JS instruments and database samples
 * Allows user to select between instruments
 * Displays notes played
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
    const [selectedSound, setSelectedSound] = (0, react_1.useState)(null);
    const connectedDevice = midiContext === null || midiContext === void 0 ? void 0 : midiContext.connectedDevice;
    // maps QWERTY to note values
    const keyToNote = {
        65: 'C4', // A
        87: 'Db4', // W
        83: 'D4', // S
        69: 'Eb4', // E
        68: 'E4', // D
        70: 'F4', // F
        84: 'Gb4', // T
        71: 'G4', // G
        89: 'Ab4', // Y
        72: 'A4', // H
        85: 'Bb4', // U
        74: 'B4', // J
        75: 'C5', // K
        79: 'Db5' // O
    };
    /**
       * Starts tone.JS and sets up MIDI input devices
       */
    (0, react_1.useEffect)(() => {
        const testInstrument = new MidiInstrument_1.MidiInstrument('synth');
        const initTone = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                Tone.start();
                yield Tone.setContext(new AudioContext({ sampleRate: 41000 })); // sets audio preferences
                const keyboard = yield createQwerty();
                yield setUpQwertyKeyboard(keyboard); // device setup
                yield initializeSounds();
                const connectedDevice2 = yield connectMIDIInputDevice(connectedDevice);
                yield setUpMIDIKeyboard(connectedDevice2);
            }
            catch (error) {
                console.error('Error setting up MIDI in your browser. Please reload and try again.', error);
            }
        });
        initTone();
    }, []);
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
     * Creates an instance of the synth
     * @returns instance
     */
    const createSynth = () => {
        return new Tone.Synth().toDestination();
    };
    /**
     * Creates an instance of the AM Synth
     * @returns instance
     */
    const createAMSynth = () => {
        return new Tone.AMSynth().toDestination();
    };
    /**
     * Creates an instance of the mono synth
     * @returns instance
     */
    const createMonoSynth = () => {
        return new Tone.MonoSynth({
            oscillator: {
                type: "square"
            },
            envelope: {
                attack: 0.1
            }
        }).toDestination();
    };
    /**
     * Creates an instance of the QWERTY keyboard
     * @returns instance
     */
    const createQwerty = () => {
        return new audiokeys_1.default({
            polyphony: 10, // Adjust the polyphony as needed
        });
    };
    /**
     * Creates an instance of the sampler
     * @param {*} note
     */
    const createSampler = (note) => {
        const casio = new Tone.Sampler({
            urls: {
                A1: "A1.mp3",
                A2: "A2.mp3",
            },
            baseUrl: "https://tonejs.github.io/audio/casio/",
            onload: () => {
                casio.triggerAttackRelease(note, 1);
            }
        }).toDestination();
    };
    /**
     * Creates an instance of the choir sampler
     * @param {*} note
     * @param {*} url
     */
    const createChoirSampler = (note, url) => {
        const sampler = new Tone.Sampler({
            urls: {
                A3: "femalevoices_aa2_A3.mp3",
                A4: "femalevoices_aa2_A4.mp3",
                A5: "femalevoices_aa2_A5.mp3"
            },
            baseUrl: url,
            onload: () => {
                sampler.triggerAttackRelease(note, 1);
            }
        }).toDestination();
    };
    /**
     * Creates an instance of the eerie sampler
     * @param {*} note
     * @param {*} url
     */
    const createEerieSynthSampler = (note, url) => {
        const sampler = new Tone.Sampler({
            urls: {
                A3: "eerie_synth1.mp3",
                A4: "eerie_synth2.mp3",
                A5: "eerie_synth3.mp3"
            },
            baseUrl: url,
            onload: () => {
                sampler.triggerAttackRelease(note, 1);
            }
        }).toDestination();
    };
    /**
     * Creates an instance of the guitar sampler
     * @param {*} note
     * @param {*} url
     */
    const createGuitarSampler = (note, url) => {
        const sampler = new Tone.Sampler({
            urls: {
                A3: "guitar_Astring.mp3",
                E2: "guitar_LowEstring1.mp3",
                G4: "guitar_Gstring.mp3"
            },
            baseUrl: url,
            onload: () => {
                sampler.triggerAttackRelease(note, 1);
            }
        }).toDestination();
    };
    /**
     * Creates an instance of the kalimba sampler
     * @param {*} note
     * @param {*} url
     */
    const createKalimbaSampler = (note, url) => {
        const sampler = new Tone.Sampler({
            urls: {
                Ab3: "Kalimba_1.mp3",
                Ab4: "Kalimba_3.mp3"
            },
            baseUrl: url,
            onload: () => {
                sampler.triggerAttackRelease(note, 1);
            }
        }).toDestination();
    };
    /**
     * Creates an instance of the online sampler (used for online URLs)
     * @param {*} note
     * @param {*} url
     */
    const createOnlineSampler = (note, url) => {
        const sampler = new Tone.Sampler({
            urls: {
                A1: "A1.mp3",
                A2: "A2.mp3",
            },
            baseUrl: url,
            onload: () => {
                sampler.triggerAttackRelease(note, 0.8);
            }
        }).toDestination();
    };
    /**
     * Creates an instance of the kick
     */
    const createKickPlayer = () => {
        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/4OP-FM/kick.mp3", function () {
            const kickPlayer = new Tone.Player(buffer.get()).toDestination();
            kickPlayer.start(0.5);
        });
    };
    /**
     * Creates an instance of the snare
     */
    const createSnarePlayer = () => {
        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/4OP-FM/snare.mp3", function () {
            const snarePlayer = new Tone.Player(buffer.get()).toDestination();
            snarePlayer.start(0.5);
        });
    };
    /**
     * Creates an instance of tom1
     */
    const createTom1Player = () => {
        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/4OP-FM/tom1.mp3", function () {
            const tom1Player = new Tone.Player(buffer.get()).toDestination();
            tom1Player.start(0.5);
        });
    };
    /**
     * Creates an instance of tom2
     */
    const createTom2Player = () => {
        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/4OP-FM/tom2.mp3", function () {
            const tom2Player = new Tone.Player(buffer.get()).toDestination();
            tom2Player.start(0.5);
        });
    };
    /**
     * Creates an instance of tom3 (floor tom)
     */
    const createTom3Player = () => {
        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/4OP-FM/tom3.mp3", function () {
            const tom3Player = new Tone.Player(buffer.get()).toDestination();
            tom3Player.start(0.5);
        });
    };
    /**
     * Creates an instance of the hi-hat
     */
    const createHiHatPlayer = () => {
        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/4OP-FM/hihat.mp3", function () {
            const hiHatPlayer = new Tone.Player(buffer.get()).toDestination();
            hiHatPlayer.start(0.5);
        });
    };
    /**
     * Creates an instance of a bongo sound
     */
    const createBongo1Player = () => {
        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/Bongos/snare.mp3", function () {
            const hiHatPlayer = new Tone.Player(buffer.get()).toDestination();
            hiHatPlayer.start(0.5);
        });
    };
    /**
     * Creates an instance of another bongo sound
     */
    const createBongo2Player = () => {
        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/Bongos/tom1.mp3", function () {
            const bongo2Player = new Tone.Player(buffer.get()).toDestination();
            bongo2Player.start(0.5);
        });
    };
    /**
     * Ensures sounds are loaded before receiving favorite sounds
     */
    const initializeSounds = () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Getting all sounds and favorites.");
        try {
            setIsLoading(true);
            const sounds = yield getAllSounds();
            setSoundObjects(sounds);
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
    /**
     * Used to set up MIDI keyboard with note mappings, sounds, and MIDI events
     * @param {*} midiKeyboard
     */
    const setUpMIDIKeyboard = (midiKeyboard) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Setting up MIDI keyboard');
        midiKeyboard.onmidimessage = (event) => __awaiter(void 0, void 0, void 0, function* () {
            event.preventDefault();
            const command = event.data[0];
            const noteInput = event.data[1];
            const velocity = event.data[2];
            const note = yield midiToNote(noteInput);
            switch (command) {
                case 144: // note on
                    if (velocity > 0) {
                        // determine if drums or keys
                        if (noteInput >= 60) {
                            yield addNote(note);
                            yield playSound(note);
                        }
                        else {
                            switch (noteInput) {
                                case 48:
                                    createKickPlayer();
                                    break;
                                case 49:
                                    createSnarePlayer();
                                    break;
                                case 50:
                                    createTom1Player();
                                    break;
                                case 51:
                                    createTom2Player();
                                    break;
                                case 44:
                                    createTom3Player();
                                    break;
                                case 45:
                                    createHiHatPlayer();
                                    break;
                                case 46:
                                    createBongo1Player();
                                    break;
                                case 47:
                                    createBongo2Player();
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                    break;
                case 128: // note off
                    yield removeNote(note);
                    break;
                default:
                    break;
            }
        });
    });
    /**
     * Chooses appropriate sample baesd on note
     * @param {*} note
     */
    const playSound = (note) => __awaiter(void 0, void 0, void 0, function* () {
        switch (selectedSound) {
            case 'Synth':
                const synth = yield createSynth();
                synth.triggerAttackRelease(note, "4n");
                break;
            case 'AM Synth':
                const amSynth = yield createAMSynth();
                amSynth.triggerAttackRelease(note, "4n");
                break;
            case 'Mono Synth':
                const monoSynth = yield createMonoSynth();
                monoSynth.triggerAttackRelease(note, "4n");
                break;
            case 'Casio Piano':
                yield createSampler(note);
                break;
            case 'Salamander':
                yield createOnlineSampler(note, url);
                break;
            case 'Eerie Pad':
                yield createEerieSynthSampler(note, url);
                break;
            case 'Guitar':
                yield createGuitarSampler(note, url);
                break;
            case 'Choir':
                yield createChoirSampler(note, url);
                break;
            case 'Kalimba':
                yield createKalimbaSampler(note, url);
                break;
            default:
                break;
        }
    });
    /**
     * - Sets up keyboard using AudioKeys and allows QWERTY keyboard input
        - Maps MIDI notes to music notes
        - Triggers audio output with keydown event
        - Stores current notes being played
     */
    const setUpQwertyKeyboard = (keyboard) => __awaiter(void 0, void 0, void 0, function* () {
        /*
        Triggers audio output, converts MIDI note to music note, and adds note to notes played
        */
        keyboard.down((e) => __awaiter(void 0, void 0, void 0, function* () {
            const note = keyToNote[e.keyCode];
            if (note) {
                yield addNote(note);
                yield playSound(note);
            }
        }));
        /*
            Stops audio output and removes note from notes played
        */
        keyboard.up((e) => __awaiter(void 0, void 0, void 0, function* () {
            const note = keyToNote[e.keyCode];
            yield removeNote(note);
        }));
    });
    /*
    * Converts MIDI input (number value) to note value and octave
    * Example: #28 -> E1
    */
    const midiToNote = (midiInput) => __awaiter(void 0, void 0, void 0, function* () {
        const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        const octave = Math.floor(midiInput / 12) - 1;
        const noteIndex = midiInput % 12;
        const noteName = noteNames[noteIndex];
        return noteName + octave;
    });
    /*
        Adds note to state array, checks for duplicates
    */
    const addNote = (newNote) => __awaiter(void 0, void 0, void 0, function* () {
        setChordNotes((previousChord) => {
            if (!previousChord.includes(newNote)) {
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
        const previousChord = chordNotes;
        const newChord = previousChord.filter((note) => note !== oldNote);
        setChordNotes(newChord);
    });
    /*
        Selects instrument type based on user option
    */
    const handleSelectSound = (event) => {
        const instrument = event.target.value;
        let location;
        soundObjects.forEach((sound) => {
            if (sound.name === instrument) {
                location = sound.location;
            }
        });
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
     * Retrieves all sounds from the database
     */
    const getAllSounds = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield axios_1.default.get('http://localhost:3000/all-sounds');
            console.log(result);
            if (result.status === 200) {
                const sounds = result.data.map(sound => ({
                    id: sound.id,
                    name: sound.name,
                    location: sound.source,
                    isFavorite: sound.isFavorite
                }));
                console.log(sounds);
                if (isAuthenticated) {
                    return getAllFavorites(sounds);
                }
                else {
                    return sounds;
                }
            }
            else {
                console.log("Error");
                return null;
            }
        }
        catch (error) {
            console.error("Could not get sounds from database.", error);
            return null;
        }
    });
    /**
     * Retrieves all favorite sounds from the database
     * Only called when user is logged in with a valid token
     */
    const getAllFavorites = (sounds) => __awaiter(void 0, void 0, void 0, function* () {
        const token = js_cookie_1.default.get('token');
        try {
            const result = yield axios_1.default.get('http://localhost:3000/all-favorites', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (result.data.length > 0) {
                const favorites = result.data.map(sound => ({
                    id: sound.id,
                    name: sound.name,
                    location: sound.source,
                    isFavorite: sound.isFavorite
                }));
                for (let i = 0; i < sounds.length; i++) {
                    const matchingFavorite = favorites.find(favorite => favorite.id === sounds[i].id);
                    if (matchingFavorite) {
                        sounds[i].isFavorite = true;
                    }
                }
            }
            return sounds;
        }
        catch (error) {
            if (error.status === 403 || error.status === 401) {
                console.log("Unauthorized to load samples");
            }
            else {
                console.log("No favorites to show.");
                return sounds;
            }
        }
    });
    /**
     * Adds a specified sound to the user's favorites
     * Only called if user is logged in with a valid token
     * @param {*} soundName
     */
    const addFavorite = (sound) => __awaiter(void 0, void 0, void 0, function* () {
        const token = js_cookie_1.default.get('token');
        try {
            const response = yield axios_1.default.post(`http://localhost:3000/add-favorite/${sound}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response);
            for (let i = 0; i < soundObjects.length; i++) {
                if (soundObjects[i].name === sound) {
                    const updatedSoundObjects = [...soundObjects];
                    updatedSoundObjects[i].isFavorite = true;
                    console.log('setting fav');
                    setSoundObjects(updatedSoundObjects);
                    break; // Once found, exit the loop
                }
            }
            console.log(soundObjects);
        }
        catch (error) {
            console.log(error);
        }
    });
    /**
     * Removes a specified sound from the user's favorites
     * Only called if user is logged in with a valid token
     * @param {*} soundName
     */
    const removeFavorite = (soundName) => __awaiter(void 0, void 0, void 0, function* () {
        const token = js_cookie_1.default.get('token');
        try {
            const response = yield axios_1.default.delete(`http://localhost:3000/remove-favorite/${soundName}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response);
            // Check if the sound is present in state and update its isFavorite property
            const updatedSoundObjects = soundObjects.map(sound => {
                if (sound.name === soundName) {
                    return Object.assign(Object.assign({}, sound), { isFavorite: false });
                }
                return sound;
            });
            // Update state with the modified soundObjects array
            setSoundObjects(updatedSoundObjects);
        }
        catch (error) {
            console.log(error);
        }
    });
    // renders user session and displays available sounds and notes played
    return ((0, jsx_runtime_1.jsxs)("div", { className: "play-container", children: [(0, jsx_runtime_1.jsx)("div", { className: "play-container play-header", children: isAuthenticated ? ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("h1", { children: ["Welcome,\u00A0", firstName, "!"] }) })) : ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("h1", { children: "MIDI Made Simple." }) })) }), (0, jsx_runtime_1.jsx)("div", { className: "play-container play-content", children: isLoading ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("p", { children: "Could not load sounds from database. Please refresh to try again." }), (0, jsx_runtime_1.jsx)(material_1.CircularProgress, {})] })) : ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)(material_1.FormControl, { variant: "standard", sx: { m: 1, minWidth: 120 }, children: [(0, jsx_runtime_1.jsx)(material_1.InputLabel, { id: "select-sound-label", sx: { color: 'white', fontSize: '20px' }, children: "Selected Sound" }), (0, jsx_runtime_1.jsx)(material_1.Select, { sx: { marginTop: '35px', width: '250px', height: '50px', color: 'white' }, labelId: "select-sound-label", value: selectedSound, onChange: (event) => handleSelectSound(event), label: "Sound", children: soundObjects && soundObjects.map((sound, index) => ((0, jsx_runtime_1.jsxs)(material_1.MenuItem, { value: sound.name, children: [sound.name, isAuthenticated && ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: sound.isFavorite ?
                                                (0, jsx_runtime_1.jsx)(material_1.IconButton, { style: { color: 'white' }, onClick: () => removeFavorite(sound.name), children: (0, jsx_runtime_1.jsx)(Star_1.default, { style: { color: 'yellow' } }) })
                                                :
                                                    (0, jsx_runtime_1.jsx)(material_1.IconButton, { style: { color: 'white' }, onClick: () => addFavorite(sound.name), children: (0, jsx_runtime_1.jsx)(Star_1.default, { style: { color: 'primary' } }) }) }))] }, index))) })] }) })) }), (0, jsx_runtime_1.jsx)(Piano_1.default, { notes: chordNotes }), (0, jsx_runtime_1.jsx)("div", { className: "chord-container", children: (0, jsx_runtime_1.jsx)(material_1.FormGroup, { children: (0, jsx_runtime_1.jsxs)("div", { className: "display-notes-container", children: [(0, jsx_runtime_1.jsx)(material_1.FormControlLabel, { control: (0, jsx_runtime_1.jsx)(material_1.Switch, {}), label: "Notes:", onChange: handleNotesToggle }), (0, jsx_runtime_1.jsx)("div", { className: "note-content", children: notesEnabled && ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: chordNotes.map((note) => ((0, jsx_runtime_1.jsxs)("p", { className: "d-inline", children: [note, "\u00A0"] }))) })) })] }) }) })] }));
};
exports.default = Play;
