import React from 'react';

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
            <footer className="footer text-center text-lg-start bg-dark">
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
            </footer>
        </div>
    ) 
}

export default Footer;