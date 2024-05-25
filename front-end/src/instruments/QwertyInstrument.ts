import * as Tone from 'tone';
import AudioKeys from 'audiokeys';
import { selectSound } from '../services/InstrumentService';
import { Sound } from '../types';

export class QwertyInstrument {

    // maps QWERTY to note values
    private keyToNote: { [key: number]: string } = {
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

    private synth: Tone.Synth | null = null;
    private keyboard = new AudioKeys({ polyphony: 10 });
    private addNoteCallback: (note: string) => void;
    private removeNoteCallback: (note: string) => void;

    constructor(private sound: Sound | null, playNoteCallback: (note: string) => void, removeNoteCallback: (note: string) => void) {
        this.initializeTone();
        this.addNoteCallback = playNoteCallback;
        this.removeNoteCallback = removeNoteCallback;

        this.initializeQwerty();
    }

    private initializeTone() {
        if (this.sound?.name) {
            console.log("Setting up: " + this.sound.name);
            this.synth = selectSound(this.sound);
        }
    }

    private async initializeQwerty() {
        this.keyboard.down(async (e) => {
            const note = this.keyToNote[e.keyCode];
            if (note) {
                this.addNoteCallback(note);
                this.synth?.triggerAttackRelease(note, '4n');
            }

        });
        this.keyboard.up(async(e) => {
            // TODO: fix so synth stops when user stops playing note
            const note = this.keyToNote[e.keyCode];
            if (note) {
                // this.synth?.triggerRelease(note);
                console.log('Stopped playing ' + note);
                this.removeNoteCallback(note);
            }
        });
    }

    public disconnect() {
        // TODO: remove event listener
    }
}