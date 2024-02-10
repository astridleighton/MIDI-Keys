import React from 'react';
import { withRouter, Link, useNavigate, Redirect, useOutletContext, createContext } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import * as Tone from 'tone';
import { Button, Box, TextField, Typography, Container, CssBaseline, Avatar, Grid, Input } from '@mui/material';

/**
 * Allows user to log in to account
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
            loginSuccess: false,
            submitted: false
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
    handleSubmit = async (event) => {

        event.preventDefault();

        this.setState({ submitted: true });
        if(this.state.username && this.state.password) {
            await this.processLogin(this.state);
            // TODO: redirect to Play page
        }
      };

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
                    alert("Login successful. Please navigate to the Play page to start creating music.");
                } else {
                    alert("Did not receive token and/or name from database. Please try again.");
                }
            } else {
                alert("An error occurred during login. Please try again!");
            }
        }
        catch (error) {
            if (error.response && error.response.status === 401) {
                alert("Invalid login credentials. Please try again.");

                // reset login credentials
                this.setState( { username: '' });
                this.setState( { password: '' });
                this.setState( { submitted: false });
            } else if (error.response && error.response.status === 500) {
                alert("A server error occurred during login. Please try again!");
            } else {
                alert("An error occurred. No response from back-end.");
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
                    Log In
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
                    id="username"
                    label="Username"
                    name="username"
                    error={this.state.submitted && !this.state.username} // check if empty
                    helperText={this.state.submitted && !this.state.username ? 'Username is required ' : ''}
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
                    error={this.state.submitted && !this.state.password} // check if empty
                    helperText={this.state.submitted && !this.state.password ? 'Password is required ' : ''}
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
                    Log In
                </Button>
                </Container>
                    <Typography>
                        Don't have an account?
                        <a
                            href="/register"
                            style={{
                                textDecoration: 'none',
                                color: 'inherit',
                                fontWeight: 'bold',
                                padding: '5px'
                                }}>Sign Up</a>
                    </Typography>
                </Box>
                </Container>
                    
            </div>
        )
    }
}

export default Login;