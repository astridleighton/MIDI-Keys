import * as Tone from 'tone';

/**
 * TODO: abstract all MIDI instrument and sample references here
 * Start with synth
 * setUpMIDIKeyboard(), midiToNote(), playSound()
 * move qwerty into different class (different event listeners)
 * may need to abstract samples further into separate class because both qwerty and tone use them
 */

export class MidiInstrument {

    private midiAccess: WebMidi.MIDIAccess | null = null;
    private midiInput: WebMidi.MIDIInput | null = null;
    private synth: Tone.Synth | null = null;

    constructor(private instrumentName: string) {
        this.initializeMidi();
        this.initializeTone();
    }

    private async initializeMidi() {
        try {
            const midiAccess = await navigator.requestMIDIAccess();
            // midiAccess.addEventListener('midimessage', this.playNote);
            // await listMIDIInputs(midiAccess);
        } catch (error) {
          console.error('MIDI Access failed: ', error);
        }
    }

    private initializeTone() {
        // to destination
        console.log("Setting up: " + this.instrumentName);
        this.synth = new Tone.Synth().toDestination();

        // TODO: select device
    }

    private playNote = (message: WebMidi.MIDIMessageEvent) => {
        // TODO: determine which note to play
        console.log("A note is being played but this method is not set up.");
        const [command, note, velocity] = message.data;

        if(command === 144 && velocity > 0) { // note on
            this.synth?.triggerAttack(Tone.Frequency(note, "midi"));
        } else if (command === 128 || (command === 144 && velocity === 0)) { // note off
            this.synth?.triggerRelease(note);
        }
    }

    public disconnect() {
        // TODO: remove event listener
    }
}