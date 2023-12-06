import React from 'react';

/**
 * Displays connected device
 */
class Footer extends React.Component
{

    render()
    {
        return(
           <div>
                <footer className="footer text-center text-lg-start bg-dark">
                    <div className="container text-center">
                        <span className="text-light">
                            {this.props.selectedDevice ? (
                                <span>Connected Device: {this.props.selectedDevice}</span>
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