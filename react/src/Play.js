import React from 'react';
import * as Tone from 'tone';
import AudioKeys from 'audiokeys';
import Cookies from 'js-cookie';
import { useState } from 'react';

// TODO: fix instances and timing issue

class Play extends React.Component
{
    // needs to only know about selected device and the instrument needed -- all audio should come from here
    constructor(props) {
        super(props);
        //this.currentChord = [];
        this.synth = new Tone.Synth().toDestination(); // Create a simple synth
        this.amSynth = new Tone.AMSynth().toDestination();
        this.monosynth = new Tone.MonoSynth({
            oscillator: {
                type: "square"
            },
            envelope: {
                attack: 0.1
            }
        }).toDestination();
        this.state = {
            selectedSound: 'synth', // default device
            chordNotes: [],
        }

      }

      componentDidMount () {
        this.initalizeKeyboard();
        Tone.start();
      }

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

          // TODO: find out why note is being triggered twice

        keyboard.down((e) => {
            const note = keyToNote[e.keyCode];

            if(note)
            {

                this.addNote(note);

                //athis.currentChord.push(e.keyCode);

                //athis.getChord();
                if (this.state.selectedSound === 'synth') {
                    //this.synth.triggerAttack(note); // Use the 'note' argument
                  } else if (this.state.selectedSound === 'amSynth') {
                    //this.amSynth.triggerAttack(note);
                  } else if (this.state.selectedSound === 'monosynth') {
                    //this.monosynth.triggerAttack(note);
                  }
            }
        });

        keyboard.up((e) => {

            const note = keyToNote[e.keyCode];

            this.removeNote(note);
            //this.synth.triggerRelease();
            //this.amSynth.triggerRelease();
            //this.monosynth.triggerRelease();
        })

        
    }
    addNote = (newNote) => {
        /*this.setState((prevState) => ({ chordNotes:
        [...prevState.chordNotes, newNote ]}));*/

        this.setState((prevState) => {
            if(!prevState.chordNotes.includes(newNote)) {
                return {
                    chordNotes: [...prevState.chordNotes, newNote],
                }
            }
            return prevState;

        })

    }

    removeNote = (oldNote) => {
        this.setState((prevState) => ({ chordNotes:
            [...prevState.chordNotes.filter((note) => note !== oldNote), ]}));
    }
      

      // TODO: add drums samples

      /*const sampler = new Tone.Sampler({
        urls: {
            A1: "A1.mp3",
            A2: "A2.mp3",
        },
        baseUrl: "https://tonejs.github.io/audio/casio/",
        onload: () => {
            sampler.triggerAttackRelease(["C1", "E1", "G1", "B1"], 0.5);
        }
    }).toDestination();*/

      handleButtonClick = (instrument, e) => {
        e.preventDefault();
        console.log("Selected: " + instrument);

        if(instrument === 'synth')
        {
            this.state.selectedSound = 'synth';
        } else if (instrument === 'amsynth')
        {
            this.state.selectedSound = 'amSynth';
        } else if (instrument === 'monosynth')
        {
            this.state.selectedSound = 'monosynth';
        } else if (instrument === 'qwerty')
        {
            //console.log("no audio set up.");
        } else {
            console.log("Uh oh, no instrument connected.");
        }
      }

      getChord () {

        // TODO: add additional intervals
        
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

      handleLogout = () => {
        // TODO: ask user is they are sure they want to log out, add error handling
        Cookies.remove('token');
        Cookies.remove('name');
        window.location.reload();
      }

    // TODO: look into samples, organize better
    render()
    {
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
                    </ul>
                </div>
                <div>
                    <h3 className="ml-2">Chord:
                        <span >{this.state.chordNotes.map((note) => (
                        <p className="d-inline" key={note}>{note} </p>
                    ))}</span>
                    </h3>
                </div>
            </div>
        )
    }
}

export default Play;