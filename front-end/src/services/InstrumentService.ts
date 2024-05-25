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