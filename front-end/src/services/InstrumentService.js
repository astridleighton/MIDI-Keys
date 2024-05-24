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
    switch (selectedSound.name.toLowerCase().replace(/\s+/g, '')) {
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
            console.log('casio!!!');
            return new Tone.Sampler({
                urls: selectedSound.urls,
                baseUrl: selectedSound.location
            }).toDestination();
        case 'salamander':
            break;
        case 'eeriepad':
            return new Tone.Sampler({
                urls: {
                    A3: "eerie_synth1.mp3",
                    A4: "eerie_synth2.mp3",
                    A5: "eerie_synth3.mp3"
                },
                baseUrl: "",
            }).toDestination();
        case 'guitar':
            return new Tone.Sampler({
                urls: {
                    A3: "guitar_Astring.mp3",
                    E2: "guitar_LowEstring1.mp3",
                    G4: "guitar_Gstring.mp3"
                },
                baseUrl: "",
            }).toDestination();
        case 'choir':
            return new Tone.Sampler({
                urls: {
                    A3: "femalevoices_aa2_A3.mp3",
                    A4: "femalevoices_aa2_A4.mp3",
                    A5: "femalevoices_aa2_A5.mp3"
                },
                baseUrl: "",
            }).toDestination();
        case 'kalimba':
            return new Tone.Sampler({
                urls: {
                    Ab3: "Kalimba_1.mp3",
                    Ab4: "Kalimba_3.mp3"
                },
                baseUrl: "",
            }).toDestination();
        default:
            console.error('Unknown type of synthesizer. Could not build sound.');
            return null;
    }
};
exports.selectSound = selectSound;
