import React from 'react';
import { Route, Link, Routes, BrowserRouter as Router} from 'react-router-dom';
import './App.css';
import Connect from './Connect';
import Play from './Play';
import Navbar from './Navbar';
import * as Tone from 'tone';
import About from './About';
import Login from './Login';
import Register from './Register';

/*
* Note: To begin application, navigate to midi-controller and type "npm start"
*
* Research: https://medium.com/swinginc/playing-with-midi-in-javascript-b6999f2913c3
https://www.smashingmagazine.com/2018/03/web-midi-api/
MidiWebAPI !!
*
* GitHub example: https://github.com/scott-ammon/web-midi-keyboard/blob/master/src/components/Keyboard.js
*/

class App extends React.Component
{

  constructor(props) {
    super();
    this.currentNote = null;
    this.state = {
        fullName: "",
        selectedDevice: null,
        midi: null,
        currentNotes: [],
        token: null,
        inputDeviceNames: [],
        //currentNote: null
    };
}

// TODO: wait for selected device
/*selectDevice = async (selectedDevice) => {
    this.setState({ selectedDevice });
    console.log("test");
}*/

// initializes midi access
componentDidMount()
{
  navigator.requestMIDIAccess()
  .then((midiAccess) => this.onMIDISuccess(midiAccess), 
        (error) => this.onMIDIFailure(error));
}

onMIDISuccess(midiAccess)
  {
      Tone.start();
      console.log("WebMIDI is supported in browser.");
      console.log(midiAccess);
      midiAccess.addEventListener('statechange', this.updateDevices);
      this.midi = midiAccess;

      const midiIns = midiAccess.inputs;
      //const midiOuts = midiAccess.outputs;

      const inputs = midiIns.values();
      //const outputs = midiOuts.values();

      let keyboard = null;

      // list midi inputs to console
      if (inputs != null)
      {
          for(let input of inputs)
          {

              console.log(`Found MIDI input: ${input.name}, ID: ${input.id}`);
              if(input.name === "V49")
              {
                  keyboard = input;
                  this.state.selectedDevice = input.name; // used for testing
              }
              //input.onMIDIMessage = this.onMIDIMessage.bind(this);
          }
      }
      else
      {
          console.log("No MIDI inputs detected.");
      }

      // list midi outputs to console
      /*if(outputs != null)
      {
          for(let output of outputs)
          {
              console.log(`Found MIDI output: ${output.name}, ID: ${output.id}`);
          }
      }*/

      if(keyboard != null)
      {
          this.useKeyboard(keyboard);
      }
      
  }

  updateDevices(e)
  {
      console.log(`Name: ${e.port.name}, Brand: ${e.port.manufacturer}, State: ${e.port.state}, Type: ${e.port.type}`);
  }

  onMIDIFailure()
  {
      console.log("Midi failure.");
  }

  onMIDIMessage = (event) =>
  {
      let message = `MIDI message received at timestamp ${event.timeStamp}[${event.data.length} bytes]: `;

      for(const character of event.data)
      {
          message += `0x${character.toString(16)}`;
      }

      console.log(message);
  }

  noteOn(note, velocity)
  {   
      console.log(note, velocity);
  }

  noteOff(note)
  {
      console.log(note + " off")
  }

  // NOTES: 0-127
  useKeyboard(keyboard)
  {
    
      keyboard.onmidimessage = function (event)
      {
          const command = event.data[0];
          const noteInput = event.data[1];
          const velocity = event.data[2];
          //const instrument = this.state.

          const note = midiToNote(noteInput);

          switch (command)
          {
              case 144: // note on
                  if(velocity > 0)
                  {
                      console.log("Playing " + note);
                      //this.noteOn(note, velocity);

                      // play note with Tone.JS
                      const synth = new Tone.Synth().toDestination();
                      synth.triggerAttackRelease(Tone.Midi(note).toFrequency(), "4n");
                      //this.currentNote = note;
                  }
                  else
                  {
                      console.log("Stopped playing " + note);
                      //this.setState({ currentNote: note });
                      //this.noteOff(note);
                  }
                  break;
              case 128: // note off
                  //console.log("Stopped playing " + note);
                  //this.noteOff();
                  break;
              default:
                  break;

                  /* COMMANDS:
                  * command 224 = pitch wheel, 176 = mod wheel
                  * 153/137 - pads
                  * 176 - buttons 
                  */
          }
      }

      

      /*
      * Converts MIDI input (number value) to note value and octave
      * Example: #28 -> E1
      */
      function midiToNote(midiInput)
      {
        const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
        const octave = Math.floor(midiInput / 12) -1;
        const noteIndex = midiInput % 12;

        const noteName = noteNames[noteIndex];
        return noteName + octave;
      }

      // TODO: bind to connected device

  }

  updateConnectedDevice = (value) => {
    this.setState( { selectedDevice: value });
  }

  render()
  {
    return (
      <div className="App">
        <Router>
            <Navbar />
            <Routes>
                <Route exact path="/" element={<Play selectedDevice={this.state.selectedDevice} fullName={this.state.fullName}/>} />
                <Route exact path="/connect" element={<Connect updateConnectedDevice={this.updateConnectedDevice} midiInputs={this.state.inputDeviceNames}/>} />
                <Route exact path="/about" element={<About />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/register" element={<Register />} />
            </Routes>
        </Router>
      </div>
    );
  }
}

export default App;
