import React, {useState} from 'react';
import axios from 'axios';
import * as Tone from 'tone';
import { withRouter, Link, useNavigate, Redirect } from 'react-router-dom';
import { Button, Box, TextField, Typography, Container, CssBaseline, Avatar, Grid, Alert } from '@mui/material';


/**
 * Allows user to create an account
 * Future improvements: moving authentication logic to auth class
 */
const Register = () =>
{
    const [firstname, setFirstName] = useState(null);
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [submitted, setSubmitted] = useState("");
    const [firstNameMessage, setFirstNameMessage] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    /**
     * Updates first name
     * @param {*} event 
     */
    const handleFirstNameChange = (event) => {
        event.preventDefault();
        const newFirstName = event.target.value;
        setFirstName(newFirstName);
    }

    /**
     * Updates username
     * @param {*} event 
     */
    const handleUsernameChange = (event) => {
        event.preventDefault();
        const newUsername = event.target.value;
        setUsername(newUsername);
    }

    /**
     * Updates password and allows register if values are not blank
     * @param {*} event 
     */
    const handlePasswordChange = (event) => {
        event.preventDefault();
        const newPassword = event.target.value;
        setPassword(newPassword);
        setIsFormValid(firstname != null && username != null && newPassword != null);
    }
    /**
     * Passes registration credentials to registration function
     * @param {*} event 
     */
    const handleSubmit = async (event) => {

        if (event) {
            event.preventDefault();
        }

        const usernameValid = await validateUsername(username);
        const passwordValid = await validatePassword(password);

        console.log('Firstname: ' + firstname);

        if(usernameValid && passwordValid) {
            try {
                await processRegister({username, firstname, password});
            } catch (error) {
                console.log("Registration failed: ", error);
            } finally {
                setFirstName(null);
                setUsername(null);
                setPassword(null);
                setIsFormValid(false);
            }
        }
    }

    /**
     * Ensures username is not blank
     * @param {*} username 
     * @returns boolean value for error message
     */
    const validateUsername = (user) => {
        if(user.length === 0) {
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
    const validatePassword = (pass) => {
        if (pass.length < 8) {
            setPasswordMessage('Password must be at least 8 characters long' );
            return false;
        } else if (!/\d/.test(pass)) {
            setPasswordMessage('Password must contain at least one number' );
            return false;
        } else {
            setPasswordMessage(''); // Reset message if password is valid
            return true;
        }
    }

    /**
     * Sends registration credentials to back-end
     * @param {*} registerCredentials 
     */
    const processRegister = async (registerCredentials) => {

        await axios.post(`http://localhost:3000/register`, registerCredentials)
        .then((result) => {
            console.log(result);
            alert("Account created successfully. Please log in to access your account.");
            navigate('/login')
        }).catch((error) => {
            if(error.response.status === 403) {
                setError("Username already exists. Please choose another one.");
            } else if (error.response.status === 500) {
                setError("Network error. Please try again.");
            } else {
                setError("An unknown error occurred. Please try again.");
            }
        })
    }

    /**
     * Displays registration form
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
                onSubmit={handleSubmit}
                noValidate
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    }}
            >
                {error && <Alert severity="error">{error}</Alert>}
            <TextField
                margin="normal"
                required
                fullWidth
                label="First Name"
                error={firstNameMessage} // check if empty
                helperText={firstNameMessage}
                value={firstname}
                onChange={handleFirstNameChange}
                autoComplete="off"
                autoFocus
            />
            <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                value={username}
                error={usernameMessage} // check if empty
                helperText={
                    usernameMessage
                }
                onChange={handleUsernameChange}
                autoComplete="off"
            />
            <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                value={password}
                error={passwordMessage} // check if empty
                helperText={
                    passwordMessage // Show password message if provided
                }
                onChange={handlePasswordChange}
                autoComplete="off"
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
                disabled={!isFormValid}
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