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
import Cookies from 'js-cookie';

/**
 * Start-up: To begin application, navigate to the react folder and type "npm start"; make sure back-end is running as well by navigated to express and typing "index.js"
 * Parent component used to handle state
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

  /*updateDevices(e)
  {
      console.log(`Name: ${e.port.name}, Brand: ${e.port.manufacturer}, State: ${e.port.state}, Type: ${e.port.type}`);
  }*/

  /**
   * If there is an issue connecting to WebMIDI API, log failure message
   */
  /*onMIDIFailure()
  {
      console.log("Midi failure.");
  }*/

  /**
   * Updates state of connected device
   * @param {*} value 
   */
  updateConnectedDevice = (value) => {
    this.setState( { selectedDevice: value });
  }

  /**
   * Changes connected device state to null
   */
  removeConnectedDevice = () => {
    this.setState( { selectedDevice: null });
  }

  /**
   * Sets all routes, displays navbar, footer
   * @returns view
   */
  render()
  {
    return (
      <div className="app-container d-flex flex-column" style={{ backgroundColor: '#f8f8f8' }}>
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
            <Footer selectedDevice={this.state.selectedDevice} removeConnectedDevice={this.removeConnectedDevice}/>
        </div>
      </div>
    );
  }
}

export default App;
