import React from 'react';

/**
 * Displays connected device
 */
const Footer = ({ selectedDevice }) =>
{

    /**
     * removes connected device from properties
     * @param {*} e 
     */
    const removeConnectedDevice = (e) => {
        removeConnectedDevice();
    }

    /**
     * Displays footer element
     * @returns view
     */

    return(
        <div>
            <footer className="footer text-center text-lg-start bg-dark">
                <div className="container text-center p-3">
                    <span className="text-light">
                        {selectedDevice ? (
                            <span>Connected Device: {selectedDevice}&nbsp;&nbsp;
                                <button type="submit" className="btn btn-primary btn-block ms-auto" style={{ backgroundColor: 'grey', color: 'black'}} onClick={removeConnectedDevice()}>Disconnect</button>
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