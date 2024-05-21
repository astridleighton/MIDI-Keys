import * as Tone from 'tone';

export const selectSound = (selectedSound: string): any => {

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
                return new Tone.Sampler({
                    urls: {
                    A1: "A1.mp3",
                    A2: "A2.mp3",
                },
                    baseUrl: "https://tonejs.github.io/audio/casio/"
                }).toDestination();
            case 'salamander':
                break;
            case 'eeriepad':
                break;
            case 'guitar':
                break;
            case 'choir':
                break;
            case 'kalimba':
                break;
            default:
                console.error('Unknown type of synthesizer. Could not build sound.');
                return null;
        }
}