import React from 'react';
import * as Tone from 'tone';
import AudioKeys from 'audiokeys';
import Cookies from 'js-cookie';
import SoundCard from '../cards/SoundCard';
import Sound from '../sound/Sound';
import axios from 'axios';
import { ListItem, List, FormControl, FormLabel, RadioGroup, FromControlLabel, ListItemButton, ListItemText, ListItemIcon, Radio, Box, FormControlLabel } from '@mui/material';


/**
 *   Contains the Tone.JS instruments and references online samples
 *   Allows user to select between instruments
 *   Displays notes played
 */
class Play extends React.Component
{
    // used to instantiate synthesizers from Tone.JS, selected sound, and notes/chords played
    constructor(props) {
        super(props);
        this.synths = {};
        this.amSynths = {};
        this.monoSynths = {};
        this.casioSamples = {};

        this.useQwerty = true;

        // TODO: move all drums into kit in future implementation
        /*const drumKit = new Tone.Players({
            "kick": "https://tonejs.github.io/audio/drum-samples/4OP-FM/snare.mp3",
        }).toDestination();*/

        this.hiHatPlayer = new Tone.Player("https://tonejs.github.io/audio/drum-samples/4OP-FM/hihat.mp3").toDestination();
        this.bongoSnarePlayer = new Tone.Player("https://tonejs.github.io/audio/drum-samples/Bongos/snare.mp3").toDestination();
        this.bongoTomPlayer = new Tone.Player("https://tonejs.github.io/audio/drum-samples/Bongos/tom1.mp3").toDestination();

        this.state = {
            selectedSound: '', // default device
            chordNotes: [],
            soundObjects: [],
            isLoading: true,
            url: '',
            midiDevices: []
        }

      }

      /**
       * Creates an instance of the synth
       * @returns instance
       */
      createSynth = () => {
        const synth = new Tone.Synth().toDestination();
        return synth;
      }

      /**
       * Creates an instance of the AM Synth
       * @returns instance
       */
      createAMSynth = () => {
        const amSynth = new Tone.AMSynth().toDestination();
        return amSynth;
      }

      /**
       * Creates an instance of the mono synth
       * @returns instance
       */
      createMonoSynth = () => {
        const monoSynth = new Tone.MonoSynth({
            oscillator: {
                type: "square"
            },
            envelope: {
                attack: 0.1
            }
        }).toDestination();
        monoSynth.volume.value = -5;
        return monoSynth;
      }

      /**
       * Creates an instance of the QWERTY keyboard
       * @returns instance
       */
      createQwerty = () => {
        const keyboard = new AudioKeys({
            polyphony: 10, // Adjust the polyphony as needed
        });
        return keyboard;
      }

      /**
       * Creates an instance of the sampler
       * @param {*} note 
       */
      createSampler = (note) => {
        const casio = new Tone.Sampler({
            urls: {
            A1: "A1.mp3",
            A2: "A2.mp3",
        },
	        baseUrl: "https://tonejs.github.io/audio/casio/",
            onload: () => {
                casio.triggerAttackRelease(note, 0.8);
            }
        }).toDestination();
      }

      /**
       * Creates an instance of the online sampler (used for online URLs)
       * @param {*} note 
       * @param {*} url 
       */
      createOnlineSampler = (note, url) => {
        const sampler = new Tone.Sampler({
            urls: {
            A1: "A1.mp3",
            A2: "A2.mp3",
        },
	        baseUrl: url,
            onload: () => {
                sampler.triggerAttackRelease(note, 0.8);
            }
        }).toDestination();
      }

