import React, {useState} from 'react';
import { withRouter, Link, useNavigate, Redirect, useOutletContext, createContext } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import * as Tone from 'tone';
import { Button, Box, TextField, Typography, Container, CssBaseline, Avatar, Grid, Input } from '@mui/material';

/**
 * Allows user to log in to account
 * TODO: move login data to additional class
 */
const Login = () =>
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    /**
     * Passes login credentials to login function
     * @param {*} event 
     */
    const handleSubmit = async (event) => {

        if (event) {
            event.preventDefault();
        }
        setSubmitted(true);

        if(username && password) {
            // TODO: move to other component?
            //await processLogin({username, password});
            navigate('/');
        }
      };

    /**
     * Sends login credentials to the back-end
     * Sets sessions cookies
     * @param {*} loginCredentials 
     */
    const processLogin = async (loginCredentials) => {

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
                        sx={{ textAlign: 'center' }} >
                            Log In
                        </Typography>
                </Container>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
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
                        error={submitted && !username} // check if empty
                        helperText={submitted && !username ? 'Username is required ' : ''}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                        error={submitted && !password} // check if empty
                        helperText={submitted && !password ? 'Password is required ' : ''}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                            onClick={handleSubmit}
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

export default Login;