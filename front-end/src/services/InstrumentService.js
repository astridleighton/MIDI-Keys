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
// TODO: ensure samples may be loaded properly
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
        case 'duosynth':
            return new Tone.DuoSynth().toDestination();
        case 'fmsynth':
            return new Tone.FMSynth().toDestination();
        case 'membranesynth':
            return new Tone.MembraneSynth().toDestination();
        case 'metalsynth':
            return new Tone.MetalSynth().toDestination();
        case 'noisesynth':
            return new Tone.NoiseSynth().toDestination();
        case 'plucksynth':
            return new Tone.PluckSynth().toDestination();
        case 'polysynth':
            return new Tone.PolySynth().toDestination(); // TODO: may need to change output to more notes at once
        default:
            if (selectedSound.location && selectedSound.urls) {
                // try to build sample from base url and sample urls
                return buildSampler(selectedSound);
            }
            else {
                console.error("Not enough information to build synthesizer. Please choose another synth.");
                break;
            }
    }
};
exports.selectSound = selectSound;
const buildSampler = (sound) => {
    try {
        const sampler = new Tone.Sampler({
            urls: sound.urls,
            baseUrl: sound.location
        }).toDestination();
        return sampler;
    }
    catch (err) {
        console.error('Could not build synthesizer.', err);
        return null;
    }
};
