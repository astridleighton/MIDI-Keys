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
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectSound = void 0;
const Tone = __importStar(require("tone"));
const selectSound = (selectedSound) => {
    switch (selectedSound.toLowerCase().replace(/\s+/g, '')) {
        case 'synth':
            return new Tone.Synth().toDestination();
        case 'amsynth':
            return new Tone.AMSynth().toDestination();
        case 'monosynth':
            return new Tone.MonoSynth({
                oscillator: {
                    type: "square"
                },
                envelope: {
                    attack: 0.1
                }
            }).toDestination();
        case 'casiopiano':
            console.log('testing');
            return new Tone.Sampler({
                urls: {
                    A1: "A1.mp3",
                    A2: "A2.mp3",
                },
                baseUrl: "https://tonejs.github.io/audio/casio/"
            }).toDestination();
        case 'salamander':
        case 'eeriepad':
        case 'guitar':
        case 'choir':
        case 'kalimba':
        default:
            console.error('Unknown type of synthesizer. Could not build sound.');
            return null;
    }
};
exports.selectSound = selectSound;
