import React, {useEffect} from 'react';
import './Piano.scss';

/**
 * Defines the on-screen keyboard view with black and white keys
 * @param {*} notes 
 * @returns piano view
 */
const Piano = ({ notes }) => {

    useEffect(() => {
        // re-renders when notes is updated
    }, [notes]);

    // determines if a note is played to render component with specified key
    const isKeyPlayed = (key) => {
        if(notes) {
            return notes.includes(key);
        }
    }

    // piano view
    return (
        <div className="piano-container">
            <div className="piano-content">
                <div className={"white-key" + (isKeyPlayed("C3") ? " white-key-played" : "")}>A</div> 
                <div className={"black-key" + ((isKeyPlayed("Db3") || isKeyPlayed("C#3"))  ? " black-key-played" : "")}>W</div>
                <div className={"white-key" + (isKeyPlayed("D3") ? " white-key-played" : "")}>S</div> 
                <div className={"black-key" + ((isKeyPlayed("Eb3")  || isKeyPlayed("D#3")) ? " black-key-played" : "")}>E</div> 
                <div className={"white-key" + (isKeyPlayed("E3") ? " white-key-played" : "")}>D</div> 
                <div className={"white-key" + (isKeyPlayed("F3") ? " white-key-played" : "")}>F</div> 
                <div className={"black-key" + ((isKeyPlayed("Gb3") || isKeyPlayed("F#3")) ? " black-key-played" : "")}>T</div>
                <div className={"white-key" + (isKeyPlayed("G3") ? " white-key-played" : "")}>G</div> 
                <div className={"black-key" + ((isKeyPlayed("Ab3") || isKeyPlayed("G#3")) ? " black-key-played" : "")}>Y</div> 
                <div className={"white-key" + (isKeyPlayed("A3") ? " white-key-played" : "")}>H</div>
                <div className={"black-key" + ((isKeyPlayed("Bb3") || isKeyPlayed("A#3"))? " black-key-played" : "")}>U</div>
                <div className={"white-key" + (isKeyPlayed("B3") ? " white-key-played" : "")}>J</div>
                <div className={"white-key" + (isKeyPlayed("C4") ? " white-key-played" : "")}>K</div>
                <div className={"black-key" + ((isKeyPlayed("Db4") || isKeyPlayed("C#4"))? " black-key-played" : "")}></div>
                <div className={"white-key" + (isKeyPlayed("D4") ? " white-key-played" : "")}></div>
                <div className={"black-key" + ((isKeyPlayed("Eb4") || isKeyPlayed("D#4"))? " black-key-played" : "")}></div>
                <div className={"white-key" + (isKeyPlayed("E4") ? " white-key-played" : "")}></div>
                <div className={"white-key" + (isKeyPlayed("F4") ? " white-key-played" : "")}></div>
                <div className={"black-key" + ((isKeyPlayed("Gb4") || isKeyPlayed("F#4")) ? " black-key-played" : "")}></div>
                <div className={"white-key" + (isKeyPlayed("G4") ? " white-key-played" : "")}></div>
                <div className={"black-key" + ((isKeyPlayed("Ab4") || isKeyPlayed("G#4"))? " black-key-played" : "")}></div>
                <div className={"white-key" + (isKeyPlayed("A4") ? " white-key-played" : "")}></div>
                <div className={"black-key" + ((isKeyPlayed("Bb4") || isKeyPlayed("A#4"))? " black-key-played" : "")}></div>
                <div className={"white-key" + (isKeyPlayed("B4") ? " white-key-played" : "")}></div>
                <div className={"white-key" + (isKeyPlayed("C5") ? " white-key-played" : "")}></div>
            </div>
        </div>
    )
}

export default Piano;