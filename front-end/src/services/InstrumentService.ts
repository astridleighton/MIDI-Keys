import * as Tone from 'tone';
import { Sound } from '../types';

// TODO: ensure samples may be loaded properly

export const selectSound = (selectedSound: Sound): any => {

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
                } else {
                    console.error("Not enough information to build synthesizer. Please choose another synth.");
                    break;
                }
        }
}

const buildSampler = (sound) => {
    try {
        const sampler = new Tone.Sampler({
            urls: sound.urls,
            baseUrl: sound.location
        }).toDestination();
        return sampler;
    } catch (err: any) {
        console.error('Could not build synthesizer.', err);
        return null;
    }
}