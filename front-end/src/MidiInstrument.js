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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MidiInstrument = void 0;
/**
 * TODO: abstract all MIDI instrument and sample references here
 */
class MidiInstrument {
    constructor(instrumentName) {
        this.instrumentName = instrumentName;
        this.playNote = () => {
            // determine which note to play
            console.log("A note is being played but this method is not set up.");
        };
        this.initializeMidi();
        this.initializeTone();
    }
    initializeMidi() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const midiAccess = yield navigator.requestMIDIAccess();
                midiAccess.addEventListener("statechange", this.playNote);
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
    }
    disconnect() {
        // TODO: remove event listener
    }
}
exports.MidiInstrument = MidiInstrument;
