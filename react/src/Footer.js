import React from 'react';

class Footer extends React.Component
{
    /*constructor (props) {
        super(props);
    }*/

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