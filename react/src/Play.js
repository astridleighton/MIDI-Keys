import React from 'react';
import * as Tone from 'tone';
import AudioKeys from 'audiokeys';
import Cookies from 'js-cookie';
import { useState } from 'react';

// https://musicjoeyoung.medium.com/build-a-piano-with-tone-js-618e2403d9de

class Play extends React.Component
{
    // used for testing
    // needs to only know about selected device and the instrument needed -- all audio should come from here
    // TODO: allow instrument to be changed -- default is keyboard

    constructor() {
        super();
        this.selectedInstrument = 'synth';
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
            selectedDevice: '',
        }

      }

      componentDidMount () {
        //alert(this.props.selectedDevice);
        //this.state.selectedDevice = this.props.selectedDevice;
        this.initalizeKeyboard();
      }

      initalizeKeyboard () {
        const keyboard = new AudioKeys({
            polyphony: 10, // Adjust the polyphony as needed
        });

        const keyToNote = {
            65: 'C4', // A
            83: 'D4', // S
            68: 'E4', // D
            70: 'F4', // F
            71: 'G4', // G
            72: 'A4', // H
            73: 'B4', // J
            74: 'C5', // K
            // Add more keys and notes as needed
          };

        keyboard.down((key) => {

            const note = keyToNote[key.keyCode];
            if(note)
            {
                this.synth.triggerAttack(note);
            }
        });

        keyboard.up(() => {
            this.synth.triggerRelease();
        })
      }

      handleButtonClick = (instrument, e) => {
        e.preventDefault();
        console.log("Selected: " + instrument);

        if(instrument === 'synth')
        {
            this.synth.triggerAttack('C4', "8n");
        } else if (instrument === 'amsynth')
        {
            this.amSynth.triggerAttack('C4', "8n");
        } else if (instrument === 'monosynth')
        {
            this.amSynth.triggerAttack('C4', "8n");
        } else if (instrument === 'qwerty')
        {
            console.log("no audio set up.");
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
                <div class="card">
                    <div class="card-body">
                        Keyboard
                        <button onClick={(e) => this.handleButtonClick('qwerty', e)}>Select</button>
                    </div>
                </div>
                {this.props.selectedDevice ? (
                    <p>Connected Device: {this.props.selectedDevice}</p>
                ) : (
                    <p>No device connected.</p>
                )}
            </div>
            
        )
    }
}

export default Play;