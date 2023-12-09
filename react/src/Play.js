import React from 'react';
import * as Tone from 'tone';
import AudioKeys from 'audiokeys';
import Cookies from 'js-cookie';

/*
    - Contains the Tone.JS instruments and references online samples
    - Allows user to select between instruments
    - Displays notes played
    - TODO: maybe pass play option between components?
*/
class Play extends React.Component
{
    // used to instantiate synthesizers from Tone.JS, selected sound, and notes/chords played
    constructor(props) {
        super(props);
        this.synths = {};
        this.amSynths = {};
        this.monoSynths = {};

        this.casio = new Tone.Sampler({
            urls: {
            A1: "A1.mp3",
            A2: "A2.mp3",
        },
	        baseUrl: "https://tonejs.github.io/audio/casio/",
        }).toDestination();

        this.kickPlayer = new Tone.Player("https://tonejs.github.io/audio/drum-samples/4OP-FM/kick.mp3").toDestination();
        this.snarePlayer = new Tone.Player("https://tonejs.github.io/audio/drum-samples/4OP-FM/snare.mp3").toDestination();
        this.tom1Player = new Tone.Player("https://tonejs.github.io/audio/drum-samples/4OP-FM/tom1.mp3").toDestination();
        this.tom2Player = new Tone.Player("https://tonejs.github.io/audio/drum-samples/4OP-FM/tom2.mp3").toDestination();
        this.tom3Player = new Tone.Player("https://tonejs.github.io/audio/drum-samples/4OP-FM/tom3.mp3").toDestination();
        this.hiHatPlayer = new Tone.Player("https://tonejs.github.io/audio/drum-samples/4OP-FM/hihat.mp3").toDestination();
        this.bongoSnarePlayer = new Tone.Player("https://tonejs.github.io/audio/drum-samples/Bongos/snare.mp3").toDestination();
        this.bongoTomPlayer = new Tone.Player("https://tonejs.github.io/audio/drum-samples/Bongos/tom1.mp3").toDestination();

        this.state = {
            selectedSound: 'synth', // default device
            chordNotes: [],
        }

      }

      createSynth = () => {
        const synth = new Tone.Synth().toDestination();
        return synth;
      }

      createAMSynth = () => {
        const amSynth = new Tone.AMSynth().toDestination();
        return amSynth;
      }

      createMonoSynth = () => {
        const monoSynth = new Tone.MonoSynth({
            oscillator: {
                type: "square"
            },
            envelope: {
                attack: 0.1
            }
        }).toDestination();
        return monoSynth;
      }


      /*
        Starts Tone.JS and sets up keyboard
      */
      componentDidMount () {
        navigator.requestMIDIAccess()
            .then((midiAccess) => this.onMIDISuccess(midiAccess), 
        (error) => this.onMIDIFailure(error));
        Tone.start();
        Tone.setContext(new AudioContext({ sampleRate: 44100 }));
        Tone.Master.volume.value = -6;
        this.initalizeKeyboard();
        this.state.selectedSound = 'synth';
      }

      /**
 * If WebMIDI API connection is successful, get MIDI inputs
 * @param {*} midiAccess 
 */
onMIDISuccess(midiAccess)
{
    //Tone.start();
    console.log("WebMIDI is supported in browser.");
    console.log(midiAccess);
    midiAccess.addEventListener('statechange', this.updateDevices);
    this.midi = midiAccess;

    const midiIns = midiAccess.inputs;
    const inputs = midiIns.values();
    let keyboard = null;

    // list midi inputs to console
    if (inputs != null)
    {
        for(let input of inputs)
        {

            console.log(`Found MIDI input: ${input.name}, ID: ${input.id}`);
            if(input.name === "V49")
            {
                keyboard = input;
                this.state.selectedDevice = input.name; // used for testing
            }
            //input.onMIDIMessage = this.onMIDIMessage.bind(this);
        }
    }
    else
    {
        console.log("No MIDI inputs detected.");
    }

    if(keyboard != null)
    {
        this.useKeyboard(keyboard);
    }
    
}



