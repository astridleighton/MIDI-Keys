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
const InstrumentService_1 = require("../services/InstrumentService");
class QwertyInstrument {
    constructor(sound, playNoteCallback, removeNoteCallback) {
        this.sound = sound;
        // maps QWERTY to note values
        this.keyToNote = {
            65: 'C3', // A
            87: 'Db3', // W
            83: 'D3', // S
            69: 'Eb3', // E
            68: 'E3', // D
            70: 'F3', // F
            84: 'Gb3', // T
            71: 'G3', // G
            89: 'Ab3', // Y
            72: 'A3', // H
            85: 'Bb3', // U
            74: 'B3', // J
            75: 'C4', // K
            79: 'Db4' // O
        };
        this.synth = null;
        this.keyboard = new audiokeys_1.default({ polyphony: 10 });
        this.initializeTone();
        this.addNoteCallback = playNoteCallback;
        this.removeNoteCallback = removeNoteCallback;
        this.initializeQwerty();
    }
    initializeTone() {
        var _a;
        if ((_a = this.sound) === null || _a === void 0 ? void 0 : _a.name) {
            console.log("Setting up: " + this.sound.name);
            this.synth = (0, InstrumentService_1.selectSound)(this.sound);
        }
    }
    initializeQwerty() {
        return __awaiter(this, void 0, void 0, function* () {
            this.keyboard.down((e) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const note = this.keyToNote[e.keyCode];
                if (note) {
                    this.addNoteCallback(note);
                    (_a = this.synth) === null || _a === void 0 ? void 0 : _a.triggerAttackRelease(note, '4n');
                }
            }));
            this.keyboard.up((e) => __awaiter(this, void 0, void 0, function* () {
                // TODO: fix so synth stops when user stops playing note
                const note = this.keyToNote[e.keyCode];
                if (note) {
                    // this.synth?.triggerRelease(note);
                    this.removeNoteCallback(note);
                }
            }));
        });
    }
    disconnect() {
        // TODO: remove event listener
    }
}
exports.QwertyInstrument = QwertyInstrument;
