import React from 'react';
import { Route, Link, Routes, BrowserRouter } from 'react-router-dom';
import Midi from './MidiDevices';
import Home from './Home';
import Login from './Login';

class Navbar extends React.Component
{
    render()
    {
        return(
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/play" element={<Midi />} />
            <Route exact path="/login" element={<Login />}/>
          </Routes>
            <Link to="/">Home</Link>
            <Link to="/play" devices={this.props.midi}>Play</Link>
            <Link to="/login">Login</Link>
        </BrowserRouter>
        )
    }
}

export default Navbar;