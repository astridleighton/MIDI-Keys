import react, { useState, useEffect, useContext } from 'react';
import { Route, Routes, BrowserRouter as Router} from 'react-router-dom';
import './App.css';
import Connect from './pages/Connect';
import Play from './pages/Play';
import Navbar from './layouts/Navbar';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './layouts/Footer';
import {toast, Toaster} from 'react-hot-toast';
import { MidiContext } from './MidiContext';

/** TODO: create input object type, fix connected device in play, maybe pass connected device as a prop so not everything has access to the midi context? */
// TODO: fix toaster

type midiInput = {

}

/**
 * Main component used to handle Tone.js, MIDI device connections, and routing
 * @returns routes
 */
const App = () => {
  
  const [fullName] = useState<string | null>(null);
  const [connectedDeviceName, setConnectedDeviceName] = useState<string | null>();
  const [inputDevices, setInputDevices] = useState<midiInput[]>([]);
  const [midiStateChanged, setMidiStateChanged] = useState<boolean>(false);

  const midiContext = useContext(MidiContext);

  /*
  * Runs when component mounts, sets up MIDI access and lists MIDI devices
  */
  useEffect(() => {

    /**
     * Sets up MIDI access
     */
    const setUpMIDI = async () => {
      try {
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
      /* toast.dismiss();
      toast.error('MIDI device disconnected.'); */
      setMidiStateChanged(true);
    } else if (event.port.state === 'connected') {
      /* toast.dismiss();
      toast.success('MIDI device connected.'); */
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
    const inputs: midiInput[] = Array.from(midiAccess.inputs.values());
    inputs.forEach(input => {
      console.log(input);
    });
    setInputDevices(inputs);
    return inputs;
  }

  /**
   * Changes connected device and updates state
   * @param {*} device MIDI device to connect
   */
  const updateConnectedDevice = async (device) => {
    console.log(`Connected device: ${device.name}`);
  }

  /**
   * Removes connected device and updates state
   * Removes Tone.js input device
   */
  const removeConnectedDevice = () => {
    midiContext?.setConnectedDevice(null);
    setConnectedDeviceName(null);
    console.log('Disconnecting device.');

    // Tone.Transport.set({ midi: null });
  }

  // returns routes and basic view
  return (
      <div className="app-container d-flex flex-column" style={{ backgroundColor: '#f8f8f8', marginTop: '60px' }}>
            <Router>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<Play />} />
                    <Route path="/connect" element={<Connect updateConnectedDevice={updateConnectedDevice} midiInputDevices={inputDevices} />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </Router>
            <div className="fixed-bottom">
                <Footer removeConnectedDevice={removeConnectedDevice} />
            </div>
        </div>
  )
}

export default App;
