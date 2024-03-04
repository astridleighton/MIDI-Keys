import React from 'react';
import { Container, Typography, Grid } from '@mui/material';

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
        <Container>
            <Grid container>
                <Grid item sm={12}>
                    <Container sx={{p: '20px', textAlign: 'center'}}>
                        <Typography variant="h3">
                            About
                        </Typography>
                    </Container>
                </Grid>
                <Grid item sm={1} md={2}>
                    {/*Left margin*/}
                </Grid>
                <Grid item sm={10} md={8}>
                <Container>
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
                    </Container>
                </Grid>
                <Grid item sm={1} md={2}>
                    {/*Right margin*/}
                </Grid>
            </Grid>
        </Container>
    )
}

export default About;