import React from 'react';

/**
 * Displays connected device
 */
class Footer extends React.Component
{

    removeConnectedDevice = (e) => {
        this.props.removeConnectedDevice();
    }

    render()
    {
        return(
           <div>
                <footer className="footer text-center text-lg-start bg-dark">
                    <div className="container text-center p-3">
                        <span className="text-light">
                            {this.props.selectedDevice ? (
                                <span>Connected Device: {this.props.selectedDevice}&nbsp;&nbsp;
                                <button type="submit" className="btn btn-primary btn-block ms-auto" style={{ backgroundColor: 'grey', color: 'black'}} onClick={this.removeConnectedDevice}>Disconnect</button></span>
                                
                            ) : (
                                <span>No device connected.</span>
                            )}
                        </span>
                        
                    </div>
                </footer>
           </div>
           
        )
    }
}

export default Footer;