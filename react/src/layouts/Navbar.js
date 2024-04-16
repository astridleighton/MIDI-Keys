import React from 'react';
import './Navbar.scss';
import Cookies from 'js-cookie';
import { AppBar, Button, Typography, Toolbar } from '@mui/material';
import PianoIcon from '@mui/icons-material/Piano';

/**
 * Displays navigation bar for site navigation
 */
const Navbar = () =>
{

    // checks if user has been authenticated
    let isAuthenticated = !!Cookies.get('token');

    /**
     * Logs the user out and reloads the page
     * TODO: add in useEffect or handle reload better
     */
    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('name');
        window.location.reload();
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
                        variant="outline"
                    >
                        <a href="/" style={{ textDecoration: 'none', color: 'inherit', fontSize: '18px'}}>Play</a>
                    </Button>
                    <Button
                        variant="outline"
                    >
                        <a href="/connect" style={{ textDecoration: 'none', color: 'inherit', fontSize: '18px'}}>Connect</a>
                    </Button>
                    <Button
                        variant="outline"
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