      useKeyboard = (midiKeyboard) =>
        {
    
                midiKeyboard.onmidimessage =  (event) =>
                {
                    const command = event.data[0];
                    const noteInput = event.data[1];
                    const velocity = event.data[2];
                    const note = this.midiToNote(noteInput);

                    switch (command)
                    {
                        
                        case 144: // note on
                            if(velocity > 0)
                            {
                                this.addNote(note);

                                if (this.state.selectedSound === 'synth') {
                                    const synth = this.createSynth();
                                    synth.triggerAttackRelease(Tone.Midi(noteInput).toFrequency(), "4n");
                                    } else if (this.state.selectedSound === 'amSynth') {
                                    const amSynth = this.createAMSynth();
                                    amSynth.triggerAttackRelease(note, "4n");
                                    } else if (this.state.selectedSound === 'monosynth') {
                                    const monoSynth = this.createMonoSynth();
                                    monoSynth.triggerAttackRelease(note, "4n");
                                    } else if (this.state.selectedSound === 'casio') {
                                    this.sampler.triggerAttackRelease(note, "4n"); // TODO: fix
                                    }
                            
                            }
                            
                            break;
                        case 128: // note off
                            this.removeNote(note);
                            break;
                        case 153: // drum pads
                        // TODO: add separate instances
                            if (noteInput === 49) {
                                this.kickPlayer.start(0.5);
                            } else if (noteInput === 41) {
                                this.snarePlayer.start(0.5);
                            } else if (noteInput === 42) {
                                this.tom1Player.start(0.5);
                            } else if (noteInput === 46) {
                                this.tom2Player.start(0.5);
                            } else if (noteInput === 36) {
                                this.tom3Player.start(0.5);
                            } else if (noteInput === 37) {
                                this.hiHatPlayer.start(0.5);
                            } else if (noteInput === 38) {
                                this.bongoSnarePlayer.start(0.5);
                            } else if (noteInput === 39) {
                                this.bongoTomPlayer.start(0.5);
                            }
                            break;
                        default:
                            break;

                            /* COMMANDS:
                            * command 224 = pitch wheel, 176 = mod wheel
                            * 153/137 - pads
                            * 176 - buttons 
                            * drums: 49 - 41 - 42 - 46
                            * drums: 36 - 37 - 38 - 39
                            */
                        }
                };
        
            }

      /*
        - Sets up keyboard using AudioKeys and allows QWERTY keyboard input
        - Maps MIDI notes to music notes
        - Triggers audio output with keydown event
        - Stores current notes / chord being played
      */
      initalizeKeyboard () {

        // set up connected keyboard - will add other devices
        let midiKeyboard = null;

        if(midiKeyboard != null)
        {
          this.useKeyboard(midiKeyboard);
        }

        const keyboard = new AudioKeys({
            polyphony: 10, // Adjust the polyphony as needed
        });

        const keyToNote = {
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
            73: 'B4', // J
            74: 'C5', // K
            79: 'Db5', // O
            80: 'Ab4', // P
          };

        /*
          Triggers audio output, converts MIDI note to music note, and adds note to notes played
        */
        keyboard.down((e) => {
            const note = keyToNote[e.keyCode];

            if(note)
            {

                this.addNote(note);

                if (this.state.selectedSound === 'synth') {
                    const synth = this.createSynth();
                    synth.triggerAttackRelease(note, "4n");
                  } else if (this.state.selectedSound === 'amSynth') {
                    const amSynth = this.createAMSynth();
                    amSynth.triggerAttackRelease(note, "4n");
                  } else if (this.state.selectedSound === 'monosynth') {
                    const monoSynth = this.createMonoSynth();
                    monoSynth.triggerAttackRelease(note, "4n");
                  } else if (this.state.selectedSound === 'sampler') {
                    this.sampler.triggerAttackRelease(note, "4an");
                  }
            }
        });

        /*
            Stops audio output and removes note from notes played
        */
        keyboard.up((e) => {

            const note = keyToNote[e.keyCode];

            this.removeNote(note);
            /*this.synth.triggerRelease();
            this.amSynth.triggerRelease();
            this.monosynth.triggerRelease();
            //this.sampler.triggerRelease();*/
        })
        
        }

        
        /*
        * Converts MIDI input (number value) to note value and octave
        * Example: #28 -> E1
        */
        midiToNote = (midiInput) =>
        {
        const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
        const octave = Math.floor(midiInput / 12) -1;
        const noteIndex = midiInput % 12;

        const noteName = noteNames[noteIndex];
        return noteName + octave;
        }

