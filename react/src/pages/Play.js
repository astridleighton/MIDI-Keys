import React, {useState, useEffect, useContext} from 'react';
import * as Tone from 'tone';
import AudioKeys from 'audiokeys';
import Cookies from 'js-cookie';
import Sound from '../sound/Sound';
import axios from 'axios';
import { List, FormControl, FormLabel, RadioGroup, InputLabel, Box, Alert, FormControlLabel, Switch, FormGroup, CircularProgress, Select, MenuItem, Menu, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import Piano from './Piano';
import { MidiContext } from '../MidiContext';

import './Play.scss'

/**
 * Initiates QWERTY and MIDI keyboard setup
 * Contains the Tone.JS instruments and database samples
 * Allows user to select between instruments
 * Displays notes played
 */

const Play = ({connectedDevice}) =>
{
    const { selectedSound, setSelectedSound } = useContext(MidiContext);

    const isAuthenticated = !!Cookies.get('token');
    const firstName = Cookies.get('name');
    const [chordNotes, setChordNotes] = useState([]);
    const [soundObjects, setSoundObjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [url, setURL] = useState('');
    const [notesEnabled, setNotesEnabled] = useState(false);

    // maps QWERTY to note values
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
        79: 'Db5' // O
    };

    /**
       * Starts tone.JS and sets up MIDI input devices
       */
    useEffect (() => {
        const initTone = async() => {
            try {
                Tone.start();

                await Tone.setContext(new AudioContext({ sampleRate: 41000 })); // sets audio preferences

                const keyboard = await createQwerty();
                await setUpQwertyKeyboard(keyboard); // device setup
                
                await initializeSounds();
                
                const connectedDevice2 = await connectMIDIInputDevice(connectedDevice)
                await setUpMIDIKeyboard(connectedDevice2);
                
            } catch (error) {
                console.error('Error setting up MIDI in your browser. Please reload and try again.', error);
            } 
        }

        initTone();
  }, [selectedSound]);

  useEffect(() => {

  })

  /**
   * Connects to MIDI device
   * @returns connected device
   */
    const connectMIDIInputDevice = async (deviceName) => {
        const midiAccess = await navigator.requestMIDIAccess();
        const inputs = Array.from(midiAccess.inputs.values());
        const device = inputs.find(input => input.name === deviceName);
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
                casio.triggerAttackRelease(note, 1);
            }
        }).toDestination();
      }

      /**
       * Creates an instance of the choir sampler
       * @param {*} note 
       * @param {*} url 
       */
       const createChoirSampler = (note, url) => {
        const sampler = new Tone.Sampler({
            urls: {
            A3: "femalevoices_aa2_A3.mp3",
            A4: "femalevoices_aa2_A4.mp3",
            A5: "femalevoices_aa2_A5.mp3"
        },
	        baseUrl: url,
            onload: () => {
                sampler.triggerAttackRelease(note, 1);
            }
        }).toDestination();
      }

      /**
       * Creates an instance of the eerie sampler
       * @param {*} note 
       * @param {*} url 
       */
      const createEerieSynthSampler = (note, url) => {
        const sampler = new Tone.Sampler({
            urls: {
            A3: "eerie_synth1.mp3",
            A4: "eerie_synth2.mp3",
            A5: "eerie_synth3.mp3"
        },
	        baseUrl: url,
            onload: () => {
                sampler.triggerAttackRelease(note, 1);
            }
        }).toDestination();
      }

      /**
       * Creates an instance of the guitar sampler
       * @param {*} note 
       * @param {*} url 
       */
      const createGuitarSampler = (note, url) => {
        const sampler = new Tone.Sampler({
            urls: {
            A3: "guitar_Astring.mp3",
            E2: "guitar_LowEstring1.mp3",
            G4: "guitar_Gstring.mp3"
        },
	        baseUrl: url,
            onload: () => {
                sampler.triggerAttackRelease(note, 1);
            }
        }).toDestination();
      }

      /**
       * Creates an instance of the kalimba sampler
       * @param {*} note 
       * @param {*} url 
       */
      const createKalimbaSampler = (note, url) => {
        const sampler = new Tone.Sampler({
            urls: {
            Ab3: "Kalimba_1.mp3",
            Ab4: "Kalimba_3.mp3"
        },
	        baseUrl: url,
            onload: () => {
                sampler.triggerAttackRelease(note, 1);
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

        try {
            setIsLoading(true);
            const sounds = await getAllSounds();
            setSoundObjects(sounds);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }

      }

      /**
       * Changes state based on note toggle
       */
      const handleNotesToggle = () => {
        setNotesEnabled(!notesEnabled);
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
            event.preventDefault();
            const command = event.data[0];
            const noteInput = event.data[1];
            const velocity = event.data[2];
            const note = await midiToNote(noteInput);

            switch (command)
            {
                case 144: // note on
                    if(velocity > 0)
                    {
                        // determine if drums or keys
                        if (noteInput >= 60) {
                            await addNote(note);
                            await playSound(note);
                        } else {
                            switch (noteInput) {
                                case 48:
                                    createKickPlayer();
                                    break;
                                case 49:
                                    createSnarePlayer();
                                    break;
                                case 50:
                                    createTom1Player();
                                    break;
                                case 51:
                                    createTom2Player();
                                    break;
                                case 44:
                                    createTom3Player();
                                    break;
                                case 45:
                                    createHiHatPlayer();
                                    break;
                                case 46:
                                    createBongo1Player();
                                    break;
                                case 47:
                                    createBongo2Player();
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                    break;
                case 128: // note off
                    await removeNote(note);   
                    break;
                default:
                    break;
                }
            }   
            
    }

    /**
     * Chooses appropriate sample baesd on note
     * @param {*} note 
     */
    const playSound = async(note) => {
        switch (selectedSound) {
            case 'Synth':
                const synth = await createSynth();
                synth.triggerAttackRelease(note, "4n");
                break;
            case 'AM Synth':
                const amSynth = await createAMSynth();
                amSynth.triggerAttackRelease(note, "4n");
                break;
            case 'Mono Synth':
                const monoSynth = await createMonoSynth();
                monoSynth.triggerAttackRelease(note, "4n");
                break;
            case 'Casio Piano':
                await createSampler(note);
                break;
            case 'Salamander':
                await createOnlineSampler(note, url);
                break;
            case 'Eerie Pad':
                await createEerieSynthSampler(note, url);
                break;
            case 'Guitar':
                await createGuitarSampler(note, url);
                break;
            case 'Choir':
                await createChoirSampler(note, url);
                break;
            case 'Kalimba':
                await createKalimbaSampler(note, url);
                break;
            default:
                break;
        }
    }

    /**
     * - Sets up keyboard using AudioKeys and allows QWERTY keyboard input
        - Maps MIDI notes to music notes
        - Triggers audio output with keydown event
        - Stores current notes being played
     */
    const setUpQwertyKeyboard = async(keyboard) => {

        /*
        Triggers audio output, converts MIDI note to music note, and adds note to notes played
        */
        keyboard.down(async (e) => {

            const note = keyToNote[e.keyCode];

            if(note)
            {
                await addNote(note);
                await playSound(note);
            }
        });

    /*
        Stops audio output and removes note from notes played
    */
        keyboard.up(async(e) => {
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
        const octave = Math.floor(midiInput / 12) - 1;
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

        const instrument = event.target.value;
        let location;

        soundObjects.forEach((sound) => {
            if(sound.name === instrument) {
                location = sound.location;
            }
        })

        if (location === "react" || location) {
            if (instrument === 'Synth') {
                setSelectedSound(instrument);
            } else if (instrument === 'AM Synth') {
                setSelectedSound(instrument);
            } else if (instrument === 'Mono Synth') {
                setSelectedSound(instrument);
            } else if (instrument === 'Casio Piano') {
                setSelectedSound(instrument);
            } else if (instrument === 'Salamander') {
                setSelectedSound(instrument);
                setURL(location);
            } else if (instrument === 'Choir') {
                setSelectedSound(instrument);
                setURL(location);
            } else if (instrument === 'Eerie Pad') {
                setSelectedSound(instrument);
                setURL(location);
            }  else if (instrument === 'Guitar') {
                setSelectedSound(instrument);
                setURL(location);
            } else if (instrument === 'Kalimba') {
                setSelectedSound(instrument);
                setURL(location);
            } else {
                console.log("Error! Could not set selected instrument.");
            }
        } else { // external sample
            console.log('Error! Could not set selected instrument.');
        }
    }
    
    /**
     * Retrieves all sounds from the database
     */
    const getAllSounds = async () => {
        try {
            const result = await axios.get('http://localhost:3000/all-sounds');

            console.log(result);

            if (result.status === 200) {
                const sounds = result.data.map(sound => new Sound(sound.id, sound.name, sound.source, sound.isFavorite));
                console.log(sounds);

                if(isAuthenticated) {
                    return getAllFavorites(sounds);
                } else {
                    return sounds;
                }
            } else {
                console.log("Error");
                return null;
            }

        } catch (error) {
            console.error("Could not get sounds from database.", error);
            return null;
        }
    }

    /**
     * Retrieves all favorite sounds from the database
     * Only called when user is logged in with a valid token
     */
    const getAllFavorites = async (sounds) => {

        const token = Cookies.get('token');

        try {
            const result = await axios.get('http://localhost:3000/all-favorites', {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                });
            
                if(result.data.length > 0) {

                    const favorites = result.data.map(sound => new Sound(sound.id, sound.name, sound.source));

                    for(let i = 0; i < sounds.length; i++) {
                        const matchingFavorite = favorites.find(favorite => favorite.id === sounds[i].id);

                        if(matchingFavorite) {
                            sounds[i].isFavorite = true;
                        }
                    }
                }
                return sounds;
        } catch (error) {
            if (error.status === 403 || error.status === 401) {
                console.log("Unauthorized to load samples");
            } else {
                console.log("No favorites to show.");
                return sounds;
            }
        }
    }

    /**
     * Adds a specified sound to the user's favorites
     * Only called if user is logged in with a valid token
     * @param {*} soundName 
     */
    const addFavorite = async (sound) => {

        const token = Cookies.get('token');
        try {
            const response = await axios.post(`http://localhost:3000/add-favorite/${sound}`, null, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
    
            console.log(response);
    
            for (let i = 0; i < soundObjects.length; i++) {
                if (soundObjects[i].name === sound) {
                    const updatedSoundObjects = [...soundObjects];
                    updatedSoundObjects[i].isFavorite = true;
                    console.log('setting fav');
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
                headers:{
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
                        <InputLabel id="select-sound-label" sx={{color: 'white', fontSize: '20px'}}>Selected Sound</InputLabel>
                        <Select
                            sx={{marginTop: '35px', width: '250px', height: '50px', color: 'white'}}
                            labelId="select-sound-label"
                            value={selectedSound}
                            onChange={(event) => handleSelectSound(event)}
                            label="Sound"
                            >
                        {soundObjects && soundObjects.map((sound, index) => (
                            <MenuItem key={index} value={sound.name}>
                                    {sound.name} 
                                    {isAuthenticated && (
                                        <>
                                            {sound.isFavorite ?
                                                <IconButton
                                                    color="white"
                                                    onClick={() => removeFavorite(sound.name)}>
                                                    <StarIcon
                                                        style={{ color: 'yellow' }}
                                                    />
                                                </IconButton>
                                            : 
                                                <IconButton
                                                    color="white"
                                                    onClick={() => addFavorite(sound.name)}>
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
                </FormGroup>
            </div>
        </div>
    )
}
                   

export default Play;