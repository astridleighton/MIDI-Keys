import React from 'react';
//import { Link } from 'react-router-dom';

class Navbar extends React.Component
{
    // TODO: fix links
    /*<Link class="navbar-brand" to="/">MIDI</Link>*/
    
    render()
    {
        return(
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
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