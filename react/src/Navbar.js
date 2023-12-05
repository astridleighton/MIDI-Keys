import React from 'react';
import { Route, Link, Routes, BrowserRouter } from 'react-router-dom';
import './Navbar.css';
import Cookies from 'js-cookie';

class Navbar extends React.Component
{
    render()
    {
        const isAuthenticated = !!Cookies.get('token');

        return(
            <div className="navbar navbar-dark bg-dark">
                <span class="navbar-brand mb-0 h1">MIDI Keys</span>
                <ul class="mt-2 mt-lg-0 ml-auto">
                    <li class="nav-item active">
                        <Link to="/" class="nav-link">Play</Link>
                    </li>
                    <li class="nav-item">
                        <Link to="/connect" devices={this.props.midi}>Connect</Link>
                    </li>
                    <li class="nav-item">
                        <Link to="/about">About</Link>
                    </li>
                </ul>
                <span class="nav-item">
                        {isAuthenticated ? (
                        <Link to="/logout">Log Out</Link>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </span>
            </div>
        )
    }
}

export default Navbar;