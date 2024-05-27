import './About.scss'

/**
 * Displays basic website information
 */
const About = () =>
{
    // returns about view
    return(
        <div>
           <div className='about-container'>
            <div className='about-header'>
                <h1 className='about-title'>About</h1>
            </div>
            <div className='about-content'>
            <p>
                <strong>MIDI Keys</strong> is a simple MIDI-based online synthesizer. MIDI keys allows you to learn how to use your MIDI controller to make music.
            </p>
            <h3 style={{ paddingLeft: '20px' }}>How To Use</h3>
            <ol>
                <li>Plug in your MIDI device or use your built in computer keyboard.</li>
                <li>Navigate to the CONNECT page.</li>
                <li>Select your device from the list and click "connect."</li>
                <li>Navigate to the PLAY page.</li>
                <li>Select a sound from the list of samples.</li>
                <li>Create your own music.</li>
            </ol>
            <p>
            &emsp;&emsp;MIDI stands for Musical Instrument Digital Interface. It is one of the most widely-used tools in the music industry today. Although it can be complex to learn, it is an important tool in allowing musical instruments, computers, and hardware to communicate. MIDI is a protocol used to pass information from one device to another, such as musical notes, velocity, and pitch. And this is just the beginning.
            </p>
            <h3>Development</h3>
                    <p>
                    &emsp;MIDI Keys in the final stage of development, although it will receive further updates in the future. 
                    </p>
                    <ul>
                        <li style={{display: 'flex', justifyContent: 'center', fontSize: '20px'}}>Designed and developed by:&nbsp;<a href="https://github.com/astridleighton">Astrid Leighton</a></li>
                    </ul>
            </div>
    </div>
        </div>
        
    )
}

export default About;