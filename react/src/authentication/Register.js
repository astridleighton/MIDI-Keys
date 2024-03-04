import React from 'react';
import axios from 'axios';
import * as Tone from 'tone';
import { withRouter, Link, useNavigate, Redirect } from 'react-router-dom';
import { Button, Box, TextField, Typography, Container, CssBaseline, Avatar, Grid } from '@mui/material';


/**
 * Allows user to register for an account
 */
const Register = () =>
{
    const [firstName, setFirstName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [submitted, setSubmitted] = useState("");
    const [firstNameMessage, setFirstNameMessage] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const navigate = useNavigate();

    /**
     * Passes registration credentials to registration function
     * @param {*} event 
     */
    const handleSubmit = async (event) => {

        if (event) {
            event.preventDefault();
        }

        // check for blanks
        // TODO: move to auth class?
        const firstNameValid = validateFirstName();
        const usernameValid = validateUsername(username);
        const passwordValid = validatePassword(password);

        if(firstNameValid && usernameValid && passwordValid) {
            // TODO: move to auth class?
            //await processRegister({firstName, username, password});
            navigate('/login')
            // TODO: redirect to Play page
        }

    }


    /**
     * Ensures first name is not blank
     * @returns boolean value for error message
     */
    function validateFirstName () {
        if(!firstName) {
            setFirstNameMessage('First name cannot be left blank');
            return false;
        }

        return true;
    }

    /**
     * Ensures username is not blank
     * @param {*} username 
     * @returns boolean value for error message
     */
    function validateUsername(username) {
        if(username.length === 0) {
            setUsernameMessage('Username cannot be left blank');
            return false; // username is not valid
        }

        return true; // username is valid
    }

    /**
     * Checks if password meets complexity and security requirements
     * @param {*} password 
     * @returns boolean value for error message
     */
    function validatePassword(password) {
        if (password.length === 0) {
            setPasswordMessage('Password cannot be left blank' );
            return false;
        } else if (password.length < 8) {
            setPasswordMessage('Password must be at least 8 characters long' );
            return false;
        } else if (!/\d/.test(password)) {
            setPasswordMessage('Password must contain at least one number' );
            return false;
        } else {
            setPasswordMessage(''); // Reset message if password is valid
            return true;
        }
    }

    /**
     * Sends registration credentials to back-end
     * TODO: redirect to login page
     * @param {*} registerCredentials 
     */
    const processRegister = async (registerCredentials) => {

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
                error={firstNameMessage} // check if empty
                helperText={firstNameMessage}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
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
                error={usernameMessage} // check if empty
                helperText={
                    usernameMessage
                }
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
                error={passwordMessage} // check if empty
                helperText={
                    passwordMessage // Show password message if provided
                }
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

export default Register;