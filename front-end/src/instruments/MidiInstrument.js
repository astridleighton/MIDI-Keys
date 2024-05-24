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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MidiInstrument = void 0;
const Tone = __importStar(require("tone"));
/**
 * TODO: abstract all MIDI instrument and sample references here
 * Start with synth
 * setUpMIDIKeyboard(), midiToNote(), playSound()
 * move qwerty into different class (different event listeners)
 * may need to abstract samples further into separate class because both qwerty and tone use them
 */
class MidiInstrument {
    constructor(instrumentName) {
        this.instrumentName = instrumentName;
        this.midiAccess = null;
        this.midiInput = null;
        this.synth = null;
        this.playNote = (message) => {
            var _a, _b;
            // TODO: determine which note to play
            console.log("A note is being played but this method is not set up.");
            const [command, note, velocity] = message.data;
            if (command === 144 && velocity > 0) { // note on
                (_a = this.synth) === null || _a === void 0 ? void 0 : _a.triggerAttack(Tone.Frequency(note, "midi"));
            }
            else if (command === 128 || (command === 144 && velocity === 0)) { // note off
                (_b = this.synth) === null || _b === void 0 ? void 0 : _b.triggerRelease(note);
            }
        };
        this.initializeMidi();
        this.initializeTone();
    }
    initializeMidi() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const midiAccess = yield navigator.requestMIDIAccess();
                // midiAccess.addEventListener('midimessage', this.playNote);
                // await listMIDIInputs(midiAccess);
            }
            catch (error) {
                console.error('MIDI Access failed: ', error);
            }
        });
    }
    initializeTone() {
        // to destination
        console.log("Setting up: " + this.instrumentName);
        this.synth = new Tone.Synth().toDestination();
        // TODO: select device
    }
    disconnect() {
        // TODO: remove event listener
    }
}
exports.MidiInstrument = MidiInstrument;
