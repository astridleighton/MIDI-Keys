import React from 'react';

/*
    Displays basic website information and future implementations
*/
class About extends React.Component
{

    render()
    {
        return(
            <div className="container d-flex align-items-center">
                <div className="text-center">
                    <div className="m-5">
                        <h1>About</h1>
                    </div>
                    <div className="text-start">
                        <p>
                            <strong>MIDI Keys</strong> is a simple MIDI-based online synthesizer. It is designed to be a place where musicians and producers can learn to creatively interact with MIDI devices.
                        </p>
                        <p>
                            MIDI is one of the most widely-used tools in the music industry. MIDI stands for Musical Instrument Digital Interface and allows musical instruments, computers, and hardware to communicate and pass information such as musical notes, velocity, and pitch. And this is just the beginning.
                        </p>
                        <p>
                            To begin, connect a MIDI device using a MIDI cable. Then, select the device from the <a href="/connect">connect</a> page.
                        </p>
                        <p>
                            Right now, MIDI Keys is in its early stages of development, with new features being added next semester in April. Here is what will be implemented:
                            <ul className="m-2">
                                <li>Display current chord played</li>
                                <li>Additional instrument samples</li>
                                <li>Improved user interface (UI)</li>
                                <li>Ability to save favorite sounds to user account</li>
                            </ul>
                        </p>
                        <span>
                            <p>Developer: <a href="https://github.com/astridleighton" alt="link to developer's GitHub">Astrid Leighton</a></p>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}

export default About;