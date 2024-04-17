import React, { createContext, useState } from 'react';

const MidiContext = createContext();

const MidiProvider = ({ children }) => {
    const [connectedDevice, setConnectedDevice] = useState('test');
    const [currentUser, setCurrentUser] = useState(null);

    const contextInterface = {
        connectedDevice,
        setConnectedDevice,
        currentUser,
        setCurrentUser
    };

    return (
        <MidiContext.Provider value={contextInterface}>
            {children}
        </MidiContext.Provider>
    )
}

export { MidiContext, MidiProvider };