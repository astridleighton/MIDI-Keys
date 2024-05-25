import React, {useState, useEffect, useContext} from 'react';
import * as Tone from 'tone';
import Cookies from 'js-cookie';
import { List, FormControl, FormLabel, RadioGroup, InputLabel, Box, Alert, FormControlLabel, Switch, FormGroup, CircularProgress, Select, MenuItem, Menu, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import Piano from './Piano';
import { MidiContext } from '../MidiContext';
import { MidiInstrument } from '../instruments/MidiInstrument';
import { QwertyInstrument } from '../instruments/QwertyInstrument';
import SoundService from '../services/SoundService';
import { Sound } from '../types';

import './Play.scss'

/**
 * Initiates QWERTY and MIDI keyboard setup
 * Contains the Tone.JS instruments and database samples
 * Allows user to select between instruments
 * Displays notes played
 * TODO: render when new notes are being played to show visual (new useEffect?)
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
    const [selectedSound, setSelectedSound] = useState<Sound | null>();
    const connectedDevice = midiContext?.connectedDevice;
    const soundService = new SoundService();

    /**
       * Starts tone.JS and sets up MIDI input devices
       */
    useEffect (() => {
        console.log('in use effect');
        const initTone = async() => {
            try {
                Tone.start();
                await initializeSounds();

                const testSound: Sound = { // TODO: replace with default sound
                    id: '0',
                    name: 'Synth',
                    location: '',
                    isFavorite: false,
                    urls: ''
                }

                if (testSound) { // TODO: fix this so it connects to connectedDevice
                    const midiInstrument = new MidiInstrument(testSound);
                    const qwertyInstrument = new QwertyInstrument(testSound, addNote, removeNote);
                } else {
                    console.log("Missing some info.");
                }              
            } catch (error) {
                console.error('Error setting up MIDI in your browser. Please reload and try again.', error);
            } 
        }

        initTone();
  }, [selectedSound]);

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
       * Ensures sounds are loaded before receiving favorite sounds
       */
      const initializeSounds = async () => {
        console.log("Getting all sounds and favorites.");
        try {
            setIsLoading(true);
            const soundsData: Sound[] | null = await soundService.getAllSounds();
            const token = Cookies.get('token');

            if (soundsData) {
                if (isAuthenticated) {
                    await soundService.getAllFavorites(token, soundsData);
                }
                setSoundObjects(soundsData);
            }
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

    /*
        Adds note to state array, checks for duplicates
    */
    const addNote = async (newNote: string) => {
        console.log('Adding note: ' + newNote);
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
        console.log('Stopped playing ' + oldNote);
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