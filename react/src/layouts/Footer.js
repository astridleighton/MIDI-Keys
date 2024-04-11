import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';

/**
 * Displays connected device and allows user to remove it
 */
const Footer = ({ connectedDevice, removeConnectedDevice }) =>
{
    /**
     * Uses parent function to remove connected device
     */
    const removeDevice = () => {
        removeConnectedDevice()
    }

    // displays footer view and shows connected device
    return(
        <div>
            { /*<AppBar style= {{ position: 'fixed', bottom: 0}}>
                <Toolbar>
                <div className="container text-center p-3">
                        <span className="text-light">
                            {connectedDevice ? (
                                <span>Connected Device:&nbsp;{connectedDevice}&nbsp;
                                <Button
                                    variant="outlined"
                                    onClick={removeDevice}
                                >
                                    Disconnect
                                </Button>
                                </span>
                            ) : (
                                <span>No device connected.</span>
                            )}
                        </span>
                    </div>
                </Toolbar>
                            </AppBar> */ }
        </div>
    ) 
}

export default Footer;
/* <footer className="footer text-center text-lg-start bg-dark">
                <div className="container text-center p-3">
                    <span className="text-light">
                        {connectedDevice ? (
                            <span>Connected Device:&nbsp;{connectedDevice}&nbsp;
                                <button type="submit" className="btn btn-primary btn-block ms-auto" style={{ backgroundColor: 'grey', color: 'black'}} onClick={removeDevice}>Disconnect</button>
                            </span>
                        ) : (
                            <span>No device connected.</span>
                        )}
                    </span>
                </div>
                        </footer> */