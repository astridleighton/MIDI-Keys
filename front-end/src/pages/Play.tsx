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
 * TODO: ensure a device can be connected to
 */

const Play = () =>
{
    const midiContext = useContext(MidiContext);
    const token = Cookies.get('token');
    const isAuthenticated = !!token;
    const firstName = Cookies.get('name');
    const [chordNotes, setChordNotes] = useState<string[] | null>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [url, setURL] = useState<string | null>(null);
    const [notesEnabled, setNotesEnabled] = useState<boolean>(false);
    const [selectedSound, setSelectedSound] = useState<Sound | null>();
    const connectedDevice = midiContext?.connectedDevice;
    const soundService = new SoundService();
    const [soundObjects, setSoundObjects] = useState<Sound[] | null>();

    // Fetch sound objects once on component mount
    useEffect(() => {
        initializeSounds();
    }, []);

    /**
       * Starts tone.JS and sets up MIDI input devices
       */
    useEffect (() => {
        console.log('in use effect');
        const initTone = async() => {
            try {
                Tone.start();

                if (selectedSound) { // TODO: fix this so it connects to connectedDevice
                    const midiInstrument = new MidiInstrument(selectedSound);
                    const qwertyInstrument = new QwertyInstrument(selectedSound, addNote, removeNote);
                } else {
                    console.log("Could not set up instruments because no sound is selected. Please select a sound.");
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
            if (soundsData) {
                if (isAuthenticated) {
                    await soundService.getAllFavorites(token, soundsData);
                }
                setSoundObjects(soundsData);
                setSelectedSound(soundsData[0]);
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
        console.log("In handleSelectSound()");
        const instrument = event.target.value;

        // TODO: need to fix so this works correctly according to the database
        if (soundObjects) {
            const foundSound = soundObjects.find(sound => sound.name === instrument);
            if (foundSound) {
              setSelectedSound(foundSound);
              console.log('Selected Sound:', foundSound);
            } else {
              console.log(`Could not select ${instrument}.`);
            }
        } else {
            console.error("Could not change to selected sound since there are no sounds present.");
        }
    }

    /**
     * Adds a specified sound to the user's favorites
     * Only called if user is logged in with a valid token
     * @param {*} soundName 
     */
    const addFavorite = async (soundName) => {
        soundService.addFavorite(token, soundName, soundObjects);
    }

    /**
     * Removes a specified sound from the user's favorites
     * Only called if user is logged in with a valid token
     * @param {*} soundName 
     */
    const removeFavorite = async (soundName) => {
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