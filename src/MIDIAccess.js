import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';

class MIDIAccess
{
    constructor()
    {
        navigator.requestMIDIAccess()
            .then(this.onMIDISuccess.bind(this), this.onMIDIFailure.bind(this));
    }

    onMIDISuccess(midiAccess)
    {
        console.log("WebMIDI is supported in browser.");
        var midiIns = midiAccess.inputs;
        var midiOuts = midiAccess.outputs;

        const inputs = midiIns.values();

        // list midi inputs to console
        if (inputs != null)
        {
            for(let input of inputs)
            {
                console.log(`Found MIDI input: ${input.name}`);
                input.onMIDIMessage = this.onMIDIMessage.bind(this);
            }
        }
        else
        {
            console.log("Please connect MIDI device.");
        }
        
    }

    onMIDIFailure =  () =>
    {
        console.log("Midi failure.");
    }

    getMIDIInfo = (event) =>
    {
        const note = event.data[1];
        console.log(`Playing note: ${note}`);
    }
}


export default MIDIAccess;