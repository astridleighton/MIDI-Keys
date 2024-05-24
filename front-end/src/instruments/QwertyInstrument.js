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
exports.QwertyInstrument = void 0;
const audiokeys_1 = __importDefault(require("audiokeys"));
const selectSound_1 = require("./selectSound");
/**
 * TODO: abstract all MIDI instrument and sample references here
 * Start with synth
 * setUpMIDIKeyboard(), midiToNote(), playSound()
 * move qwerty into different class (different event listeners)
 * may need to abstract samples further into separate class because both qwerty and tone use them
 */
class QwertyInstrument {
    constructor(instrumentName) {
        this.instrumentName = instrumentName;
        // maps QWERTY to note values
        this.keyToNote = {
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
        this.synth = null;
        this.keyboard = new audiokeys_1.default({ polyphony: 10 });
        this.initializeTone();
        this.initializeQwerty();
    }
    initializeTone() {
        if (this.instrumentName) {
            console.log("Setting up: " + this.instrumentName);
            this.synth = (0, selectSound_1.selectSound)(this.instrumentName);
        }
    }
    initializeQwerty() {
        return __awaiter(this, void 0, void 0, function* () {
            this.keyboard.down((e) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const note = this.keyToNote[e.keyCode];
                if (note) {
                    // TODO: ensure that other instruments may be selected
                    // TODO: keep track of notes being played
                    (_a = this.synth) === null || _a === void 0 ? void 0 : _a.triggerAttackRelease(note, '4n');
                    console.log('Playing ' + note);
                }
            }));
            this.keyboard.up((e) => __awaiter(this, void 0, void 0, function* () {
                // TODO: fix so synth stops when user stops playing note
                const note = this.keyToNote[e.keyCode];
                if (note) {
                    // this.synth?.triggerRelease(note);
                    console.log('Stopped playing ' + note);
                }
            }));
        });
    }
    disconnect() {
        // TODO: remove event listener
    }
}
exports.QwertyInstrument = QwertyInstrument;
