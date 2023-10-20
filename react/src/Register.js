import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';

class Register extends React.Component
{
    // create secure login page, create error page

    constructor(props) {
        super(props);

        this.state = {
            id: 3,
            username: '',
            password: '',
            fullname: ''
        };
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        console.log('First Name', this.state.fullname);
        console.log('Username:', this.state.username);
        console.log('Password:', this.state.password);

        //this.props.updateIsLoggedIn = true; // used for testing

        this.processRegister(this.state);

    }

    processRegister = async (registerCredentials) => {

        console.log("Details: " + JSON.stringify(registerCredentials));
        try {
            const result = await axios.post(`http://localhost:3000/register`, registerCredentials);
            console.log(result);
        }
            catch (error)
        {
            console.log(error);
        }
    }

    render()
    {
        return(
            <div>
                <h1>Create An Account</h1>
                <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="fullname">First Name:</label>
                            <input
                                type="text"
                                id="fullname"
                                name="fullname"
                                value={this.state.fullname}
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