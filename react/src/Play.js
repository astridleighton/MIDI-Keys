import React from 'react';
import * as Tone from 'tone';
import AudioKeys from 'audiokeys';
import Cookies from 'js-cookie';
import SoundCard from './SoundCard';
import Sound from './Sound';
import axios from 'axios';
import { ListItem, List, FormControl, FormLabel, RadioGroup, FromControlLabel, ListItemButton, ListItemText, ListItemIcon, Radio, Box, FormControlLabel } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import IconButton from '@mui/material/IconButton';


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
            favoriteSoundObjects: []
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

      createOnlineSampler = (note, url) => {
        const casio = new Tone.Sampler({
            urls: {
            A1: "A1.mp3",
            A2: "A2.mp3",
        },
	        baseUrl: url,
            onload: () => {
                casio.triggerAttackRelease(note, 0.8);
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
            navigator.requestMIDIAccess()
            .then((midiAccess) => this.onMIDISuccess(midiAccess), 
            (error) => this.onMIDIFailure(error));
            Tone.start();
            Tone.setContext(new AudioContext({ sampleRate: 48000 }));
            Tone.Master.volume.value = -6;
            this.initalizeKeyboard();
            this.getAllSounds();
            this.getAllFavorites();
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
                        } else if (this.state.selectedSound === 'amSynth') {
                            const amSynth = this.createAMSynth();
                            amSynth.triggerAttackRelease(note, "4n");
                        } else if (this.state.selectedSound === 'monosynth') {
                            const monoSynth = this.createMonoSynth();
                            monoSynth.triggerAttackRelease(note, "4n");
                        } else if (this.state.selectedSound === 'casio') {
                            this.createSampler(note);
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

        /*
            - Sets up keyboard using AudioKeys and allows QWERTY keyboard input
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

        this.setState((prevState) => {
            if(!prevState.chordNotes.includes(newNote)) {
                return {
                    chordNotes: [...prevState.chordNotes, newNote],
                }
            }
            return prevState;

        })

        console.log(this.state.chordNotes);

        // TODO: fix why note is not showing up, connect to chord function

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
        //e.preventDefault();
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
            this.setState( { selectedSound: 'qwerty' });
        } else {
            console.log("Uh oh, no instrument connected.");
        }
    }

    // TODO: get rid of other function

    handleButtonClick1 = (value) => {
        //e.preventDefault();
        const instrument = value;
        alert("Selected: " + instrument);

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
            this.setState( { selectedSound: 'qwerty' });
        } else {
            console.log("Uh oh, no instrument connected.");
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
    
    getAllSounds = async () => {
        try {
            const result = await axios.get('http://localhost:3000/all-sounds');

            if (result.status === 200) {
                console.log("200");

                const sounds = result.data.map(sound => new Sound(sound.id, sound.name, sound.location));
                //console.log(sounds);

                this.setState({ soundObjects: sounds, isLoading: false });
            } else {
                console.log("Error");
            }


        } catch (error) {
            console.log("Database error.");
        }
    }

    getAllFavorites = async () => {

        const token = Cookies.get('token');
        const userFirstName = Cookies.get('name');

        // TODO: if token is valid, get all favorites from user

        const username = "aleighton1";

        try {
            const result = await axios.get(`http://localhost:3000/all-favorites/${username}`);

            if (result.status === 200) {
                console.log("200");

                const favorites = result.data.map(sound => new Sound(sound.id, sound.name, sound.location));
                //console.log(sounds);

                this.setState({ favoriteSoundObjects: favorites, isLoading: false });
            } else {
                console.log("Error");
            }


        } catch (error) {
            console.log("Database error.");
        }
    }

    addFavorite = (soundName) => {

        // TODO: only call if user is logged in
        // TODO: do not hard-code username, get from cookies?

        axios.post('http://localhost:3000/add-favorite', {
            username: 'aleighton1',
            sound: soundName
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    removeFavorite = (soundName) => {

        // TODO: only call if user is logged in
        // TODO: do not hard-code username, get from cookies?

        const username = 'aleighton1';

        axios.delete(`http://localhost:3000/remove-favorite/${username}/${soundName}`)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    handleAddFavorite = async (sound, e) => {
        e.preventDefault();
        await this.addFavorite(sound);
    }

    handleRemoveFavorite = async (sound, e) => {
        e.preventDefault();
        await this.removeFavorite(sound);
    }

    handleStarClick = async (e) => {
        alert("you clicked the star");
    }

    /*
        Idea: get all sounds and then have a favorited state on the sound in the sound.js file
            - can either remove this from soundlist or set as a different color somehow, maybe user master soundlist
    */

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
                            <button onClick={(e) => this.handleAddFavorite("synth", e)}>Add Favorite</button>
                            <button onClick={(e) => this.handleRemoveFavorite("synth", e)}>Remove Favorite</button>
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
                                <h2>Samples</h2>
                                {isLoading ? (
                                    <p>Loading sounds from database...</p>
                                ) : (
                                    <Box sx={{ width: '100%', maxWidth: 260, bgColor: 'background.paper' }}>
                                        <FormControl>
                                            <RadioGroup
                                                aria-label="sounds"
                                                name="build-in-sounds"
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
                                            <SoundCard key={sound.id} id={sound.id} name={sound.name} />
                                        ))}
                                        </List> 
                                            </RadioGroup>
                                        </FormControl>
                                    </Box>
                                )}
                            </div>
                        </div>
                        <div>
                            <Box sx={{ width: '100%', maxWidth: 260, bgColor: 'background.paper' }}>
                            <FormControl>
                                <FormLabel>Built In</FormLabel>
                                <RadioGroup
                                    aria-label="sounds"
                                    name="build-in-sounds"
                                    defaultValue="synth"
                                    onChange={(e) => this.handleButtonClick1(e.target.value)}
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
                                        <SoundCard
                                            name="synth (test)"
                                            onSelect={this.handleButtonClick1}
                                            onFavorite={this.handleAddFavorite}
                                            />
                                        <ListItem>
                                            <FormControlLabel
                                            value="synth"
                                            control={<Radio />}
                                            label="Synth"
                                            />
                                            <ListItemIcon>
                                                <IconButton
                                                    color="white"
                                                    onClick={() => this.handleStarClick('test')}>
                                                        <StarIcon />
                                                    </IconButton>
                                                
                                            </ListItemIcon>
                                        </ListItem>
                                        <ListItem>
                                            <FormControlLabel
                                            value="amsynth"
                                            control={<Radio />}
                                            label="AM Synth"
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <FormControlLabel
                                            value="monosynth"
                                            control={<Radio />}
                                            label="Mono Synth"
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <FormControlLabel
                                            value="casio"
                                            control={<Radio />}
                                            label="Casio Piano (Sample)"
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <FormControlLabel
                                            value="qwerty"
                                            control={<Radio />}
                                            label="Qwerty"
                                            />
                                        </ListItem>
                                        </List>
                                    </RadioGroup>
                            </FormControl>
                            </Box>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div>
                            {isAuthenticated ? (
                                <div>
                                    <h2>Favorites</h2>
                                    <ul>
                                        {/* Displays favorites for user - TODO: return list of sounds, or correlate ID to sample list */}
                                        {this.state.favoriteSoundObjects.map(sound => (
                                        <SoundCard key={sound.id} sound={sound} />
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                               <p>{/* Does nothing */}</p> 
                            )}
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