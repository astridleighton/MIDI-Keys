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
        this.midi = midiAccess;

        var midiIns = midiAccess.inputs;
        var midiOuts = midiAccess.outputs;

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
            console.log("Please connect MIDI device.");
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

    onMIDIFailure =  () =>
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

    // NOTES: 0-127
    useKeyboard(keyboard)
    {
        keyboard.onmidimessage = function (event)
        {
            var noteNumber = event.data[1];

            if(event.data[0] === 144) // command is note on
            {
                //this.currentNotes.push(noteNumber); // add note to array
                console.log('Note number: ' + noteNumber);
            }
            else if (event.data[0] === 128)
            {
                //const index = this.currentNotes.indexOf(noteNumber);
                console.log("Note off.");

                /*if (index != -1) // remove from array
                {
                    this.currentNotes.splice(index, 1);
                }*/
            }
        }

    }
}


export default MIDIAccess;