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

        // TODO: implement
        /*this.drumSampler = new Tone.Sampler({
            urls: {
            kick: "kick.mp3",
            snare: "snare.mp3",
            tom1: "tom1.mp3",
            tom2: "tom2.mp3",
            hihat: "hihat.mp3"
            
        },
	        baseUrl: "https://tonejs.github.io/audio/drum-samples/4OP-FM/",
        }).toDestination();*/

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

      createDrumSample = () => {

      }


      /*
        Starts Tone.JS and sets up keyboard
      */
      componentDidMount () {
        Tone.start();
        this.initalizeKeyboard();
      }

      /*
        - Sets up keyboard using AudioKeys and allows QWERTY keyboard input
        - Maps MIDI notes to music notes
        - Triggers audio output with keydown event
        - Stores current notes / chord being played
      */
      initalizeKeyboard () {
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
                            <button onClick={(e) => this.handleButtonClick('sampler', e)}>Select</button>
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