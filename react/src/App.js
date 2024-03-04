import { React, useState, useEffect } from 'react';
import { Route, Link, Routes, BrowserRouter as Router} from 'react-router-dom';
import './App.css';
import Connect from './pages/Connect';
import Play from './pages/Play';
import Navbar from './layouts/Navbar';
import * as Tone from 'tone';
import About from './pages/About';
import Login from './authentication/Login';
import Register from './authentication/Register';
import Footer from './layouts/Footer';

/**
 * Start-up: To begin application, navigate to the react folder and type "npm start"; make sure back-end is running as well by navigated to express and typing "index.js"
 * Parent component used to handle state
 */
const App = () => {
  const [fullName, setFullName] = useState("");
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [midiSupported, setMIDISupported] = useState(false);
  const [midi, setMIDI] = useState(null);
  const [inputDevices, setInputDevices] = useState([]);
  
  useEffect(() => {
    // TODO: fix midi access
    const midiAccess = async () => {
      try {
        navigator.requestMIDIAccess();
        console.log("test!");
      } catch (error) {
        console.log("error!");
      }
    }
    /*navigator.requestMIDIAccess()
      .then(onMIDISuccess)
      .catch(onMIDIFailure);*/
  });

  const onMIDISuccess = (midiAccess) => {
    setMIDISupported(true);
    console.log("WebMIDI is supported in browser.", midiAccess);
    midiAccess.addEventListener('statechange', updateDevices);
    setMIDI(midiAccess);

    const midiIns = midiAccess.inputs;
    const inputs = midiIns.values();
    let keyboard = null;
    let midiInputArray = [];

    if (inputs != null) {
      for (let input of inputs) {
        console.log("Pushing " + input);
        midiInputArray.push(input);
        console.log(`Found MIDI input: ${input.name}, ID: ${input.id}`);
          if (input.name === "V49") {
              keyboard = input;
          }
      }
    } else {
      console.log("No MIDI inputs detected.");
    }

    /*if(keyboard != null) {
      useKeyboard(keyboard);
    }*/
  }

  const onMIDIFailure = (error) => {
    console.log("MIDI access not supported in browser: ", error);
  }

  const updateDevices = (e) => {
    console.log(`Name: ${e.port.name}, Brand: ${e.port.manufacturer}, State: ${e.port.state}, Type: ${e.port.type}`);
  }

  const updateConnectedDevice = (value) => {
    setConnectedDevice(value);
  }

  /*const removeConnectedDevice = () => {
    setSelectedDevice(null);
  }*/

  const useKeyboard = (keyboard) => {
    // TODO: add
  }

  return (
    <div className="app-container d-flex flex-column" style={{ backgroundColor: '#f8f8f8' }}>
            <Router>
                <Navbar />
                <Routes>
                    <Route exact path="/" element={<Play selectedDevice={connectedDevice} fullName={fullName} />} />
                    <Route exact path="/connect" element={<Connect connectedDevice={connectedDevice} updateConnectedDevice={updateConnectedDevice} midiInputs={inputDevices} />} />
                    <Route exact path="/about" element={<About />} />
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/register" element={<Register />} />
                </Routes>
            </Router>
            <div className="fixed-bottom">
                <Footer selectedDevice={connectedDevice} />
            </div>
        </div>
  )
}

export default App;
