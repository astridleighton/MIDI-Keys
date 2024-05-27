import React, { createContext, useState, useContext } from 'react';

type MidiContextType = {
    connectedDevice: string | null;
    setConnectedDevice: React.Dispatch<React.SetStateAction<string | null>>;
    currentUser: string | null;
    setCurrentUser: React.Dispatch<React.SetStateAction<string | null>>;
    selectedSound: string | null;
    setSelectedSound: React.Dispatch<React.SetStateAction<string | null>>;
};

const MidiContext = createContext<MidiContextType | undefined>(undefined);

/**
 * Defines connected device and user context
 * @param {*} children
 * @returns MIDI context for application
 */
const MidiProvider = ({ children }) => {
    const [connectedDevice, setConnectedDevice] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [selectedSound, setSelectedSound] = useState<string | null>(null);


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
};

export { MidiContext, MidiProvider };