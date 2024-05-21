import React, { useContext } from 'react';
import { BottomNavigation, Toolbar, Button } from '@mui/material';
import './Footer.scss';
import { MidiContext} from '../MidiContext';

/**
 * Displays connected device and allows user to remove it
 */
const Footer = ({ removeConnectedDevice }) =>
{
    const midiContext = useContext(MidiContext);

    if (!midiContext) {
        return null;
    }

    /**
     * Uses parent function to remove connected device
     */
    const removeDevice = () => {
        removeConnectedDevice()
    }

    // displays footer view and shows connected device
    return(
        <div>
            <BottomNavigation component="footer" sx={{ position: 'fixed', width: '100%', bottom: 0}} className="footer">
                <Toolbar>
                <div className="container text-center p-3">
                        <span className="text-light">
                            {midiContext.connectedDevice ? (
                                <span className="connectedDevice">Connected Device:&nbsp;V49 Keyboard&nbsp;
                                <Button
                                    variant="outlined"
                                    onClick={removeDevice}
                                    sx={{marginLeft: '10px'}}
                                >
                                    Disconnect
                                </Button>
                                </span>
                            ) : (
                                <div className="connectedDevice">No device connected.</div>
                            )}
                        </span>
                    </div>
                </Toolbar>
            </BottomNavigation>
        </div>
    ) 
}

export default Footer;