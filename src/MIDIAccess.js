import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';

class MIDIAccess
{
    constructor()
    {
        navigator.requestMIDIAccess()
            .then(this.onMIDISuccess.bind(this), this.onMIDIFailure.bind(this));
        this.midi = null;
        this.currentNotes = [];
    }

    onMIDISuccess(midiAccess)
    {
        console.log("WebMIDI is supported in browser.");
        console.log(midiAccess);
        midiAccess.addEventListener('statechange', this.updateDevices);
        this.midi = midiAccess;

        const midiIns = midiAccess.inputs;
        const midiOuts = midiAccess.outputs;

        const inputs = midiIns.values();
        const outputs = midiOuts.values();

        let keyboard = null;

        // list midi inputs to console
        if (inputs != null)
        {
            for(let input of inputs)
            {
                console.log(`Found MIDI input: ${input.name}, ID: ${input.id}`);
                if(input.name === "V49")
                {
                    keyboard = input;
                }
                //input.onMIDIMessage = this.onMIDIMessage.bind(this);
            }
        }
        else
        {
            console.log("No MIDI inputs detected.");
        }

        // list midi outputs to console
        if(outputs != null)
        {
            for(let output of outputs)
            {
                console.log(`Found MIDI output: ${output.name}, ID: ${output.id}`);
            }
        }

        if(keyboard != null)
        {
            this.useKeyboard(keyboard);
        }
        
    }

    updateDevices(e)
    {
        console.log(`Name: ${e.port.name}, Brand: ${e.port.manufacturer}, State: ${e.port.state}, Type: ${e.port.type}`);
    }

    onMIDIFailure()
    {
        console.log("Midi failure.");
    }

    onMIDIMessage = (event) =>
    {
        let message = `MIDI message received at timestamp ${event.timeStamp}[${event.data.length} bytes]: `;

        for(const character of event.data)
        {
            message += `0x${character.toString(16)}`;
        }

        console.log(message);
    }

    noteOn(note, velocity)
    {   
        console.log(note, velocity);
    }

    noteOff(note)
    {
        console.log(note + " off")
    }

    // NOTES: 0-127
    useKeyboard(keyboard)
    {
        keyboard.onmidimessage = function (event)
        {
            const command = event.data[0];
            const note = event.data[1];
            const velocity = event.data[2];

            switch (command)
            {
                case 144: // note on
                    if(velocity > 0)
                    {
                        console.log("Playing " + note);
                        //this.noteOn(note, velocity);
                    }
                    else
                    {
                        console.log("Stopped playing " + note);
                        //this.noteOff(note);
                    }
                    break;
                case 128: // note off
                    console.log("Stopped playing " + note);
                    //this.noteOff();
                    break;
                default:
                    break;
            }
        }

    }
}


export default MIDIAccess;