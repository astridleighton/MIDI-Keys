import React from 'react';
import { Route, Link, Routes, BrowserRouter } from 'react-router-dom';
import './Navbar.css';
import Cookies from 'js-cookie';

/**
 * Displays navigation bar for site navigation
 */
class Navbar extends React.Component
{

    handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('name');
        window.location.reload();
    }
    
    /**
     * Shows navigation links and shows login/logout button depending on session cookie
     * @returns 
     */
    render()
    {
        const isAuthenticated = !!Cookies.get('token');

        return(
            <div className="navbar navbar-dark bg-dark">
                <span className="navbar-brand mb-0 h1">MIDI Keys</span>
                <ul className="mt-2 mt-lg-0 ml-auto">
                    <li className="nav-item active">
                        <Link to="/" className="nav-link">Play</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/connect" devices={this.props.midi}>Connect</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/about">About</Link>
                    </li>
                </ul>
                <span className="nav-item">
                        {isAuthenticated ? (
                        <Link><span onClick={this.handleLogout}>Log Out</span></Link>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </span>
            </div>
        )
    }
}

export default Navbar;