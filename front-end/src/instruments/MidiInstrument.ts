import * as Tone from 'tone';
import { selectSound } from '../services/InstrumentService';
import DrumService from '../services/DrumService';
import { Sound } from '../types';

/**
 * TODO: ensure drums work
 * TODO: test midi instrument
 * TODO: ensure we keep track of notes played and pass back to play (I think)
 */

export class MidiInstrument {

    private synth: Tone.Synth | null = null;
    private drumService = new DrumService();

    constructor(private sound: Sound | null) {
        this.initializeTone();
        this.initializeMidi(sound);
    }

    private initializeTone() {
        if(this.sound) {
            console.log("Setting up: " + this.sound?.name);
            this.synth = selectSound(this.sound);
        }
    }


    private initializeMidi = async(connectedDevice) => {
        console.log("Setting up MIDI keyboard.");

        connectedDevice.onmidimessage = async (event) => {
            event.preventDefault();
            const [command, note, velocity] = event.data;

            if(command === 144 && velocity > 0) { // note on
                this.synth?.triggerAttack(Tone.Frequency(note, "midi"));

                // TODO: add drums 
                /* 
                * switch (noteInput) {
                                case 48:
                                    drumService.createKickPlayer();
                                    break;
                                case 49:
                                    drumService.createSnarePlayer();
                                    break;
                                case 50:
                                    drumService.createTom1Player();
                                    break;
                                case 51:
                                    drumService.createTom2Player();
                                    break;
                                case 44:
                                    drumService.createTom3Player();
                                    break;
                                case 45:
                                    drumService.createHiHatPlayer();
                                    break;
                                case 46:
                                    drumService.createBongo1Player();
                                    break;
                                case 47:
                                    drumService.createBongo2Player();
                                    break;
                                default:
                                    break;
                            }
                */
            } else if (command === 128 || (command === 144 && velocity === 0)) { // note off
                this.synth?.triggerRelease(note);
            }
        }
        
    }

    /*
    * Converts MIDI input (number value) to note value and octave
    * Example: #28 -> E1
    */
    private midiToNote = async (midiInput) =>
        {
            const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
            const octave = Math.floor(midiInput / 12) - 1;
            const noteIndex = midiInput % 12;
    
            const noteName = noteNames[noteIndex];
            return noteName + octave;
        }

    public disconnect() {
        // TODO: remove event listener
    }
}