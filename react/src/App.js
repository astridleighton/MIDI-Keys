import { React, useState, useEffect, useContext, createContext } from 'react';
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
  const [midiAccess, setMIDIAccess] = useState(null);
  const [midi, setMIDI] = useState(null);
  const [inputDevices, setInputDevices] = useState([]);

  const updateDevices = (e) => {
    console.log(`Name: ${e.port.name}, Brand: ${e.port.manufacturer}, State: ${e.port.state}, Type: ${e.port.type}`);
  }

  useEffect(() => {
    navigator.requestMIDIAccess()
      .then(
        midiAccess => {
          setMIDIAccess(midiAccess);
        },
        error => {
          console.error('MIDI access request failed:', error);
          setMIDIAccess(error);
        }
      );
  }, [])

  const updateConnectedDevice = (device) => {
    // establish connection to device
    setConnectedDevice(device);
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
                    <Route exact path="/" element={<Play midiAccess={midiAccess} selectedDevice={connectedDevice} fullName={fullName} />} />
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
