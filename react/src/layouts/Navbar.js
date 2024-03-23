import React from 'react';
import { Route, Link, Routes, BrowserRouter } from 'react-router-dom';
import './Navbar.css';
import Cookies from 'js-cookie';
import { AppBar, Button, TextField, Typography, Container, CssBaseline, Avatar, Grid, Toolbar } from '@mui/material';
//import PianoIcon from '@mui/icons-material/Piano';

/**
 * Displays navigation bar for site navigation
 */
const Navbar = () =>
{

    // TODO: have this rely on auth context?

    let isAuthenticated = !!Cookies.get('token');

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('name');
        window.location.reload();
    }
    
    /**
     * Shows navigation links and shows login/logout button depending on session cookie
     * @returns 
     */
    return(
        <div>
            <AppBar position="static" color="primary" sx={{ backgroundColor: '#000000' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ my: 2 }}>
                        MIDI Keys
                    </Typography>
                    <Button
                        variant="outline"
                    >
                        <a href="/" style={{ textDecoration: 'none', color: 'inherit'}}>Play</a>
                    </Button>
                    <Button
                        variant="outline"
                    >
                        <a href="/connect" style={{ textDecoration: 'none', color: 'inherit'}}>Connect</a>
                    </Button>
                    <Button
                        variant="outline"
                    >
                        <a href="/about" style={{ textDecoration: 'none', color: 'inherit'}}>About</a>
                    </Button>
                    <span style={{ marginLeft: 'auto' }}>
                        {isAuthenticated ? (
                                <Button
                                    variant="outlined"
                                    onClick={handleLogout}
                                    >
                                        Log Out
                                </Button>
                            ) : (
                                <Button
                                    variant="outlined"
                                    sx={{ marginLeft: 'auto' }}
                                >
                                    <a href="/login" style={{ textDecoration: 'none', color: 'white'}}>Login</a>
                                </Button>
                            )}
                    </span>
                </Toolbar>
            </AppBar>
        </div>
        
    )
}

export default Navbar;