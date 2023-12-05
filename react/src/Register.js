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
            if(error.response.status === 403) {
                alert("Username already exists. Please choose another one.");
            } else if (error.response.status === 500) {
                alert("Database error. Please try again.");
            } else {
                alert("An error occurred. Please try again.");
            }
            
        }

        // TODO: redirect to login page (protected)
    }

    render()
    {
        return(
            <div>
                <h2 class="m-4 d-flex justify-content-center">Create An Account</h2>
                <div className="d-flex justify-content-center align-items-center h-100 m-3">
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group-row">
                        <label htmlFor="firstname" className="col-sm-5 col-form-label">First Name:</label>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                class="form-control"
                                placeholder="Enter first name"
                                value={this.state.firstname}
                                onChange={this.handleInputChange}
                                required
                                />
                        </div>
                        </div>
                        <div className="form-group-row">
                            <label className="col-sm-2 col-form-label" htmlFor="username">Username:</label>
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
                        <div className="form-group-row">
                            <label className="col-sm-2 col-form-label" for="password">Password:</label>
                            <div className="col-sm-10">  
                            <input
                                type="password"
                                id="password"
                                name="password"
                                class="form-control"
                                placeholder="Enter password"
                                value={this.state.password}
                                onChange={this.handleInputChange}
                                />
                            </div>
                        </div>
                        <div class="text-center m-3">
                            <input type="submit" value="Register" className="btn btn-primary btn-block mb-4 text-center"/>
                        </div>
                </form>
                </div>
            </div>
        )
    }
}

export default Register;