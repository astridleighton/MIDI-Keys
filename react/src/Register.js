import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';

class Register extends React.Component
{

    constructor(props) {
        super(props);

        this.state = {
            id: 3,
            username: '',
            password: '',
            firstname: ''
        };
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        console.log('First Name', this.state.firstname);
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
            if(error.response.status === 401) {
                alert("Username already exists.");
            } else if (error.response.status === 500) {
                alert("Database error. Please try again.");
            } else {
                console.log(error);
            }
            
        }

        // TODO: redirect to home page (protected)
    }

    render()
    {
        return(
            <div>
                <h1>Create An Account</h1>
                <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="firstname">First Name:</label>
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                value={this.state.firstname}
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