import React, {useState, useEffect} from 'react';
import * as Tone from 'tone';
import AudioKeys from 'audiokeys';
import Cookies from 'js-cookie';
import SoundCard from '../cards/SoundCard';
import Sound from '../sound/Sound';
import axios from 'axios';
import { ListItem, List, FormControl, FormLabel, RadioGroup, FromControlLabel, ListItemButton, ListItemText, ListItemIcon, Radio, Box, FormControlLabel, Switch, FormGroup } from '@mui/material';

import './Play.scss'
// import { useMIDIContext } from '../App';

/**
 *   Contains the Tone.JS instruments and references online samples
 *   Allows user to select between instruments
 *   Displays notes played
 */
const Play = ({connectedDevice}) =>
{
    // used to instantiate synthesizers from Tone.JS, selected sound, and notes/chords played
    // TODO: move all drums into kit in future implementation
        /*const drumKit = new Tone.Players({
            "kick": "https://tonejs.github.io/audio/drum-samples/4OP-FM/snare.mp3",
        }).toDestination();*/

        // TODO: always leave qwerty on?
        // TODO: triggerrelease and remove arrays - change to constants
        // TODO: add chord updates

    const isAuthenticated = !!Cookies.get('token');
    const firstName = Cookies.get('name');

    const [synths, setSynths] = useState({});
    const [amSynths, setAmSynths] = useState({});
    const [monoSynths, setMonoSynths] = useState({});
    const [casioSamples, setCasioSamples] = useState({});
    const [synthTest] = useState(new Tone.Synth().toDestination());
    
    const [useQwerty, setUseQwerty] = useState(true);

    const [hiHatPlayer] = useState(new Tone.Player("https://tonejs.github.io/audio/drum-samples/4OP-FM/hihat.mp3").toDestination());
    const [bongoSnarePlayer] = useState(new Tone.Player("https://tonejs.github.io/audio/drum-samples/Bongos/snare.mp3").toDestination());
    const [bongoTomPlayer] = useState(new Tone.Player("https://tonejs.github.io/audio/drum-samples/Bongos/tom1.mp3").toDestination());

    const [selectedSound, setSelectedSound] = useState('qwerty');
    const [chordNotes, setChordNotes] = useState([undefined]);
    const [soundObjects, setSoundObjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [url, setURL] = useState('');
    const [midiDevices, setMIDIDevices] = useState([]);
    const [currentChord, setCurrentChord] = useState('');
    const [notesEnabled, setNotesEnabled] = useState(false);
    const [chordEnabled, setChordEnabled] = useState(false);

    /**
       * Starts tone.JS and sets up sounds
       */
    useEffect (() => {
        const initTone = async() => {
            const manuallyConnectedDevice = await manuallyConnectV49();
            Tone.start();
            await Tone.setContext(new AudioContext({ sampleRate: 48000 }));
            Tone.Master.volume.value = -6;
            await setUpQwertyKeyboard();
            await initializeSounds();

            if(manuallyConnectedDevice) {
                console.log('setting up MIDI keyboard');
                await setUpMIDIKeyboard(manuallyConnectedDevice);
            }
        }

        initTone();
  }, []);

    const manuallyConnectV49 = async () => {
        const midiAccess = await navigator.requestMIDIAccess();
        const inputs = Array.from(midiAccess.inputs.values());
        const device = inputs.find(input => input.name === 'V49');
        if (device) {
          return device;
        }
    }

      /**
       * Creates an instance of the synth
       * @returns instance
       */
      const createSynth = () => {
        const synth = new Tone.Synth().toDestination();
        return synth;
      }

      /**
       * Creates an instance of the AM Synth
       * @returns instance
       */
      const createAMSynth = () => {
        const amSynth = new Tone.AMSynth().toDestination();
        return amSynth;
      }

      /**
       * Creates an instance of the mono synth
       * @returns instance
       */
      const createMonoSynth = () => {
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
      const createQwerty = () => {
        const keyboard = new AudioKeys({
            polyphony: 10, // Adjust the polyphony as needed
        });
        return keyboard;
      }

      /**
       * Creates an instance of the sampler
       * @param {*} note 
       */
      const createSampler = (note) => {
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
      const createOnlineSampler = (note, url) => {
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
      const createKickPlayer = () => {

        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/4OP-FM/kick.mp3", function(){
            const kickPlayer = new Tone.Player(buffer.get()).toDestination();
            kickPlayer.start(0.5);

        });
      }

      /**
       * Creates an instance of the snare
       */
      const createSnarePlayer = () => {

        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/4OP-FM/snare.mp3", function(){
            const snarePlayer = new Tone.Player(buffer.get()).toDestination();
            snarePlayer.start(0.5);

        });
      }

      /**
       * Creates an instance of tom1
       */
      const createTom1Player = () => {

        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/4OP-FM/tom1.mp3", function(){
            const tom1Player = new Tone.Player(buffer.get()).toDestination();
            tom1Player.start(0.5);

        });
      }

      /**
       * Creates an instance of tom2
       */
      const createTom2Player = () => {

        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/4OP-FM/tom2.mp3", function(){
            const tom2Player = new Tone.Player(buffer.get()).toDestination();
            tom2Player.start(0.5);

        });
      }

      /**
       * Creates an instance of tom3 (floor tom)
       */
      const createTom3Player = () => {

        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/4OP-FM/tom3.mp3", function(){
            const tom3Player = new Tone.Player(buffer.get()).toDestination();
            tom3Player.start(0.5);

        });
      }

      /**
       * Creates an instance of the hi-hat
       */
      const createHiHatPlayer = () => {

        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/4OP-FM/hihat.mp3", function(){
            const hiHatPlayer = new Tone.Player(buffer.get()).toDestination();
            hiHatPlayer.start(0.5);

        });
      }

      /**
       * Creates an instance of a bongo sound
       */
      const createBongo1Player = () => {

        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/Bongos/snare.mp3", function(){
            const hiHatPlayer = new Tone.Player(buffer.get()).toDestination();
            hiHatPlayer.start(0.5);

        });
      }

      /**
       * Creates an instance of another bongo sound
       */
      const createBongo2Player = () => {

        var buffer = new Tone.Buffer("https://tonejs.github.io/audio/drum-samples/Bongos/tom1.mp3", function(){
            const bongo2Player = new Tone.Player(buffer.get()).toDestination();
            bongo2Player.start(0.5);
        });
      }

      /**
       * Ensures sounds are loaded before receiving favorite sounds
       */
      const initializeSounds = async () => {
        console.log("Getting all sounds and favorites.");
        await getAllSounds();
        await getAllFavorites();
      }

      const handleNotesToggle = () => {
        setNotesEnabled(!notesEnabled);
      }

      const handleChordToggle = () => {
        setChordEnabled(!chordEnabled);
      }

    /**
     * Used to set up MIDI keyboard with note mappings, sounds, and MIDI events
     * @param {*} midiKeyboard 
     */
    const setUpMIDIKeyboard = async(midiKeyboard) =>
    {
        console.log('Setting up MIDI keyboard');
        midiKeyboard.onmidimessage =  async(event) =>
        {
            const command = event.data[0];
            const noteInput = event.data[1];
            const velocity = event.data[2];
            const note = await midiToNote(noteInput);

            switch (command)
            {
                case 144: // note on
                    if(velocity > 0)
                    {
                        await addNote(note);

                        if (selectedSound === 'synth') {
                            const synth = createSynth();
                            synth.triggerAttackRelease(Tone.Midi(noteInput).toFrequency(), "4n");
                        } else if (selectedSound === 'amsynth') {
                            const amSynth = createAMSynth();
                            amSynth.triggerAttackRelease(note, "4n");
                        } else if (selectedSound === 'monosynth') {
                            const monoSynth = createMonoSynth();
                            monoSynth.triggerAttackRelease(note, "4n");
                        } else if (selectedSound === 'casio') {
                            createSampler(note);
                        } else if (selectedSound === 'online') {
                            createOnlineSampler(note, url);
                        }
                    
                    }
                    break;
                case 128: // note off
                    await removeNote(note);
                    break;
                case 153: // drum pads
                    if (noteInput === 49) {
                        createKickPlayer();
                    } else if (noteInput === 41) {
                        createSnarePlayer();
                    } else if (noteInput === 42) {
                        createTom1Player();
                    } else if (noteInput === 46) {
                        createTom2Player();
                    } else if (noteInput === 36) {
                        createTom3Player();
                    } else if (noteInput === 37) {
                        createHiHatPlayer();
                    } else if (noteInput === 38) {
                        createBongo1Player();
                    } else if (noteInput === 39) {
                        createBongo2Player();
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
    const setUpQwertyKeyboard = async() => {

        console.log('Setting up QWERTY keyboard');

        const keyboard = await createQwerty();

        // maps QWERTY keys to notes
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
        keyboard.down(async (e) => {
            console.log(e);
            // TODO: fix so selectedSound is always set as qwerty -- showing as null

            if(selectedSound === "qwerty") {
                const note = keyToNote[e.keyCode];

                if(note)
                {
                    const notes = await addNote(note);
                    // TODO: implement getChord()

                    if (selectedSound === 'synth') {
                        const synth = createSynth();
                        synth.triggerAttackRelease(note, "4n");
                    } else if (selectedSound === 'amSynth') {
                        const amSynth = createAMSynth();
                        amSynth.triggerAttackRelease(note, "4n");
                    } else if (selectedSound === 'monosynth') {
                        const monoSynth = createMonoSynth();
                        monoSynth.triggerAttackRelease(note, "4n");
                    } else if (selectedSound === 'sampler') {
                        this.sampler.triggerAttackRelease(note, "4an");
                    } else if (selectedSound === 'qwerty') {
                        const synth = new Tone.Synth().toDestination();
                        synth.triggerAttackRelease(note, '4n');
                    }
                }
            } else {
                console.log('this should not work');
            }  
        });

    /*
        Stops audio output and removes note from notes played
    */
        keyboard.up(async(e) => {
            console.log(e);

            if(selectedSound === "qwerty") {
                const note = keyToNote[e.keyCode];

            await removeNote(note);
            }

            
        })
        }

    /*
    * Converts MIDI input (number value) to note value and octave
    * Example: #28 -> E1
    */
    const midiToNote = async (midiInput) =>
    {
        const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
        const octave = Math.floor(midiInput / 12) -1;
        const noteIndex = midiInput % 12;

        const noteName = noteNames[noteIndex];
        return noteName + octave;
    }

    /*
        Adds note to state array, checks for duplicates
    */
    const addNote = async (newNote) => {
        setChordNotes((previousChord) => {
            if(!previousChord.includes(newNote)) {
                return [...previousChord, newNote]
            } else {
                return previousChord;
            }
        })        
    }

    /*
        Removes note from state array
    */
    const removeNote = async (oldNote) => {
        const previousChord = chordNotes;
        const newChord = previousChord.filter((note) => note !== oldNote);
        setChordNotes(newChord);
    }

    /*
        Selects instrument type based on user option
    */
    const handleButtonClick = (instrument, location) => {
        console.log("Selected: " + instrument + " at " + location);

        if(location === "react" || !location) {
            if(instrument === 'Synth') {
                setSelectedSound('synth');
            } else if (instrument === 'AM Synth') {
                setSelectedSound('amsynth');
            } else if (instrument === 'Mono Synth') {
                setSelectedSound('monosynth');
            } else if (instrument === 'Casio Piano') {
                setSelectedSound('casio');
            } else if (instrument === 'QWERTY') { // TODO: remove qwerty from here
                setSelectedSound('qwerty');
            } else {
                console.log("No instrument found on front-end for selected instrument.");
            }
        } else if (location === "") {
            console.log("Could not load sample because URL is blank.");
        } else { // external sample
            setSelectedSound('online');
            setURL(location);
        }
    }

    /*
        - Starter code to display the chord being played (not used yet)
        - TODO: implement additional instruments, samples, and intervals
    */
    const getChord = async (notes) =>
    {
        // only works for three note chords
        if (chordNotes && chordNotes.length === 3) {
            const root = currentChord[0];
            const note2 = currentChord[1];
            const note3 = currentChord[2];

            console.log("Root: " + root);

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
    const getAllSounds = async () => {
        try {
            const result = await axios.get('http://localhost:3000/all-sounds');

            if (result.status === 200) {
                const sounds = result.data.map(sound => new Sound(sound.id, sound.name, sound.source, sound.isFavorite));
                console.log(sounds);

                setSoundObjects(sounds);
                setIsLoading(false);
            } else {
                console.log("Error");
            }

        } catch (error) {
            console.error("Could not get sounds from database.", error);
        }
    }

    /**
     * Retrieves all favorite sounds from the database
     * Only called when user is logged in with a valid token
     */
    const getAllFavorites = async () => {

        const token = Cookies.get('token');

        try {
            const result = await axios.get('http://localhost:3000/all-favorites', {
                headers:{
                    Authorization: `Bearer ${token}`
                }
                });
            
                if(result.data.length > 0) {

                    const favorites = result.data.map(sound => new Sound(sound.id, sound.name, sound.source));

                    for(let i = 0; i < favorites.length; i++) {

                        for(let j = 0; j < soundObjects.length; j++) {

                            if(favorites[i].id === soundObjects[j].id) {

                                const updatedSoundObjects = [...soundObjects];

                                updatedSoundObjects[j].isFavorite = true;

                                setSoundObjects(updatedSoundObjects);
                                break;

                            }

                        }
                    }

                    console.log("favorites");
                    console.log(soundObjects);

                } else {
                    console.log("No favorites to show.");
                }
        } catch (error) {
            if (error.status === 403 || error.status === 401) {
                console.log("Unauthorized to load samples");
            } else {
                console.log("An error occurred in loading favorites.")
            }
        }
    }

    /**
     * Adds a specified sound to the user's favorites
     * Only called if user is logged in with a valid token
     * @param {*} soundName 
     */
    const addFavorite = async (soundName) => {

        try {
            const response = await axios.post('http://localhost:3000/add-favorite', {
                token: Cookies.get('token'),
                sound: soundName
            });
    
            console.log(response);
    
            for (let i = 0; i < soundObjects.length; i++) {
                if (soundObjects[i].name === soundName) {
                    const updatedSoundObjects = [...soundObjects];
                    updatedSoundObjects[i].isFavorite = true;
                    setSoundObjects(updatedSoundObjects);
                    break; // Once found, exit the loop
                }
            }
    
            console.log(soundObjects);
        } catch (error) {
            console.log(error);
        }

        
    }

    /**
     * Removes a specified sound from the user's favorites
     * Only called if user is logged in with a valid token
     * @param {*} soundName 
     */
    const removeFavorite = async (soundName) => {
        const token = Cookies.get('token');
    
        try {
            const response = await axios.delete(`http://localhost:3000/remove-favorite/${soundName}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            console.log(response);
            // Check if the sound is present in state and update its isFavorite property
            const updatedSoundObjects = soundObjects.map(sound => {
                if (sound.name === soundName) {
                    return { ...sound, isFavorite: false };
                }
                return sound;
            });

        // Update state with the modified soundObjects array
        setSoundObjects(updatedSoundObjects);

        } catch (error) {
            console.log(error);
        }
    }

    /*
        Renders user session and displays available sounds and notes played
    */        
    return(
        <div className="play-container">
            <div className="play-container play-header">
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
            <div className="play-container play-content">
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
                                    {soundObjects.map(sound => (
                                        <SoundCard key={sound.id} id={sound.id} name={sound.name} location={sound.location} isFavorite={sound.isFavorite} isLoggedIn={isAuthenticated} onSelect={handleButtonClick} addFavorite={addFavorite} removeFavorite={removeFavorite} />
                                    ))}
                                </List> 
                            </RadioGroup>
                        </FormControl>
                    </Box>
                )}
            </div>
            <div className="chord-container">
                <FormGroup>
                    <div className="display-notes-container">
                        <FormControlLabel
                            control={<Switch />} label="Notes:"
                            onChange={handleNotesToggle}
                        />
                        <div className="note-content">
                            {notesEnabled && (
                                <>
                                    {chordNotes.map((note) => (
                                        <p className="d-inline" key={note}>{note}&nbsp;</p>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                    <FormControlLabel
                        control={<Switch />} label="Chord:"
                        onChange={handleChordToggle}
                    />
                </FormGroup>
                <div className="chord-content">
                   {/* TODO: display chord here */} 
                </div>
            </div>
        </div>
    )
}

export default Play;