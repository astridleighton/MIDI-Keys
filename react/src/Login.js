import React from 'react';
import { Redirect, Link, useHistory } from 'react-router-dom';
import axios from 'axios';

class Login extends React.Component
{
    
    constructor(props)
    {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        this.processLogin(this.state);

        // TODO: get full name from DB - use error handling
        this.props.updateFullName("Astrid"); // used for testing

        // TODO: make sure props update right away
        // redirect to home page (secure) - protected route?
    }

    processLogin = async (loginCredentials) => {

        console.log("Details: " + JSON.stringify(loginCredentials));
        try {
            const result = await axios.post(`http://localhost:3000/login`, loginCredentials);
            console.log(result);
        }
        catch (error) {
            if (error.response)
            {
                if(error.response.status === 401) {
                    alert("Invalid login credentials. Please try again.");
                } else if (error.response.status === 404) {
                    alert("Login Error (401): Resource not found.");
                } else {
                    alert("An error occurred during login. Please try again.");
                }
                console.log(error);
            } else {
                alert("An error occurred during login. Please try again.");
                console.log(error);
            }
        }
    }

    render() {
        const {username, password} = this.state;

        return (
            <div>
                <h2>Login</h2>
                <form onSubmit={this.handleSubmit}>
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
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                    type="password"
                    id="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleInputChange}
                    required
                    />
                </div>
                <span>
                <Link to="/register">New? CREATE ACCOUNT</Link>
                </span>
              <button type="submit">Login</button>
            </form>
          </div>
        )
    }
}

export default Login;