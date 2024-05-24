import * as Tone from 'tone';
import { Sound } from '../types';

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
}