    /*
        Adds note to chordNotes state to be displayed
    */
    addNote = (newNote) => {

        this.setState((prevState) => {
            if(!prevState.chordNotes.includes(newNote)) {
                return {
                    chordNotes: [...prevState.chordNotes, newNote],
                }
            }
            return prevState;

        })

    }

    /*
        Removes note from chordNotes state
    */
    removeNote = (oldNote) => {
        this.setState((prevState) => ({ chordNotes:
            [...prevState.chordNotes.filter((note) => note !== oldNote), ]}));
    }

    /*
        Selects instrument type based on user option
    */
    handleButtonClick = (instrument, e) => {
        e.preventDefault();
        console.log("Selected: " + instrument);

        if(instrument === 'synth') {
            this.state.selectedSound = 'synth';
        } else if (instrument === 'amsynth') {
            this.state.selectedSound = 'amSynth';
        } else if (instrument === 'monosynth') {
            this.state.selectedSound = 'monosynth';
        } else if (instrument === 'casio') {
            this.state.selectedSound = 'casio';
        } else if (instrument === 'qwerty')
        {
            //console.log("no audio set up.");
        } else {
            console.log("Uh oh, no instrument connected.");
        }
    }

    /*
        - Starter code to display the chord being played (not used yet)
        - TODO: implement additional instruments, samples, and intervals
    */
    getChord () {
    
        const root = this.currentChord[0];
        const note2 = this.currentChord[1];
        const note3 = this.currentChord[2];

        console.log("Root: " + root);
        console.log(this.currentChord);

        const interval1 = note2 - root;
        const interval2 = note3 - root;

        if (interval1 === 4 && interval2 === 7) {
            console.log("Major");
        } else if (interval1 === 3 && interval2 === 7) {
            console.log("Minor");
        } else {
            console.log("Other");
        }
    }   

    /*
        Renders user session and displays available sounds and notes played
    */
    render()
    {
        // get user session cookie if applicable
        const isAuthenticated = !!Cookies.get('token');
        const firstName = Cookies.get('name');

        return(
            <div className="container d-flex flex-column align-items-center">
                <div className="text-center m-4">
                    {isAuthenticated ? (
                        <div>
                            <h1>Welcome, {firstName}!</h1>
                            <button onClick={(e) => this.handleLogout()}>Log Out</button>
                        </div>
                    ) : (
                        <div>
                            <h1>MIDI Made Simple.</h1>
                        </div>
                    )}
                </div>
                <div className="text-center container w-50">
                    <div className="pb-4">
                        <h2>Sounds</h2>
                    </div>
                    <ul className="list-group">
                        <li className="list-group-item list-group-item action flex-column align-items-start p-3">
                            <p>Synth</p>
                            <button onClick={(e) => this.handleButtonClick('synth', e)}>Select</button>
                        </li>
                        <li className="list-group-item list-group-item action flex-column align-items-start p-3">
                            <p>AM Synth</p>
                            <button onClick={(e) => this.handleButtonClick('amsynth', e)}>Select</button>
                        </li>
                        <li className="list-group-item list-group-item action flex-column align-items-start p-3">
                            <p>Mono Synth</p>
                            <button onClick={(e) => this.handleButtonClick('monosynth', e)}>Select</button>
                        </li>
                        <li className="list-group-item list-group-item action flex-column align-items-start p-3">
                            <p>Casio Keyboard</p>
                            <button onClick={(e) => this.handleButtonClick('casio', e)}>Select</button>
                        </li>
                    </ul>
                </div>
                <div className="m-3">
                    <h3 className="ml-2 w-100">Notes:</h3>
                        <span className="h2">{this.state.chordNotes.map((note) => (
                        <p className="d-inline" key={note}> {note} </p>
                    ))}</span>
                </div>
            </div>
        )
    }
}

export default Play;