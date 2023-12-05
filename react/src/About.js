import React from 'react';

class About extends React.Component
{
    render()
    {
        return(
            <div className="container d-flex align-items-center">
                <div className="text-center">
                    <div className="m-5">
                        <h1>About Page</h1>
                    </div>
                    <div className="text-start">
                        <p>
                            <strong>MIDI Keys</strong> is a simple MIDI-based online synthesizer. It is designed to be a place where musicians and producers can learn to creatively interact with MIDI devices.
                        </p>
                        <p>
                            MIDI is one of the most widely-used tools in the music industry. MIDI stands for Musical Instrument Digital Interface and allows musical instruments, computers, and hardware to communicate and pass information such as musical notes, velocity, and pitch. And this is just the beginning.
                        </p>
                        <p>
                            MIDI allows musical devices to be able to communicate with computers to pass information such as notes, velocity, and pitch.
                        </p> 
                    </div>
                </div>
            </div>
        )
    }
}

export default About;