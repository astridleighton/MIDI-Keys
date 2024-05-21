import * as Tone from 'tone';
import AudioKeys from 'audiokeys';
import { selectSound } from './selectSound';


/**
 * TODO: abstract all MIDI instrument and sample references here
 * Start with synth
 * setUpMIDIKeyboard(), midiToNote(), playSound()
 * move qwerty into different class (different event listeners)
 * may need to abstract samples further into separate class because both qwerty and tone use them
 */

export class QwertyInstrument {

    // maps QWERTY to note values
    private keyToNote: { [key: number]: string } = {
        65: 'C4', // A
        87: 'Db4', // W
        83: 'D4', // S
        69: 'Eb4', // E
        68: 'E4', // D
        70: 'F4', // F
        84: 'Gb4', // T
        71: 'G4', // G
        89: 'Ab4', // Y
        72: 'A4', // H
        85: 'Bb4', // U
        74: 'B4', // J
        75: 'C5', // K
        79: 'Db5' // O
    };

    private synth: Tone.Synth | null = null;
    private keyboard = new AudioKeys({ polyphony: 10 });

    constructor(private instrumentName: string) {
        this.initializeTone();
        this.initializeQwerty();
    }

    private initializeTone() {
        console.log("Setting up: " + this.instrumentName);
        this.synth = selectSound(this.instrumentName);
    }

    private async initializeQwerty() {
        this.keyboard.down(async (e) => {
            const note = this.keyToNote[e.keyCode];
            if (note) {
                // TODO: ensure that other instruments may be selected
                // TODO: keep track of notes being played
                this.synth?.triggerAttackRelease(note, '4n');
                console.log('Playing ' + note);
            }

        });
        this.keyboard.up(async(e) => {
            // TODO: fix so synth stops when user stops playing note
            const note = this.keyToNote[e.keyCode];
            if (note) {
                // this.synth?.triggerRelease(note);
                console.log('Stopped playing ' + note);
            }
        });
    }

    

    public disconnect() {
        // TODO: remove event listener
    }
}