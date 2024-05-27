import React, { useEffect, useState, useContext } from 'react';
import './Navbar.scss';
import Cookies from 'js-cookie';
import { AppBar, Button, Typography, Toolbar } from '@mui/material';
import PianoIcon from '@mui/icons-material/Piano';
import { MidiContext } from '../MidiContext';
// import {toast, Toaster} from 'react-hot-toast';

/**
 * Displays navigation bar with basic site links
 */
const Navbar = () =>
{

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const midiContext = useContext(MidiContext);

    // updates page based on auth status
    useEffect(() => {
        if(midiContext && midiContext.currentUser) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [])

    /**
     * Logs the user out and reloads the page
     */
    const handleLogout = () => {
        if(midiContext) {
            Cookies.remove('token');
            Cookies.remove('name');
            midiContext.setCurrentUser(null);
            // toast.success('Sign out successful.');
        }
    }
    
    // shows navigation link and user authentication status
    return(
        <div>
            <AppBar color="primary" sx={{ backgroundColor: '#000000', position: 'fixed' }}>
                <Toolbar>
                    <PianoIcon/>
                    <Typography variant="h5" sx={{ my: 2, marginRight: '20px' }}>
                        MIDI Keys
                    </Typography>
                    <Button
                        variant="outlined"
                    >
                        <a href="/" style={{ textDecoration: 'none', color: 'inherit', fontSize: '18px'}}>Play</a>
                    </Button>
                    <Button
                        variant="outlined"
                    >
                        <a href="/connect" style={{ textDecoration: 'none', color: 'inherit', fontSize: '18px'}}>Connect</a>
                    </Button>
                    <Button
                        variant="outlined"
                    >
                        <a href="/about" style={{ textDecoration: 'none', color: 'inherit', fontSize: '18px'}}>About</a>
                    </Button>
                    <span style={{ marginLeft: 'auto' }}>
                        {isAuthenticated ? (
                                <Button
                                    variant="outlined"
                                    onClick={handleLogout}
                                    >
                                        Sign Out
                                </Button>
                            ) : (
                                <Button
                                    variant="outlined"
                                    sx={{ marginLeft: 'auto' }}
                                >
                                    <a href="/login" style={{ textDecoration: 'none', color: 'white'}}>Sign In</a>
                                </Button>
                            )}
                    </span>
                </Toolbar>
            </AppBar>
        </div>
        
    )
}

export default Navbar;