import React from 'react';
import { Route, Link, Routes, BrowserRouter } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Midi from './Midi';
import Home from './Home';

/*
* Note: To begin application, navigate to midi-controller and type "npm start"
*
* Research: https://medium.com/swinginc/playing-with-midi-in-javascript-b6999f2913c3
https://www.smashingmagazine.com/2018/03/web-midi-api/
MidiWebAPI !!
*
* GitHub example: https://github.com/scott-ammon/web-midi-keyboard/blob/master/src/components/Keyboard.js
*/

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/midi" element={<Midi />} />
        </Routes>
        <Link to="/midi">Connect MIDI Device</Link>
      </BrowserRouter>
    </div>
  );
}

export default App;
