import { React, useState, useEffect, useContext } from 'react';
import { Route, Routes, BrowserRouter as Router} from 'react-router-dom';
import './App.css';
import Connect from './pages/Connect';
import Play from './pages/Play';
import Navbar from './layouts/Navbar';
import * as Tone from 'tone';
import About from './pages/About';
import Login from './authentication/Login';
import Register from './authentication/Register';
import Footer from './layouts/Footer';
import {toast, Toaster} from 'react-hot-toast';
import { MidiContext } from './MidiContext';

/**
 * Main component used to handle Tone.js, MIDI device connections, and routing
 * @returns routes
 */
const App = () => {
  
  const [fullName] = useState();
  const [connectedDeviceName, setConnectedDeviceName] = useState(); // TODO: change so connected device persists
  const [inputDevices, setInputDevices] = useState([]);
  const [errorMessage, setErrorMessage] = useState();
  const [midiStateChanged, setMidiStateChanged] = useState(false);

  const { currentUser, setConnectedDevice, connectedDevice } = useContext(MidiContext);

  /*
  * Runs when component mounts, sets up MIDI access and lists MIDI devices
  */
  useEffect(() => {

    /**
     * Sets up MIDI access
     */
    const setUpMIDI = async () => {
      try {
        console.log('current user' + currentUser);
          const midiAccess = await navigator.requestMIDIAccess();
          midiAccess.addEventListener("statechange", handleStateChange);
          await listMIDIInputs(midiAccess);
      } catch (error) {
        console.error('MIDI Access failed: ', error);
      }
    }

    setUpMIDI();

    // cleanup when component unmounts
    return () => {
      navigator.requestMIDIAccess().then((midiAccess) => {
        midiAccess.removeEventListener('statechange', handleStateChange);
      }).catch((error) => {
        console.error('Error removing event listener', error);
      })
    };

  }, [midiStateChanged]);

   /**
     * Handles MIDI event (connect, disconnect)
     * @param {*} event MIDI change
     */
   const handleStateChange = async (event) => {
    event.preventDefault();
    if(event.port.state === 'disconnected') {
      toast.dismiss();
      toast.error('MIDI device disconnected.');
      setMidiStateChanged(true);
    } else if (event.port.state === 'connected') {
      toast.dismiss();
      toast.success('MIDI device connected.');
      setMidiStateChanged(true);
      window.location.reload();
    }
  }

  /**
   * Lists MIDI inputs and adds to state
   * @param {*} midiAccess 
   * @returns MIDI inputs
   */
  const listMIDIInputs = async (midiAccess) => {
    const inputs = Array.from(midiAccess.inputs.values());
    inputs.forEach(input => {
      console.log(input);
      if(connectedDevice === 'MPKmini2') {
        setConnectedDevice(input);
        setConnectedDeviceName(input.name);
      }
    });
    setInputDevices(inputs);
    return inputs;
  }

  /**
   * Changes connected device and updates state
   * TODO: need to update Tone.js connection using Tone.transport.set()
   * @param {*} device MIDI device to connect
   */
  const updateConnectedDevice = async (device) => {
    console.log(`Connected device: ${device.name}`);
    // TODO: change so connected device changes -- set to keyboard for now
    // setConnectedDevice(device.name);
  }

  /**
   * Removes connected device and updates state
   * Removes Tone.js input device
   */
  const removeConnectedDevice = () => {
    setConnectedDevice(undefined);
    setConnectedDeviceName(null);

    if(connectedDevice) {
      console.log(`Disconnecting device: ${connectedDevice.name}`);
    } else {
      console.log('Disconnecting device.');
    }
    Tone.Transport.set({ midi: null });
  }

  // returns routes and basic view
  return (
      <div className="app-container d-flex flex-column" style={{ backgroundColor: '#f8f8f8', marginTop: '60px' }}>
        <Toaster/>
            <Router>
                <Navbar/>
                <Routes>
                    <Route exact path="/" element={<Play fullName={fullName} connectedDevice={connectedDevice} errorMessage={errorMessage} />} />
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
  )
}

export default App;
