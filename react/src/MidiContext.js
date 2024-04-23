import React, { createContext, useState } from 'react';

const MidiContext = createContext();

/**
 * Defines connected device and user context
 * @param {*} children
 * @returns MIDI context for application
 */
const MidiProvider = ({ children }) => {

    const [connectedDevice, setConnectedDevice] = useState();
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedSound, setSelectedSound] = useState(null);


    // export values
    const contextInterface = {
        connectedDevice,
        setConnectedDevice,
        currentUser,
        setCurrentUser,
        selectedSound,
        setSelectedSound
    };

    // values that will be utilized by child components
    return (
        <MidiContext.Provider value={contextInterface}>
            {children}
        </MidiContext.Provider>
    )
}

export { MidiContext, MidiProvider };