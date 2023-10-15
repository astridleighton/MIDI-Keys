import React from 'react';
import { Route, Link, Routes, BrowserRouter } from 'react-router-dom';
import './Navbar.css';

class Navbar extends React.Component
{
    render()
    {
        return(
            <div className="navbar">
                <ul>
                    <li>
                        <Link to="/">Play</Link>
                    </li>
                    <li>
                        <Link to="/connect" devices={this.props.midi}>Connect</Link>
                    </li>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                </ul>
            </div>
        )
    }
}

export default Navbar;