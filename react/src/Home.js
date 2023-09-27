import React from 'react';
import * as Tone from 'tone';

class Home extends React.Component
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
            <div>
                <h1>Welcome to the MIDI App</h1>
                <p>MIDI stands for Musical Instrument Digital Interface. MIDI allows musical devices to be able to communicate with computers to pass information such as notes, velocity, and pitch.</p>
                <p>To get started, please connect a MIDI device by navigating to the MIDI page.</p>
                <button onClick={this.playNote}>Play Note</button>
            </div>
            
        )
    }
}

export default Home;