import React from 'react';
import { withRouter, Link, useNavigate, Redirect } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import * as Tone from 'tone';

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

        //const navigate = useNavigate();

        super(props);
        this.state = {
            username: '',
            password: '',
            loginSuccess: false
        };
    }

    componentDidMount() {
        Tone.Transport.pause();
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
        if (this.loginSuccess) {

        }
    }

    /**
     * Sends login credentials to the back-end
     * Sets sessions cookies
     * TODO: redirect to home page
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
                    this.setState( { loginSuccess: true });
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

    /*redirectToPlayPage = () => {
        const navigate = useNavigate();
        navigate("/");
    }*/

    /**
     * Displays login form and registration link
     * @returns 
     */
    render() {
        const {username, password} = this.state;

        return (
            <div>
                <h2 className="m-4 d-flex justify-content-center">Login</h2>
                <div className="d-flex justify-content-center align-items-center h-100 m-3">
                    <form onSubmit={this.handleSubmit}>
                    <div className="form-group-row">
                        <label htmlFor="username" className="col-sm-2 col-form-label">Username</label>
                        <div className="col-sm-10">
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
                        <div className="col-sm-10">
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
                    <div className="form-group-row m-2">
                        <p className="mb-0">Don't have an account? <Link to="/register" href="#!" class="text-black-50 fw-bold">Sign Up</Link></p>
                    </div>
                    <div className="text-center m-3">
                        <button type="submit" className="btn btn-primary btn-block mb-4 text-center">Login</button>
                    </div>
                </form>
            </div>
                </div>
        )
    }
}

export default Login;