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
                <div className={"white-key" + (isKeyPlayed("C4") ? " white-key-played" : "")}>A</div> {/*C*/}
                <div className={"black-key" + (isKeyPlayed("Db4") ? " black-key-played" : "")}>W</div> {/*Db*/}
                <div className={"white-key" + (isKeyPlayed("D4") ? " white-key-played" : "")}>S</div> {/*D*/}
                <div className={"black-key" + (isKeyPlayed("Eb4") ? " black-key-played" : "")}>E</div> {/*Eb*/}
                <div className={"white-key" + (isKeyPlayed("E4") ? " white-key-played" : "")}>D</div> {/*E*/}
                <div className={"white-key" + (isKeyPlayed("F4") ? " white-key-played" : "")}>F</div> {/*F*/}
                <div className={"black-key" + (isKeyPlayed("Gb4") ? " black-key-played" : "")}>T</div> {/*Gb*/}
                <div className={"white-key" + (isKeyPlayed("G4") ? " white-key-played" : "")}>G</div> {/*G*/}
                <div className={"black-key" + (isKeyPlayed("Ab4") ? " black-key-played" : "")}>Y</div> {/*Ab*/}
                <div className={"white-key" + (isKeyPlayed("A4") ? " white-key-played" : "")}>H</div> {/*A*/}
                <div className={"black-key" + (isKeyPlayed("Bb4") ? " black-key-played" : "")}>U</div> {/*Bb*/}
                <div className={"white-key" + (isKeyPlayed("B4") ? " white-key-played" : "")}>J</div> {/*B*/}
                <div className={"white-key" + (isKeyPlayed("C5") ? " white-key-played" : "")}>K</div> {/*C*/}
            </div>
        </div>
    )
}

export default Piano;