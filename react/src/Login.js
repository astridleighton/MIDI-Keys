import React from 'react';
import { Redirect, Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

/**
 * Allows user to log in to account
 * TODO: stop synth sounds on this page
 */
class Login extends React.Component
{
    /**
     * Stores username and password
     * @param {*} props 
     */
    constructor(props)
    {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
    }

    /**
     * Changes state of username and/or password
     * @param {*} event 
     */
    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    /**
     * Passes login credentials to login function
     * TODO: redirect to Play page 
     * @param {*} event 
     */
    handleSubmit = (event) => {
        event.preventDefault();
        this.processLogin(this.state);
    }

    /**
     * Sends login credentials to the back-end
     * Sets sessions cookies
     * @param {*} loginCredentials 
     */
    processLogin = async (loginCredentials) => {

        console.log("Details: " + JSON.stringify(loginCredentials));
        try {
            const result = await axios.post(`http://localhost:3000/login`, loginCredentials);

            if (result.status === 200) {
                
                const token = result.data.token;
                const name = result.data.firstName;

                if (token && name) {
                    Cookies.set('token', token, { expires: 1 });
                    Cookies.set('name', name, {expires: 1 });
                    this.state.firstname = name;
                    alert("Login successful.");
                } else {
                    alert("Did not receive token and/or name from database. Please try again.");
                }
            } else {
                alert("An error occurred during login. Please try again!");
            }
        }
        catch (error) {
            if (error.response.status === 401) {
                alert("Invalid login credentials. Please try again.");
            } else if (error.response.status === 500) {
                alert("A server error occurred during login. Please try again!");
            } else {
                alert("An error occurred. Please try again.");
            }
        }
    }

    /**
     * Displays login form and registration link
     * @returns 
     */
    render() {
        const {username, password} = this.state;

        return (
            <div>
                <h2 class="m-4 d-flex justify-content-center">Login</h2>
                <div class="d-flex justify-content-center align-items-center h-100 m-3">
                    <form onSubmit={this.handleSubmit}>
                    <div className="form-group-row">
                        <label htmlFor="username" class="col-sm-2 col-form-label">Username</label>
                        <div class="col-sm-10">
                            <input
                            type="text"
                            id="username"
                            name="username"
                            class="form-control"
                            placeholder="Enter username"
                            value={this.state.username}
                            onChange={this.handleInputChange}
                            required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div class="col-sm-10">
                            <input
                            type="password"
                            id="password"
                            name="password"
                            class="form-control"
                            placeholder="Enter password"
                            value={this.state.password}
                            onChange={this.handleInputChange}
                            required
                            />
                        </div>
                    </div>
                    <div class="form-group-row m-2">
                        <p class="mb-0">Don't have an account? <Link to="/register" href="#!" class="text-black-50 fw-bold">Sign Up</Link></p>
                    </div>
                    <div class="text-center m-3">
                        <button type="submit" class="btn btn-primary btn-block mb-4 text-center">Login</button>
                    </div>
                </form>
            </div>
                </div>
        )
    }
}

export default Login;