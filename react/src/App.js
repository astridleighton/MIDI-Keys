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

const MIDIContext = createContext();
export const useMIDIContext = () => useContext(MIDIContext);

const App = () => {
  const [fullName, setFullName] = useState("");
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [midiAccess, setMIDIAccess] = useState(null);
  const [inputDevices, setInputDevices] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState();

  // TODO: ensure midi device list updates when a device is disconnected abruptly or reconnected
  // TODO: look into midiAccess.onstatechange function

  useEffect(() => {
      const fetchMIDIData = async () => {
        try {
          navigator.requestMIDIAccess().then(async (midiAccess) => {
            midiAccess.addEventListener('statechange', function(e) {
                console.log(e);
            })
            /* midiAccess.onstatechange = (event) => {
              console.log('MIDI event!');
            } */
            await listMIDIInputs(midiAccess);

            if (connectedDevice) {
              Tone.Transport.set({ midi: connectedDevice })
            } else {
              console.log('Connected device is blank.');
            }
          })
        } catch (error) {
          console.error('MIDI Access failed: ', error);
        }
      }

      fetchMIDIData();

  }, []);

  const listMIDIInputs = async (midiAccess) => {
    const inputs = midiAccess.inputs.values();
    const midiInputs = [];
    console.log('MIDI inputs2: ');
    for (let input of inputs) {
      console.log(input.name);
      midiInputs.push(input.name)
    }
    setInputDevices(midiInputs);
    return midiInputs;
  }

  const updateConnectedDevice = async (device) => {
    console.log('Setting connected device ' + device);
    setConnectedDevice(device);
    // TODO: update Tone.js output
    // TODO: add error handling
  }

  const removeConnectedDevice = () => {
    setConnectedDevice(undefined);
    console.log('Disconnecting device ' + connectedDevice);
    // TODO: update Tone.js output
    // TODO: add error handling
  }

  // TODO: implement this or add auth context
  const userAuthenticated = () => {
    setIsAuthenticated(true);
  }

  return (
    <MIDIContext.Provider value={{ connectedDevice, inputDevices }}>
      <div className="app-container d-flex flex-column" style={{ backgroundColor: '#f8f8f8' }}>
            <Router>
                <Navbar isAuthenticated={isAuthenticated}/>
                <Routes>
                    <Route exact path="/" element={<Play midiAccess={midiAccess} selectedDevice={connectedDevice} fullName={fullName} />} />
                    <Route exact path="/connect" element={<Connect connectedDevice={connectedDevice} updateConnectedDevice={updateConnectedDevice} midiInputDevices={inputDevices} />} />
                    <Route exact path="/about" element={<About />} />
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/register" element={<Register />} />
                </Routes>
            </Router>
            <div className="fixed-bottom">
                <Footer connectedDevice={connectedDevice} removeConnectedDevice={removeConnectedDevice} />
            </div>
        </div>
    </MIDIContext.Provider>
  )
}


export default App;
