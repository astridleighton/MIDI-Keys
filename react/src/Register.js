import React from 'react';
import { Redirect, Link } from 'react-router-dom';

class Register extends React.Component
{

    // TODO: send credentials to database, create POST method
    // create secure login page, create error page

    constructor(props) {
        super(props);

        this.state = {
            fullName: '',
            username: '',
            password: '',
            loggedIn: false
        };
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        console.log('Full Name', this.state.fullName);
        console.log('Username:', this.state.username);
        console.log('Password:', this.state.password);

        this.props.updateIsLoggedIn = true; // used for testing

    }
    render()
    {
        return(
            <div>
                <h1>Create An Account</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                            <label htmlFor="fullName">Full Name:</label>
                            <input
                                type="text"
                                id="fullname"
                                name="fullname"
                                value={this.state.fullName}
                                onChange={this.handleInputChange}
                                required
                                />
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={this.state.username}
                                onChange={this.handleInputChange}
                                required
                                />
                        </div>
                        <div>
                            <label for="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={this.state.password}
                                onChange={this.handleInputChange}
                                />
                        </div>
                    <input type="submit" value="Register"/>
                </form>
            </div>
        )
    }
}

export default Register;