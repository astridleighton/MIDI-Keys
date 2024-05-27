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
exports.MidiInstrument = void 0;
const Tone = __importStar(require("tone"));
const InstrumentService_1 = require("../services/InstrumentService");
const DrumService_1 = __importDefault(require("../services/DrumService"));
/**
 * TODO: ensure drums work
 * TODO: test midi instrument
 * TODO: ensure we keep track of notes played and pass back to play (I think)
 */
class MidiInstrument {
    constructor(sound) {
        this.sound = sound;
        this.synth = null;
        this.drumService = new DrumService_1.default();
        this.initializeMidi = (connectedDevice) => __awaiter(this, void 0, void 0, function* () {
            console.log("Setting up MIDI keyboard.");
            connectedDevice.onmidimessage = (event) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                event.preventDefault();
                const [command, note, velocity] = event.data;
                if (command === 144 && velocity > 0) { // note on
                    (_a = this.synth) === null || _a === void 0 ? void 0 : _a.triggerAttack(Tone.Frequency(note, "midi"));
                    // TODO: add drums 
                    /*
                    * switch (noteInput) {
                                    case 48:
                                        drumService.createKickPlayer();
                                        break;
                                    case 49:
                                        drumService.createSnarePlayer();
                                        break;
                                    case 50:
                                        drumService.createTom1Player();
                                        break;
                                    case 51:
                                        drumService.createTom2Player();
                                        break;
                                    case 44:
                                        drumService.createTom3Player();
                                        break;
                                    case 45:
                                        drumService.createHiHatPlayer();
                                        break;
                                    case 46:
                                        drumService.createBongo1Player();
                                        break;
                                    case 47:
                                        drumService.createBongo2Player();
                                        break;
                                    default:
                                        break;
                                }
                    */
                }
                else if (command === 128 || (command === 144 && velocity === 0)) { // note off
                    (_b = this.synth) === null || _b === void 0 ? void 0 : _b.triggerRelease(note);
                }
            });
        });
        /*
        * Converts MIDI input (number value) to note value and octave
        * Example: #28 -> E1
        */
        this.midiToNote = (midiInput) => __awaiter(this, void 0, void 0, function* () {
            const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
            const octave = Math.floor(midiInput / 12) - 1;
            const noteIndex = midiInput % 12;
            const noteName = noteNames[noteIndex];
            return noteName + octave;
        });
        this.initializeTone();
        this.initializeMidi(sound);
    }
    initializeTone() {
        var _a;
        if (this.sound) {
            console.log("Setting up: " + ((_a = this.sound) === null || _a === void 0 ? void 0 : _a.name));
            this.synth = (0, InstrumentService_1.selectSound)(this.sound);
        }
    }
    disconnect() {
        // TODO: remove event listener
    }
}
exports.MidiInstrument = MidiInstrument;
