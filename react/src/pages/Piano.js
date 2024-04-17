import React, {useEffect} from 'react';
import './Piano.scss';

const Piano = ({ notes }) => {

    useEffect(() => {
        // re-renders when notes is updated
    }, [notes]);

    const isKeyPlayed = (key) => {
        if(notes) {
            return notes.includes(key);
        }
    }

    return (
        <div className="piano-container">
            <div className="piano-content">
                <div className={"white-key" + (isKeyPlayed("C4") ? " white-key-played" : "")}>A</div> {/*C4*/}
                <div className={"black-key" + ((isKeyPlayed("Db4") || isKeyPlayed("C#4"))  ? " black-key-played" : "")}>W</div> {/*Db4*/}
                <div className={"white-key" + (isKeyPlayed("D4") ? " white-key-played" : "")}>S</div> {/*D4*/}
                <div className={"black-key" + ((isKeyPlayed("Eb4")  || isKeyPlayed("D#4")) ? " black-key-played" : "")}>E</div> {/*Eb4*/}
                <div className={"white-key" + (isKeyPlayed("E4") ? " white-key-played" : "")}>D</div> {/*E4*/}
                <div className={"white-key" + (isKeyPlayed("F4") ? " white-key-played" : "")}>F</div> {/*F4*/}
                <div className={"black-key" + ((isKeyPlayed("Gb4") || isKeyPlayed("F#4")) ? " black-key-played" : "")}>T</div> {/*Gb4*/}
                <div className={"white-key" + (isKeyPlayed("G4") ? " white-key-played" : "")}>G</div> {/*G4*/}
                <div className={"black-key" + ((isKeyPlayed("Ab4") || isKeyPlayed("G#4")) ? " black-key-played" : "")}>Y</div> {/*Ab4*/}
                <div className={"white-key" + (isKeyPlayed("A4") ? " white-key-played" : "")}>H</div> {/*A4*/}
                <div className={"black-key" + ((isKeyPlayed("Bb4") || isKeyPlayed("A#4"))? " black-key-played" : "")}>U</div> {/*Bb4*/}
                <div className={"white-key" + (isKeyPlayed("B4") ? " white-key-played" : "")}>J</div> {/*B4*/}
                <div className={"white-key" + (isKeyPlayed("C5") ? " white-key-played" : "")}>K</div> {/*C5*/}
                <div className={"black-key" + ((isKeyPlayed("Db5") || isKeyPlayed("C#5"))? " black-key-played" : "")}></div> {/*Db5*/}
                <div className={"white-key" + (isKeyPlayed("D5") ? " white-key-played" : "")}></div> {/*D5*/}
                <div className={"black-key" + ((isKeyPlayed("Eb5") || isKeyPlayed("D#5"))? " black-key-played" : "")}></div> {/*Eb5*/}
                <div className={"white-key" + (isKeyPlayed("E5") ? " white-key-played" : "")}></div> {/*E5*/}
                <div className={"white-key" + (isKeyPlayed("F5") ? " white-key-played" : "")}></div> {/*F5*/}
                <div className={"black-key" + ((isKeyPlayed("Gb5") || isKeyPlayed("F#5")) ? " black-key-played" : "")}></div> {/*Gb5*/}
                <div className={"white-key" + (isKeyPlayed("G5") ? " white-key-played" : "")}></div> {/*G5*/}
                <div className={"black-key" + ((isKeyPlayed("Ab5") || isKeyPlayed("G#5"))? " black-key-played" : "")}></div> {/*Ab5*/}
                <div className={"white-key" + (isKeyPlayed("A5") ? " white-key-played" : "")}></div> {/*A5*/}
                <div className={"black-key" + ((isKeyPlayed("Bb5") || isKeyPlayed("A#5"))? " black-key-played" : "")}></div> {/*Bb5*/}
                <div className={"white-key" + (isKeyPlayed("B5") ? " white-key-played" : "")}></div> {/*B5*/}
                <div className={"white-key" + (isKeyPlayed("C6") ? " white-key-played" : "")}></div> {/*C6*/}
            </div>
        </div>
    )
}

export default Piano;