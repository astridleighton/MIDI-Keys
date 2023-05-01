import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';

class MIDIAccess
{

    checkMIDIAccess = () =>
    {
        if (navigator.requestMIDIAccess)
        {
        console.log("Web Midi is supported.");
        //navigator.requestMIDIAccess().then(onMIDISupport, onMIDIFailure);

        } else {
            console.log('WebMIDI is not supported in this browser.');
            document.querySelector('.note-info').textContent = 'Error: This browser does not support WebMIDI.';
        }
    }

    onMIDISupport = (midiAccess) =>
    {
        console.log("test");
        var midiIns = midiAccess.inputs;
        var midiOuts = midiAccess.outputs;
    }

    onMIDIFailure =  () =>
    {
        console.log("Midi failure.");
    }

    getMIDIInfo = (message) =>
    {
        var command = message.data[0];
        var note = message.data[1];
        var velocity = message.data[2];

        switch (command)
        {
            case 144: // note on
            /*document.querySelector('.note-info').textContent = 'Command: ' + command +
            ' , Note: ' + note + ' , Velocity: ' + velocity;*/
        //noteOnListener(note);
        break;
        }
    }

    noteOnListener = (note) =>
    {
        console.log("test");
    }
}


export default MIDIAccess;