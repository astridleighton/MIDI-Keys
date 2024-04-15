import React, {useState, useEffect} from 'react';
import * as Tone from 'tone';
import AudioKeys from 'audiokeys';
import Cookies from 'js-cookie';
import SoundCard from '../cards/SoundCard';
import Sound from '../sound/Sound';
import axios from 'axios';
import { List, FormControl, FormLabel, RadioGroup, InputLabel, Box, FormControlLabel, Switch, FormGroup, CircularProgress, Select, MenuItem, Menu, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import Piano from './Piano';

import './Play.scss'

/**
 * Initiates QWERTY and MIDI keyboard setup
 * Contains the Tone.JS instruments and database samples
 * Allows user to select between instruments
 * Displays notes played
 * TODO: display chord played, do not set default instrument
 * TODO: change note velocity
 */

// TODO: pass in connected device
const Play = () =>
{
    // TODO: move all drums into kit in future implementation
        /* const drumKit = new Tone.Players({
            "kick": "https://tonejs.github.io/audio/drum-samples/4OP-FM/snare.mp3",
        }).toDestination(); */

    // state
    const isAuthenticated = !!Cookies.get('token');
    const firstName = Cookies.get('name');
    const [selectedSound, setSelectedSound] = useState('Synth');
    const [chordNotes, setChordNotes] = useState([undefined]);
    const [soundObjects, setSoundObjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [url, setURL] = useState('');
    const [currentChord, setCurrentChord] = useState();
    const [notesEnabled, setNotesEnabled] = useState(false);
    const [chordEnabled, setChordEnabled] = useState(false);
    console.log('test render');

    /**
       * Starts tone.JS and sets up MIDI input devices
       */
    useEffect (() => {
        const initTone = async() => {
            try {
                Tone.start();

                await Tone.setContext(new AudioContext({ sampleRate: 48000 })); // sets audio preferences
                Tone.Master.volume.value = -6;

                await setUpQwertyKeyboard(); // device setup
                console.log('testing');
                await initializeSounds();

                const manuallyConnectedDevice = await manuallyConnectV49(); // manually connection set up for now
                if(manuallyConnectedDevice) {
                    console.log('setting up MIDI keyboard');
                    await setUpMIDIKeyboard(manuallyConnectedDevice);
                }
            } catch (error) {
                console.error('Error setting up MIDI in your browser. Please reload and try again.', error);
            }
            
        }

        initTone();
  }, [selectedSound]);

  /**
   * Manual device connection to V49 (used for testing)
   * @returns connected device
   */
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
       * Creates an instance of the online bass sampler
       * @param {*} note 
       * @param {*} url 
       */
      const createOnlineBassSampler = (note, url) => {
        const sampler = new Tone.Sampler({
            urls: {
            A1: "As1.mp3",
            A2: "As2.mp3",
        },
	        baseUrl: url,
            onload: () => {
                sampler.triggerAttackRelease(note, 0.8);
            }
        }).toDestination();
      }

      /**
       * Creates an instance of the online sampler (used for online URLs)
       * TODO: fix CORS error
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

      // TODO: put these all in the database
      const createChoirSampler = (note) => {
        const sampler = new Tone.Sampler({
            urls: {
            A3: "femalevoices_aa2_A3.mp3",
            A4: "femalevoices_aa2_A4.mp3",
            A5: "femalevoices_aa2_A5.mp3"
        },
	        baseUrl: "https://tonejs.github.io/audio/berklee/",
            onload: () => {
                sampler.triggerAttackRelease(note, 1);
            }
        }).toDestination();
      }

      const createEerieSynthSampler = (note) => {
        const sampler = new Tone.Sampler({
            urls: {
            A3: "eerie_synth1.mp3",
            A4: "eerie_synth2.mp3",
            A5: "eerie_synth3.mp3"
        },
	        baseUrl: "https://tonejs.github.io/audio/berklee/",
            onload: () => {
                sampler.triggerAttackRelease(note, 1);
            }
        }).toDestination();
      }
      const createGuitarSampler = (note) => {
        const sampler = new Tone.Sampler({
            urls: {
            A3: "guitar_Astring.mp3",
            E2: "guitar_LowEstring1.mp3",
            G4: "guitar_Gstring.mp3"
        },
	        baseUrl: "https://tonejs.github.io/audio/berklee/",
            onload: () => {
                sampler.triggerAttackRelease(note, 1);
            }
        }).toDestination();
      }


      /**
       * Ensures sounds are loaded before receiving favorite sounds
       */
      const initializeSounds = async () => {
        console.log("Getting all sounds and favorites.");
        await getAllSounds();
        await getAllFavorites();
      }

      /**
       * Changes state based on note toggle
       */
      const handleNotesToggle = () => {
        setNotesEnabled(!notesEnabled);
      }

      /**
       * Changes state based on chord toggle
       */
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
        midiKeyboard.onmidimessage =  async (event) =>
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

                        if (selectedSound === 'Synth') {
                            const synth = createSynth();
                            synth.triggerAttackRelease(Tone.Midi(noteInput).toFrequency(), "4n");
                        } else if (selectedSound === 'amsynth') {
                            const amSynth = createAMSynth();
                            amSynth.triggerAttackRelease(note, "4n");
                        } else if (selectedSound === 'monosynth') {
                            const monoSynth = createMonoSynth();
                            monoSynth.triggerAttackRelease(note, "4n");
                        } else if (selectedSound === 'Casio Piano') {
                            createSampler(note);
                        } else if (selectedSound === 'bass') {
                            console.log('test!');
                            createOnlineBassSampler(note, url);
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
        - Stores current notes being played
        TODO: determine if qwerty should always play
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
            85: 'Bb4', // U
            74: 'B4', // J
            75: 'C5', // K
            79: 'Db5', // O
            76: 'D5', // L
            80: 'Eb5', // P
            59: 'E5' // ;
        };

        /*
        Triggers audio output, converts MIDI note to music note, and adds note to notes played
        */
        keyboard.down(async (e) => {

            const note = keyToNote[e.keyCode];

            if(note)
            {
                await addNote(note);
                createGuitarSampler(note, url);
                
                // const synth = new Tone.Synth().toDestination();
                // synth.triggerAttackRelease(note, '4n');
                // TODO: implement getChord()
            }
        });

    /*
        Stops audio output and removes note from notes played
    */
        keyboard.up(async(e) => {
            console.log(e);

            const note = keyToNote[e.keyCode];
            await removeNote(note);

            
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
    const handleSelectSound = (event) => {

        // TODO: fix so location is passed here too

        const instrument = event.target.value;
        const location = null;

        console.log("Selected: " + instrument + " at " + location);

        if (location === "react" || !location) {
            if (instrument === 'Synth') {
                setSelectedSound('Synth');
            } else if (instrument === 'AM Synth') {
                setSelectedSound('AM Synth');
            } else if (instrument === 'Mono Synth') {
                setSelectedSound('Mono Synth');
            } else if (instrument === 'Casio Piano') {
                setSelectedSound('Casio Piano');
            } else if (instrument === 'Bass Guitar') {
                setSelectedSound('Bass Guitar');
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
        console.log(notes);
        
        // only works for three note chords
        /*if (chordNotes && chordNotes.length === 3) {
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
        }*/
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
    
        console.log('fix remove favorite!');
        /* try {
            const response = await axios.delete(`http://localhost:3000/remove-favorite/${soundName}`, {
                token: Cookies.get('token')
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
        } */
    }

    // renders user session and displays available sounds and notes played
    return(
        <div className="play-container">
            <div className="play-container play-header">
                {isAuthenticated ? (
                    <div>
                        <h1>Welcome,&nbsp;{firstName}!</h1>
                    </div>
                ) : (
                    <div>
                        <h1>MIDI Made Simple.</h1>
                    </div>
                )}
            </div>
            <div className="play-container play-content">
            {isLoading ? (
                    <>
                        <p>Could not load sounds from database. Please refresh to try again.</p>
                        <CircularProgress />
                    </>
                    
                ) : (
                  <div>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="select-sound-label">Select Sound</InputLabel>
                        <Select
                            sx={{marginTop: '35px', width: '250px', height: '50px'}}
                            labelId="select-sound-label"
                            value={selectedSound}
                            onChange={(event) => handleSelectSound(event)}
                            label="Sound"
                            >
                        {soundObjects.map((sound, index) => (
                            <MenuItem key={index} value={sound.name}>
                                    {sound.name} 
                                    {isAuthenticated && (
                                        <>
                                            {sound.isFavorite ?
                                                <IconButton
                                                    color="white"
                                                    onClick={addFavorite}>
                                                    <StarIcon
                                                        style={{ color: 'yellow' }}
                                                    />
                                                </IconButton>
                                            : <IconButton
                                                    color="white"
                                                    onClick={removeFavorite}>
                                                    <StarIcon
                                                        style={{ color: 'primary'}}
                                                    />
                                                </IconButton>
                                            }
                                    </>    
                                    )}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                  </div>  
                )}
            </div>
            <Piano notes={chordNotes}/>
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

/* <Box sx={{ width: '100%', maxWidth: 260, bgColor: 'background.paper' }}>
                        <FormControl>
                            <FormLabel>Sounds</FormLabel>
                            <RadioGroup
                                aria-label="sounds"
                                name="sound-group"
                                defaultValue="synth"
                                /*onChange={(e) => this.handleButtonClick1(e.target.value)}*/
                                /* >
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
                                        <SoundCard
                                            key={sound.id}
                                            id={sound.id}
                                            name={sound.name}
                                            location={sound.location}
                                            isFavorite={sound.isFavorite}
                                            isLoggedIn={isAuthenticated}
                                            onSelect={(instrument, location) => handleButtonClick(instrument, location)}
                                            addFavorite={addFavorite}
                                            removeFavorite={removeFavorite} />
                                    ))}
                                </List> 
                            </RadioGroup>
                        </FormControl>
                    </Box> */
                    

export default Play;