import React from 'react';
import { Route, Link, Routes, BrowserRouter } from 'react-router-dom';
import './Navbar.css';
import Cookies from 'js-cookie';

// TODO: pass is authenticated to here to show logout button

class Navbar extends React.Component
{
    render()
    {
        const isAuthenticated = !!Cookies.get('token');

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
                    {isAuthenticated ? (
                        <Link to="/logout">Log Out</Link>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                    </li>
                </ul>
            </div>
        )
    }
}

export default Navbar;