      /**
       * Creates an instance of the kick
       */
      createKickPlayer = () => {

        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/4OP-FM/kick.mp3", function(){
            const kickPlayer = new Tone.Player(buffer.get()).toDestination();
            kickPlayer.start(0.5);

        });
      }

      /**
       * Creates an instance of the snare
       */
      createSnarePlayer = () => {

        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/4OP-FM/snare.mp3", function(){
            const snarePlayer = new Tone.Player(buffer.get()).toDestination();
            snarePlayer.start(0.5);

        });
      }

      /**
       * Creates an instance of tom1
       */
      createTom1Player = () => {

        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/4OP-FM/tom1.mp3", function(){
            const tom1Player = new Tone.Player(buffer.get()).toDestination();
            tom1Player.start(0.5);

        });
      }

      /**
       * Creates an instance of tom2
       */
      createTom2Player = () => {

        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/4OP-FM/tom2.mp3", function(){
            const tom2Player = new Tone.Player(buffer.get()).toDestination();
            tom2Player.start(0.5);

        });
      }

      /**
       * Creates an instance of tom3 (floor tom)
       */
      createTom3Player = () => {

        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/4OP-FM/tom3.mp3", function(){
            const tom3Player = new Tone.Player(buffer.get()).toDestination();
            tom3Player.start(0.5);

        });
      }

      /**
       * Creates an instance of the hi-hat
       */
      createHiHatPlayer = () => {

        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/4OP-FM/hihat.mp3", function(){
            const hiHatPlayer = new Tone.Player(buffer.get()).toDestination();
            hiHatPlayer.start(0.5);

        });
      }

      /**
       * Creates an instance of a bongo sound
       */
      createBongo1Player = () => {

        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/Bongos/snare.mp3", function(){
            const hiHatPlayer = new Tone.Player(buffer.get()).toDestination();
            hiHatPlayer.start(0.5);

        });
      }

      /**
       * Creates an instance of another bongo sound
       */
      createBongo2Player = () => {

        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/Bongos/tom1.mp3", function(){
            const bongo2Player = new Tone.Player(buffer.get()).toDestination();
            bongo2Player.start(0.5);
        });
      }

      /**
       * Starts tone.JS and sets up sounds
       */
      componentDidMount () {
        // TODO: add check to ensure midi access works in app.js
            Tone.start();
            Tone.setContext(new AudioContext({ sampleRate: 48000 }));
            Tone.Master.volume.value = -6;
            this.initalizeKeyboard();
            this.initializeSounds();
      }

      /**
       * Ensures sounds are loaded before receiving favorite sounds
       */
      async initializeSounds() {
        await this.getAllSounds();
        this.getAllFavorites();
      }

    /**
     * Used to set up MIDI keyboard with note mappings, sounds, and MIDI events
     * @param {*} midiKeyboard 
     */
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
                            /*if (Tone.context.state !== 'closed') {
                                Tone.context.close();
                            }*/
                        } else if (this.state.selectedSound === 'amsynth') {
                            const amSynth = this.createAMSynth();
                            amSynth.triggerAttackRelease(note, "4n");
                        } else if (this.state.selectedSound === 'monosynth') {
                            const monoSynth = this.createMonoSynth();
                            monoSynth.triggerAttackRelease(note, "4n");
                        } else if (this.state.selectedSound === 'casio') {
                            this.createSampler(note);
                        } else if (this.state.selectedSound === 'online') {
                            this.createOnlineSampler(note, this.state.url);
                        }
                    
                    }
                    break;
                case 128: // note off
                    this.removeNote(note);
                    break;
                case 153: // drum pads
                    if (noteInput === 49) {
                        this.createKickPlayer();
                    } else if (noteInput === 41) {
                        this.createSnarePlayer();
                    } else if (noteInput === 42) {
                        this.createTom1Player();
                    } else if (noteInput === 46) {
                        this.createTom2Player();
                    } else if (noteInput === 36) {
                        this.createTom3Player();
                    } else if (noteInput === 37) {
                        this.createHiHatPlayer();
                    } else if (noteInput === 38) {
                        this.createBongo1Player();
                    } else if (noteInput === 39) {
                        this.createBongo2Player();
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

    /**
     * - Sets up keyboard using AudioKeys and allows QWERTY keyboard input
            - Maps MIDI notes to music notes
            - Triggers audio output with keydown event
            - Stores current notes / chord being played
     */
    initalizeKeyboard () {

        // set up connected keyboard - will add other devices in future implentations
        let midiKeyboard = null;

        if(midiKeyboard != null)
        {
            this.useKeyboard(midiKeyboard);
        }

        const keyboard = this.createQwerty();

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

            if(this.state.selectedSound === "qwerty") {
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
                    } else if (this.state.selectedSound === 'qwerty') {
                        const synth = new Tone.Synth().toDestination();
                        synth.triggerAttackRelease(note, '8n');
                    }
                }
            } else {
                // TODO: pass variable to other components
            }  
        });

    /*
        Stops audio output and removes note from notes played
    */
        keyboard.up((e) => {

            if(this.state.selectedSound === "qwerty") {
                const note = keyToNote[e.keyCode];

            this.removeNote(note);

            // will add longer note duration in future implentations
            /*this.synth.triggerRelease();
            this.amSynth.triggerRelease();
            this.monosynth.triggerRelease();
            //this.sampler.triggerRelease();*/
            }

            
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
        console.log('adding ' + newNote);
        this.setState((prevState) => {
            if(!prevState.chordNotes.includes(newNote)) {
                return {
                    chordNotes: [...prevState.chordNotes, newNote],
                }
            }
            return prevState;

        })

        //console.log(this.state.chordNotes);

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
    handleButtonClick = (instrument, location) => {
        console.log("Selected: " + instrument + " at " + location);

        if(location === "react" || !location) {
            if(instrument === 'Synth') {
                this.state.selectedSound = 'synth';
            } else if (instrument === 'AM Synth') {
                this.state.selectedSound = 'amsynth';
            } else if (instrument === 'Mono Synth') {
                this.state.selectedSound = 'monosynth';
            } else if (instrument === 'Casio Piano') {
                this.state.selectedSound = 'casio';
            } else if (instrument === 'QWERTY') {
                this.setState( { selectedSound: 'qwerty' });
            } else {
                console.log("No instrument found on front-end for selected instrument.");
            }
        } else if (location === "") {
            console.log("Could not load sample because URL is blank.");
        } else { // external sample
            this.setState({selectedSound: 'online'});
            this.setState({url: location});
        }
    }

    /*
        - Starter code to display the chord being played (not used yet)
        - TODO: implement additional instruments, samples, and intervals
    */
    getChord (chord)
    {

        // only works for three note chords
        if (chord.length === 3) {
            const root = this.currentChord[0];
            const note2 = this.currentChord[1];
            const note3 = this.currentChord[2];

            console.log("Root: " + root);
            //console.log(this.currentChord);

            const interval1 = note2 - root;
            const interval2 = note3 - root;

            if (interval1 === 4 && interval2 === 3) { // MAJOR
                console.log("Major");
            } else if (interval1 === 3 && interval2 === 4) { // MINOR
                console.log("Minor");
            } else if (interval1 === 4 && interval2 === 3 && note3 - note2 === 4) { // MAJ 7
                console.log("Major 7th");
            } else if (interval1 === 3 && interval2 === 4 && note3 - note2 === 3) { // MIN 7
                console.log("Minor 7th");
            } else if (interval1 === 4 && interval2 === 2) {
                console.log("Major 6th");
            } else if (interval1 === 3 && interval2 === 3) {
                console.log("Minor 6th");
            } else if (interval1 === 5 && interval2 === 2) {
                console.log("Sus4");
            } else if (interval1 === 2 && interval2 === 3) {
                console.log("sus2");
            } else if (interval1 === 4 && interval2 === 4) {
                console.log("augmented");
            } else if (interval1 === 3 && interval2 === 3) {
                console.log("Diminished");
            } else if (interval1 === 4 && interval2 === 3 && note3 - note2 === 6) {
                console.log("Dominant 7th");
            } else if (interval1 === 4 && interval2 === 3 && note3 - note2 === 8) {
                console.log("Augmented 7th");
            } else if (interval1 === 3 && interval2 === 3 && note3 - note2 === 6) {
                console.log("Half-Diminished 7th");
            } else if (interval1 === 3 && interval2 === 3 && note3 - note2 === 9) {
                console.log("Diminished 7th");
            } else {
                console.log("Other");
            }
        }

        
    }  
    
    /**
     * Retrieves all sounds from the database
     */
    getAllSounds = async () => {
        try {
            const result = await axios.get('http://localhost:3000/all-sounds');

            if (result.status === 200) {
                const sounds = result.data.map(sound => new Sound(sound.id, sound.name, sound.source, sound.isFavorite));
                console.log(sounds);

                this.setState({ soundObjects: sounds, isLoading: false });
            } else {
                console.log("Error");
            }

        } catch (error) {
            console.log("Database error.");
        }
    }

    /**
     * Retrieves all favorite sounds from the database
     * Only called when user is logged in with a valid token
     */
    getAllFavorites = async () => {

        const token = Cookies.get('token');
        console.log(token);

        try {
            const result = await axios.get('http://localhost:3000/all-favorites', {
                headers:{
                    Authorization: `Bearer ${token}`
                }
                });

            if (result.status === 200) {
                if(result.data.length > 0) {

                    const favorites = result.data.map(sound => new Sound(sound.id, sound.name, sound.source));

                    for(let i = 0; i < favorites.length; i++) {

                        for(let j = 0; j < this.state.soundObjects.length; j++) {

                            if(favorites[i].id === this.state.soundObjects[j].id) {

                                const updatedSoundObjects = [...this.state.soundObjects];

                                updatedSoundObjects[j].isFavorite = true;
                                this.setState({ soundObjects : updatedSoundObjects });
                                break;

                            }

                        }
                    }

                    console.log("favorites");
                    console.log(this.state.soundObjects);

                } else {
                    console.log("No favorites to show.");
                }

                
            } else if (result.status === 404) {
                console.log("No favorites to show for user");
            } else {
                console.log("Error");
            }


        } catch (error) {
            console.log("Caught - Database error." + error);
        }
    }

    /**
     * Adds a specified sound to the user's favorites
     * Only called if user is logged in with a valid token
     * @param {*} soundName 
     */
    addFavorite = async (soundName) => {

        try {
            const response = await axios.post('http://localhost:3000/add-favorite', {
                token: Cookies.get('token'),
                sound: soundName
            });
    
            console.log(response);
    
            for (let i = 0; i < this.state.soundObjects.length; i++) {
                if (this.state.soundObjects[i].name === soundName) {
                    const updatedSoundObjects = [...this.state.soundObjects];
                    updatedSoundObjects[i].isFavorite = true;
                    this.setState({ soundObjects: updatedSoundObjects });
                    break; // Once found, exit the loop
                }
            }
    
            console.log(this.state.soundObjects);
        } catch (error) {
            console.log(error);
        }

        
    }

    /**
     * Removes a specified sound from the user's favorites
     * Only called if user is logged in with a valid token
     * @param {*} soundName 
     */
    removeFavorite = async (soundName) => {
        const token = Cookies.get('token');
    
        try {
            const response = await axios.delete(`http://localhost:3000/remove-favorite/${soundName}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            console.log(response);
            // Check if the sound is present in state and update its isFavorite property
            const updatedSoundObjects = this.state.soundObjects.map(sound => {
                if (sound.name === soundName) {
                    return { ...sound, isFavorite: false };
                }
                return sound;
            });

        // Update state with the modified soundObjects array
        this.setState({ soundObjects: updatedSoundObjects });
            
        } catch (error) {
            console.log(error);
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
        const { soundObjects, isLoading } = this.state;

        {/* TODO: combine lists so it is one comprehensive list? or categorize better */}
        return(
            
            <div className="container d-flex flex-column align-items-center">
                <div className="text-center m-4">
                    {isAuthenticated ? (
                        <div>
                            <h1>Welcome, {firstName}!</h1>
                        </div>
                    ) : (
                        <div>
                            <h1>MIDI Made Simple.</h1>
                        </div>
                    )}
                </div>
                <div className="text-center container w-50">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="pb-4">
                                {isLoading ? (
                                    <p>Could not load sounds from database. Please refresh to try again.</p>
                                ) : (
                                    <Box sx={{ width: '100%', maxWidth: 260, bgColor: 'background.paper' }}>
                                        <FormControl>
                                            <FormLabel>Sounds</FormLabel>
                                            <RadioGroup
                                                aria-label="sounds"
                                                name="sound-group"
                                                defaultValue="synth"
                                                /*onChange={(e) => this.handleButtonClick1(e.target.value)}*/
                                                >
                                                  <List
                                            sx = {{
                                                '& .MuiListItem-root': {
                                                    borderRadius: '8px',
                                                    backgroundColor: 'black',
                                                    marginBottom: '8px',
                                                    color: 'white'
                                                  },
                                                  '& .MuiRadio-root': {
                                                    color: 'white', // Radio button color
                                                  },
                                                  '& .MuiSvgIcon-root': {
                                                    stroke: 'white', // Star icon outline color
                                                  },
                                            }}
                                            >
                                        {this.state.soundObjects.map(sound => (
                                            <SoundCard key={sound.id} id={sound.id} name={sound.name} location={sound.location} isFavorite={sound.isFavorite} isLoggedIn={isAuthenticated} onSelect={this.handleButtonClick} addFavorite={this.addFavorite} removeFavorite={this.removeFavorite} />
                                        ))}
                                        </List> 
                                            </RadioGroup>
                                        </FormControl>
                                    </Box>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="m-3">
                    <h3 className="ml-2 w-100">Notes:</h3>
                </div>
                <div>
                    {/* Displays current chord for user */}
                    <span className="h2">
                        {this.state.chordNotes.map((note) => (
                            <p className="d-inline" key={note}> {note}</p>
                        ))}
                    </span>
                </div>
            </div>
        )
    }
}

export default Play;