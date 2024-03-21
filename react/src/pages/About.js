import React from 'react';
import { Container, Typography, Grid } from '@mui/material';

import './About.scss'
/**
 * Displays basic website information
 */
const About = () =>
{

    /**
     * Shows website information and helps users understand the purpose of the site
     * @returns view
     */

    return(
        <div className='about-container'>
            <div className='about-header'>
                <h1 className='about-title'>About</h1>
            </div>
            <div className='about-content'>
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
                        Right now, MIDI Keys is in its final stages of development, with the final features being added by the end of April. Here is what will be implemented:
                        <ul className="m-2">
                            <li>Display current chord played</li>
                            <li>Additional instrument samples</li>
                            <li>Ability to select MIDI device</li>
                        </ul>
                    </p>
                    <span>
                        <p>Developer: <a href="https://github.com/astridleighton" alt="link to developer's GitHub">Astrid Leighton</a></p>
                    </span>
            </div>
        </div>
    )
}

export default About;