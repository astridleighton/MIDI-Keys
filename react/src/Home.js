import React from 'react';

class Home extends React.Component
{
    render()
    {
        return(
            <div>
                <h1>Welcome to the MIDI App</h1>
                <p>MIDI stands for Musical Instrument Digital Interface. MIDI allows musical devices to be able to communicate with computers to pass information such as notes, velocity, and pitch.</p>
                <p>To get started, please connect a MIDI device by navigating to the MIDI page.</p>
            </div>
        )
    }
}

export default Home;