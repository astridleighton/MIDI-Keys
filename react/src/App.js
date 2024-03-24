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
import { WebMidi } from 'webmidi';

/**
 * Start-up: To begin application, navigate to the react folder and type "npm start"; make sure back-end is running as well by navigated to express and typing "index.js"
 * Parent component used to handle state
 */

/* const MIDIContext = createContext();
export const useMIDIContext = () => useContext(MIDIContext);*/

const App = () => {
  const [fullName, setFullName] = useState("");
  const [connectedDevice, setConnectedDevice] = useState();
  const [connectedDeviceName, setConnectedDeviceName] = useState(null);
  const [midiState, setMIDIState] = useState(null);
  const [inputDevices, setInputDevices] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState();

  useEffect(() => {

      const setUpMIDI = async () => {
        try {
            const midiAccess = await navigator.requestMIDIAccess();
            /* WebMidi.addListener('connected', (e) => {
              setInputDevices([...WebMidi.inputs])
            })
              WedMidi.addListener('disconnected, (e) => {
                setInputDevices([...WebMidi.inputs]);
            }) */
            midiAccess.addEventListener("statechange", handleStateChange);
            setMIDIState(midiAccess);
            // await setUpMIDI(midiAccess);
            await listMIDIInputs(midiAccess);

            // manually setting connected device for now
            await manuallySetUpConnectedDevice();

            /* if (connectedDevice) {
              Tone.Transport.set({ midi: connectedDevice })
            } else {
              console.log('Connected device is blank.');
            } */
        } catch (error) {
          console.error('MIDI Access failed: ', error);
        }
      }

      setUpMIDI();

      // TODO: probably can take out of here!
      // TODO: is state rendering properly? - fix so page reloads in a better way
      const handleStateChange = async (event) => {
        event.preventDefault();
        console.log("MIDI event");
        window.location.reload();
        // TODO: fix event type!
        if(event.type === 'disconnected') {
          console.log('Disconnected');
          // TODO: handle disconnect
        } else {
          setMIDIState(event);
        }
      }

      return () => {
        navigator.requestMIDIAccess().then((midiAccess) => {
          midiAccess.removeEventListener('statechange', handleStateChange);
        }).catch((error) => {
          console.error('Error removing event listener', error);
        })
      };

  }, []);
  

  const listMIDIInputs = async (midiAccess) => {
    const inputs = Array.from(midiAccess.inputs.values());
    inputs.forEach(input => {
      console.log(input);
      if(input.name === 'V49') {
        setConnectedDevice(input);
        setConnectedDeviceName(input.name);
      }
    });
    setInputDevices(inputs);
    return inputs;
  }

  const manuallySetUpConnectedDevice = async () => {
    const inputs = inputDevices;
    inputs.forEach(input => {
      console.log(input.name);
      if(input.name === 'V49') {
        setConnectedDevice(input);
      }
    });

  }

  const updateConnectedDevice = async (device) => {
    console.log('Setting connected device ' + device.name);
    setConnectedDevice(device);
    // TODO: update Tone.js output
  }

  const removeConnectedDevice = () => {
    setConnectedDevice(undefined);
    console.log('Disconnecting device.' + connectedDevice.name);
    Tone.Transport.set({ midi: null });
  }

  // TODO: implement this or add auth context
  const userAuthenticated = () => {
    setIsAuthenticated(true);
  }

  return (
    // <MIDIContext.Provider value={{ connectedDevice, inputDevices }}>
      <div className="app-container d-flex flex-column" style={{ backgroundColor: '#f8f8f8' }}>
            <Router>
                <Navbar isAuthenticated={isAuthenticated}/>
                <Routes>
                    <Route exact path="/" element={<Play fullName={fullName} connectedDevice={connectedDevice} />} />
                    <Route exact path="/connect" element={<Connect connectedDevice={connectedDevice} updateConnectedDevice={updateConnectedDevice} midiInputDevices={inputDevices} />} />
                    <Route exact path="/about" element={<About />} />
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/register" element={<Register />} />
                </Routes>
            </Router>
            <div className="fixed-bottom">
                <Footer connectedDevice={connectedDeviceName} removeConnectedDevice={removeConnectedDevice} />
            </div>
        </div>
    // </MIDIContext.Provider>
  )
}


export default App;
