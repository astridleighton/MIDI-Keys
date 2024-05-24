import React, {useState, useEffect, useContext} from 'react';
import * as Tone from 'tone';
import AudioKeys from 'audiokeys';
import Cookies from 'js-cookie';
import axios from 'axios';
import { List, FormControl, FormLabel, RadioGroup, InputLabel, Box, Alert, FormControlLabel, Switch, FormGroup, CircularProgress, Select, MenuItem, Menu, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import Piano from './Piano';
import { MidiContext } from '../MidiContext';
import { MidiInstrument } from '../instruments/MidiInstrument';
import { QwertyInstrument } from '../instruments/QwertyInstrument';
import SoundService from '../services/SoundService';
import { Sound } from '../types';
import DrumService from '../services/DrumService';

import './Play.scss'

/**
 * Initiates QWERTY and MIDI keyboard setup
 * Contains the Tone.JS instruments and database samples
 * Allows user to select between instruments
 * Displays notes played
 */

const Play = () =>
{
    const midiContext = useContext(MidiContext);
    const isAuthenticated = !!Cookies.get('token');
    const firstName = Cookies.get('name');
    const [chordNotes, setChordNotes] = useState<string[] | null>([]);
    const [soundObjects, setSoundObjects] = useState<Sound[] | null>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [url, setURL] = useState<string | null>(null);
    const [notesEnabled, setNotesEnabled] = useState<boolean>(false);
    const [selectedSound, setSelectedSound] = useState<string | null>("synth");
    const connectedDevice = midiContext?.connectedDevice;
    const soundService = new SoundService();
    const drumService = new DrumService();

    /**
       * Starts tone.JS and sets up MIDI input devices
       */
    useEffect (() => {
        if (selectedSound) {
            const testInstrument = new MidiInstrument(selectedSound);
        }
        // const soundService = new SoundService();

        const initTone = async() => {
            try {
                Tone.start();

                await Tone.setContext(new AudioContext({ sampleRate: 41000 })); // sets audio preferences

                const qwertyInstrument = new QwertyInstrument('casio piano');
                
                await initializeSounds();
                
                const connectedDevice2 = await connectMIDIInputDevice(connectedDevice)
                await setUpMIDIKeyboard(connectedDevice2);
                
            } catch (error) {
                console.error('Error setting up MIDI in your browser. Please reload and try again.', error);
            } 
        }

        initTone();
  }, []);

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
        return new Tone.Synth().toDestination();
      }

      /**
       * Creates an instance of the AM Synth
       * @returns instance
       */
      const createAMSynth = () => {
        return new Tone.AMSynth().toDestination();
      }

      /**
       * Creates an instance of the mono synth
       * @returns instance
       */
      const createMonoSynth = () => {
        return new Tone.MonoSynth({
            oscillator: {
                type: "square"
            },
            envelope: {
                attack: 0.1
            }
        }).toDestination();
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
       * Ensures sounds are loaded before receiving favorite sounds
       */
      const initializeSounds = async () => {
        console.log("Getting all sounds and favorites.");

        try {
            setIsLoading(true);
            const soundsData: Sound[] | null = await soundService.getAllSounds();
            const token = Cookies.get('token');

            if (isAuthenticated && soundsData) {
                await soundService.getAllFavorites(token, soundsData);
            }
            setSoundObjects(soundsData);
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
            if(previousChord && !previousChord.includes(newNote)) {
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
        if (previousChord) {
            const newChord = previousChord.filter((note) => note !== oldNote);
            setChordNotes(newChord);
        }
    }

    /*
        Selects instrument type based on user option
    */
    const handleSelectSound = (event) => {

        const instrument = event.target.value;
        let location;

        if(soundObjects) {
            soundObjects.forEach((sound) => {
                if(sound.name === instrument) {
                    location = sound.location;
                }
            })
        }
        
        if ((location === "react" || location) && midiContext) {
            if (instrument === 'Synth') {
                midiContext.setSelectedSound(instrument);
            } else if (instrument === 'AM Synth') {
                midiContext.setSelectedSound(instrument);
            } else if (instrument === 'Mono Synth') {
                midiContext.setSelectedSound(instrument);
            } else if (instrument === 'Casio Piano') {
                midiContext.setSelectedSound(instrument);
            } else if (instrument === 'Salamander') {
                midiContext.setSelectedSound(instrument);
                setURL(location);
            } else if (instrument === 'Choir') {
                midiContext.setSelectedSound(instrument);
                setURL(location);
            } else if (instrument === 'Eerie Pad') {
                midiContext.setSelectedSound(instrument);
                setURL(location);
            }  else if (instrument === 'Guitar') {
                midiContext.setSelectedSound(instrument);
                setURL(location);
            } else if (instrument === 'Kalimba') {
                midiContext.setSelectedSound(instrument);
                setURL(location);
            } else {
                console.log("Error! Could not set selected instrument.");
            }
        } else { // external sample
            console.log('Error! Could not set selected instrument.');
        }
    }

    /**
     * Adds a specified sound to the user's favorites
     * Only called if user is logged in with a valid token
     * @param {*} soundName 
     */
    const addFavorite = async (soundName) => {
        const token = Cookies.get('token');
        soundService.addFavorite(token, soundName, soundObjects);
    }

    /**
     * Removes a specified sound from the user's favorites
     * Only called if user is logged in with a valid token
     * @param {*} soundName 
     */
    const removeFavorite = async (soundName) => {
        const token = Cookies.get('token');
        soundService.removeFavorite(token, soundName, soundObjects);
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
                                                    style={{ color: 'white' }}
                                                    onClick={() => removeFavorite(sound.name)}>
                                                    <StarIcon
                                                        style={{ color: 'yellow' }}
                                                    />
                                                </IconButton>
                                            : 
                                                <IconButton
                                                    style={{ color: 'white' }}
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
                                    {chordNotes?.map((note) => (
                                        <p className="d-inline">{note}&nbsp;</p>
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