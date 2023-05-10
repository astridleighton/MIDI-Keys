import React from 'react';

class Navbar extends React.Component
{
    // TODO: fix links
    
    render()
    {
        return(
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <a class="nav-link active" href="#home">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#connectMidi">Connect MIDI Device</a>
                    </li>
                </ul>
            </nav>
        )
    }
}

export default Navbar;