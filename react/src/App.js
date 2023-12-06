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
import Footer from './Footer';

/*
    - Start-up: To begin application, navigate to the react folder and type "npm start"; make sure back-end is running as well by navigated to express and typing "index.js"

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
    };
}

/**
 * Initializes MIDI access
 */
componentDidMount()
{
  navigator.requestMIDIAccess()
  .then((midiAccess) => this.onMIDISuccess(midiAccess), 
        (error) => this.onMIDIFailure(error));
}

/**
 * If WebMIDI API connection is successful, get MIDI inputs
 * @param {*} midiAccess 
 */
onMIDISuccess(midiAccess)
  {
      //Tone.start();
      console.log("WebMIDI is supported in browser.");
      console.log(midiAccess);
      midiAccess.addEventListener('statechange', this.updateDevices);
      this.midi = midiAccess;

      const midiIns = midiAccess.inputs;
      const inputs = midiIns.values();
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

      if(keyboard != null)
      {
          this.useKeyboard(keyboard);
      }
      
  }

  updateDevices(e)
  {
      console.log(`Name: ${e.port.name}, Brand: ${e.port.manufacturer}, State: ${e.port.state}, Type: ${e.port.type}`);
  }

  /**
   * If there is an issue connecting to WebMIDI API, log failure message
   */
  onMIDIFailure()
  {
      console.log("Midi failure.");
  }

  // NOTES: 0-127
  useKeyboard = (keyboard) =>
  {
    
      keyboard.onmidimessage = function (event)
      {
          const command = event.data[0];
          const noteInput = event.data[1];
          const velocity = event.data[2];
          const note = midiToNote(noteInput);

          switch (command)
          {
              case 144: // note on
                  if(velocity > 0)
                  {
                      console.log("Playing " + note);

                      // play note with Tone.JS
                      const synth = new Tone.Synth().toDestination();
                      synth.triggerAttackRelease(Tone.Midi(note).toFrequency(), "4n");
                  }
                  else
                  {
                      console.log("Stopped playing " + note);
                      const index = this.chord.indexOf(note);
                        if (index !== -1) {
                        this.chord.splice(index, 1);
                        }
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

  }

  updateConnectedDevice = (value) => {
    this.setState( { selectedDevice: value });
  }

  

  render()
  {
    return (
      <div className="app-container d-flex flex-column">
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
        <div className="fixed-bottom">
            <Footer selectedDevice={this.state.selectedDevice}/>
        </div>
      </div>
    );
  }
}

export default App;
