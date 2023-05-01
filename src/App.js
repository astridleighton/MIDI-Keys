import React from 'react';
import logo from './logo.svg';
import './App.css';
import Midi from './Midi';
import Keyboard from './Keyboard';

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
          <Midi/>
          <Keyboard/>
    </div>
  );
}

export default App;
