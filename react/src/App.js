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

  useEffect(() => {
      const fetchMIDIData = async () => {

        try {
          await navigator.requestMIDIAccess().then(async (midiAccess) => {
            const midiIns = await listMIDIInputs(midiAccess);
            const connectedDev = await updateConnectedDevice(midiIns[0]);

            console.log("MIDI inputs:");
            console.log(midiIns);
            
            // TODO: update state
            // TODO: ensure tone can connect to device
            console.log('first device: ' + midiIns[0]);
            const connectedDevice = new Tone.Midi(midiIns[0]);
            Tone.Transport.set({ midi: connectedDevice })
            
            
          })
          // const inputDevices = midiAccess.inputs.values();
          // console.log("Input devices " + inputDevices[0]);
          /* 

          setMIDIAccess(midiAccess);
          const midiDevices = await listMIDIInputs(midiAccess);
          setInputDevices(midiDevices);*/
        } catch (error) {
          console.error('MIDI Access failed: ', error);
        }
      }

      fetchMIDIData();

  }, []);

  const listMIDIInputs = async (midiAccess) => {
    const inputs = midiAccess.inputs.values();
    const midiInputs = [];
    console.log('MIDI inputs: ');
    for (let input of inputs) {
      console.log(input.name);
      midiInputs.push(input.name)
    }
    setInputDevices(midiInputs);
    return midiInputs;
  }

  const updateConnectedDevice = (device) => { // establish connection to device
    setConnectedDevice(device);
  }

  const removeConnectedDevice = () => {
    // setConnectedDevice(null);
  }

  return (
    <MIDIContext.Provider value={{ connectedDevice, inputDevices }}>
      <div className="app-container d-flex flex-column" style={{ backgroundColor: '#f8f8f8' }}>
            <Router>
                <Navbar />
                <Routes>
                    <Route exact path="/" element={<Play midiAccess={midiAccess} selectedDevice={connectedDevice} fullName={fullName} />} />
                    <Route exact path="/connect" element={<Connect connectedDevice={connectedDevice} updateConnectedDevice={updateConnectedDevice} midiInputDevices={inputDevices} />} />
                    <Route exact path="/about" element={<About />} />
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/register" element={<Register />} />
                </Routes>
            </Router>
            <div className="fixed-bottom">
                <Footer selectedDevice={connectedDevice} removeConnectedDevice={removeConnectedDevice} />
            </div>
        </div>
    </MIDIContext.Provider>
  )
}


export default App;
