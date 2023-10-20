import React from 'react';
import * as Tone from 'tone';

// https://musicjoeyoung.medium.com/build-a-piano-with-tone-js-618e2403d9de

class Play extends React.Component
{
    // used for testing
    constructor() {
        super();
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
      }
    
      // Function to play a note when the button is clicked
      playNote = () => {
        // Play a C4 note for 0.5 seconds
        this.synth.triggerAttackRelease('C4', '0.5');
      }

      playNote2 = () => {
        this.amSynth.triggerAttackRelease("C4", "0.5");
      }

      playNote3 = () => {
        this.monosynth.triggerAttackRelease("C4", "0.5");
      }

      // TODO: look into samples, organize better

    render()
    {
        return(
            <div className="Play">
                {this.props.isLoggedIn ? (
                    <h1>Welcome, {this.props.fullName}!</h1>
                ) : (
                    <h1>MIDI Made Simple</h1>
                )}
                
                <h1>Sounds</h1>
                <div class="card">
                    <div class="card-body">
                        Synth
                        <button onClick={this.playNote}>Play Note</button>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        AM Synth
                        <button onClick={this.playNote2}>Play Note</button>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        Mono Synth
                        <button onClick={this.playNote3}>Play Note</button>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        Sampler
                        <button onClick={this.playNote4}>Play Note</button>
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