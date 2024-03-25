import './Piano.scss';

const Piano = () => {

    const chordsPlayed = ['C', 'E', 'G']

    const isKeyPlayed = (key) => {
        return chordsPlayed.includes(key);
    }

    return (
        <div className="piano-container">
            <h1>Piano</h1>
            <div className="piano-content">
                <div className={"white-key" + (isKeyPlayed("C") ? " white-key-played" : "")}></div> {/*C*/}
                <div className={"black-key" + (isKeyPlayed("Db") ? " black-key-played" : "")}></div> {/*Db*/}
                <div className={"white-key" + (isKeyPlayed("D") ? " white-key-played" : "")}></div> {/*D*/}
                <div className={"black-key" + (isKeyPlayed("Eb") ? " black-key-played" : "")}></div> {/*Eb*/}
                <div className={"white-key" + (isKeyPlayed("E") ? " white-key-played" : "")}></div> {/*E*/}
                <div className={"white-key" + (isKeyPlayed("F") ? " white-key-played" : "")}></div> {/*F*/}
                <div className={"black-key" + (isKeyPlayed("Gb") ? " black-key-played" : "")}></div> {/*Gb*/}
                <div className={"white-key" + (isKeyPlayed("G") ? " white-key-played" : "")}></div> {/*G*/}
                <div className={"black-key" + (isKeyPlayed("Ab") ? " black-key-played" : "")}></div> {/*Ab*/}
                <div className={"white-key" + (isKeyPlayed("A") ? " white-key-played" : "")}></div> {/*A*/}
                <div className={"black-key" + (isKeyPlayed("Bb") ? " black-key-played" : "")}></div> {/*Bb*/}
                <div className={"white-key" + (isKeyPlayed("B") ? " white-key-played" : "")}></div> {/*B*/}
                <div className="white-key"></div> {/*C*/}
            </div>
        </div>
    )
}

export default Piano;