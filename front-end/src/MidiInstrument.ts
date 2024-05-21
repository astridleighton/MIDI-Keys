import * as Tone from 'tone';

/**
 * TODO: abstract all MIDI instrument and sample references here
 */

export class MidiInstrument {
    constructor(private instrumentName: string) {
        this.initializeMidi();
        this.initializeTone();
    }

    private async initializeMidi() {
        try {
            const midiAccess = await navigator.requestMIDIAccess();
            midiAccess.addEventListener("statechange", this.playNote);
            // await listMIDIInputs(midiAccess);
        } catch (error) {
          console.error('MIDI Access failed: ', error);
        }
    }

    private initializeTone() {
        // to destination
        console.log("Setting up: " + this.instrumentName);
    }

    private playNote = () => {
        // determine which note to play
        console.log("A note is being played but this method is not set up.");
    }

    public disconnect() {
        // TODO: remove event listener
    }
}