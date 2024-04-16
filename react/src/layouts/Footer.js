import React from 'react';
import { BottomNavigation, Toolbar, Button } from '@mui/material';
import './Footer.scss';
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
            <BottomNavigation sx= {{ position: 'fixed', width: '100%', bottom: 0}} class="footer">
                <Toolbar>
                <div className="container text-center p-3">
                        <span className="text-light">
                            {connectedDevice ? (
                                <span class="connectedDevice">Connected Device:&nbsp;{connectedDevice}&nbsp;
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