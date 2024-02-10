import React from 'react';
import axios from 'axios';
import * as Tone from 'tone';
import { withRouter, Link, useNavigate, Redirect } from 'react-router-dom';
import { Button, Box, TextField, Typography, Container, CssBaseline, Avatar, Grid } from '@mui/material';


/**
 * Allows user to register for an account
 */
class Register extends React.Component
{

    constructor(props) {
        super(props);

        this.state = {
            id: 3,
            username: '',
            password: '',
            firstname: '',
            submitted: false,
            firstNameMessage: '',
            usernameMessage: '',
            passwordMessage: ''
        };
    }

    /**
     * Stops sound when on this page
     * TODO: ensure this is the proper way to do this
     */
    componentDidMount () {
        Tone.Transport.pause();
    }

    /**
     * Changes the state of the username and/or password
     * @param {*} event 
     */
    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    /**
     * Passes registration credentials to registration function
     * @param {*} event 
     */
    handleSubmit = async (event) => {

        event.preventDefault();

        // check for blanks
        const firstNameValid = this.validateFirstName();
        const usernameValid = this.validateUsername(this.state.username);
        const passwordValid = this.validatePassword(this.state.password);


        if(firstNameValid && usernameValid && passwordValid) {
            await this.processRegister(this.state);
            console.log("registered.");
            // TODO: redirect to Play page
        }

    }


    /**
     * Ensures first name is not blank
     * @returns boolean value for error message
     */
    validateFirstName() {
        if(this.state.firstname) {
            this.setState({ firstNameMessage: 'First name cannot be left blank' });
            return false;
        }

        return true;
    }

    /**
     * Ensures username is not blank
     * @param {*} username 
     * @returns boolean value for error message
     */
    validateUsername(username) {
        if(username.length === 0) {
            this.setState({ passwordMessage: 'Username cannot be left blank' });
            return false; // username is not valid
        }

        return true; // username is valid
    }

    /**
     * Checks if password meets complexity and security requirements
     * @param {*} password 
     * @returns boolean value for error message
     */
    validatePassword(password) {
        if (password.length === 0) {
            this.setState({ passwordMessage: 'Password cannot be left blank' });
            return false;
        } else if (password.length < 8) {
            this.setState({ passwordMessage: 'Password must be at least 8 characters long' });
            return false;
        } else if (!/\d/.test(password)) {
            this.setState({ passwordMessage: 'Password must contain at least one number' });
            return false;
        } else {
            this.setState({ passwordMessage: '' }); // Reset message if password is valid
            return true;
        }
    }

    /**
     * Sends registration credentials to back-end
     * TODO: redirect to login page
     * @param {*} registerCredentials 
     */
    processRegister = async (registerCredentials) => {

        console.log("Details: " + JSON.stringify(registerCredentials));
        try {
            const result = await axios.post(`http://localhost:3000/register`, registerCredentials);
            console.log(result);
            alert("Account created. Please navigate to the login page.");
        }
            catch (error)
        {
            if(error.response.status === 403) {
                alert("Username already exists. Please choose another one.");
            } else if (error.response.status === 500) {
                alert("Database error. Please try again.");
            } else {
                alert("An error occurred. No response from back-end.");
            }
            
        }
    }

    /**
     * Displays registration form
     * @returns view
     */
    render()
    {
        return(
            <div>
                <Container maxWidth="xs">
                    <Container
                        sx={{
                            mt: '50px',
                            mb: '-30px'
                        }}>
                    <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        textAlign: 'center',
                    }}
                >
                    Create An Account
                </Typography>
                    </Container>
                <Box
                    component="form"
                    onSubmit={this.handleSubmit}
                    noValidate
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        }}
                >
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="firstname"
                    label="First Name"
                    name="firstname"
                    error={this.state.firstNameMessage} // check if empty
                    helperText={this.state.firstNameMessage}
                    value={this.state.firstname}
                    onChange={this.handleInputChange}
                    autoComplete="firstname"
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    error={this.state.usernameMessage} // check if empty
                    helperText={
                        this.state.usernameMessage // Show password message if provided
                    }
                    value={this.state.username}
                    onChange={this.handleInputChange}
                    autoComplete="username"
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    error={this.state.passwordMessage} // check if empty
                    helperText={
                        this.state.passwordMessage // Show password message if provided
                    }
                    value={this.state.password}
                    onChange={this.handleInputChange}
                    autoComplete="current-password"
                />
                <Container
                    sx={{
                        margin: '20px'
                    }}>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    onClick={this.handleSubmit}
                    sx={{
                        backgroundColor: 'black',
                        color: 'white',
                        padding: '10px'
                    }}

                >
                    Register
                </Button>
                </Container>
                    <Typography>
                        Already have an account?
                        <a
                            href="/login"
                            style={{
                                textDecoration: 'none',
                                color: 'inherit',
                                fontWeight: 'bold',
                                padding: '5px'
                                }}>Log In</a>
                    </Typography>
                </Box>
                </Container>
            </div>
        )
    }
}

export default Register;