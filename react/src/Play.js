import React from 'react';
import * as Tone from 'tone';

class Play extends React.Component
{
    // used for testing
    constructor() {
        super();
        this.synth = new Tone.Synth().toDestination(); // Create a simple synth
      }
    
      // Function to play a note when the button is clicked
      playNote = () => {
        // Play a C4 note for 0.5 seconds
        this.synth.triggerAttackRelease('C4', '0.5');
      }
    render()
    {
        return(
            <div className="Play">
                {this.props.isLoggedIn ? (
                    <h1>Welcome, {this.props.fullName}!</h1>
                ) : (
                    <h1>MIDI Made Simple</h1>
                )}
                <button onClick={this.playNote}>Play Note</button>
                <h1>Sounds</h1>
                <ul>
                    <li>Sound #1</li>
                    <li>Sound #2</li>
                </ul>
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