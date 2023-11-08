import React from 'react';
import * as Tone from 'tone';
import AudioKeys from 'audiokeys';
import Cookies from 'js-cookie';
import { useState } from 'react';

// https://musicjoeyoung.medium.com/build-a-piano-with-tone-js-618e2403d9de

class Play extends React.Component
{
    // needs to only know about selected device and the instrument needed -- all audio should come from here
    constructor(props) {
        super(props);
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
        }

      }

      componentDidMount () {
        this.initalizeKeyboard();
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

        keyboard.down((e) => {

            const note = keyToNote[e.keyCode];

            if(note)
            {
                if (this.state.selectedSound === 'synth') {
                    this.synth.triggerAttack(note); // Use the 'note' argument
                  } else if (this.state.selectedSound === 'amSynth') {
                    this.amSynth.triggerAttack(note);
                  } else if (this.state.selectedSound === 'monosynth') {
                    this.monosynth.triggerAttack(note);
                  }
            }
        });

        keyboard.up(() => {
            this.synth.triggerRelease();
            this.amSynth.triggerRelease();
            this.monosynth.triggerRelease();
        })
      }

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

            <div className="Play">
                {isAuthenticated ? (
                    <div>
                        <h1>Welcome, {firstName}!</h1>
                        <button onClick={(e) => this.handleLogout()}>Log Out</button>
                    </div>
                ) : (
                    <div>
                        <h1>MIDI Made Simple</h1>
                    </div>
                )}
                
                <h1>Sounds</h1>
                <div class="card">
                    <div class="card-body">
                        Synth
                        <button onClick={(e) => this.handleButtonClick('synth', e)}>Select</button>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        AM Synth
                        <button onClick={(e) => this.handleButtonClick('amsynth', e)}>Select</button>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        Mono Synth
                        <button onClick={(e) => this.handleButtonClick('monosynth', e)}>Select</button>
                    </div>
                </div>
                <div>
                    Note: <p>{this.state.currentNote}</p>
                </div>
                {this.props.selectedDevice ? (
                    <p>Connected Device: {this.props.selectedDevice}</p>
                ) : (
                    <p>No device connected.</p>
                )}
                <h3>Chord: ...</h3>
            </div>
            
        )
    }
}

export default Play;