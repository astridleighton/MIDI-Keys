import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Button, Box, TextField, Typography, Container, Alert } from '@mui/material';

/**
 * Allows user to log in to account
 * Future implementation: move authentication logic to new file
 */
const Login = () =>
{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
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
     * Updates password and allows login if values are not blank
     */
    const handlePasswordChange = (event) => {
        event.preventDefault();
        const newPassword = event.target.value;
        setPassword(newPassword);
        setIsFormValid(username !== '' && newPassword !== null);
    }

    /**
     * Passes login credentials to login function
     * @param {*} event 
     */
    const handleSubmit = async (event) => {

        if (event) {
            event.preventDefault();
        }
        setSubmitted(true);

        try {
            await processLogin({username, password});
        } catch (error) {
            console.log("Login failed:", error);
        } finally {
            setUsername('');
            setPassword('');
            setIsFormValid(false);
        }
    };

    /**
     * Sends login credentials to the back-end
     * Sets sessions cookies
     * @param {*} loginCredentials 
     */
    const processLogin = async (loginCredentials) => {

        await axios.post(`http://localhost:3000/login`, loginCredentials)
        .then((result) => {
            if (result.status === 200) {
                const token = result.data.token;
                const name = result.data.firstName;
                if (token && name) {
                    Cookies.set('token', token, { expires: 1 });
                    Cookies.set('name', name, {expires: 1 });
                    setFirstName(name);
                    navigate('/')
                } else {
                    setError("An error occurred. Please try again.")
                }
            } else {
                setError("An error occurred during login. Please try again!");
            }
        }).catch((error) => {
            if (error.response && error.response.status === 401) {
                setError("Invalid login credentials. Please try again.")
                setUsername(null);
                setPassword(null);
                setSubmitted(false);
            } else if (error.response && error.response.status === 500) {
                setError("A network error occurred. Please try again.");
            } else {
                setError("An unknown error occurred. Please try again.")
            }
        })
    }

    // returns login view
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
                    {error && <Alert severity="error">{error}</Alert> }
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Username"
                        value={username}
                        error={submitted && !username} // check if empty
                        helperText={submitted && !username ? 'Username is required ' : ''}
                        onChange={handleUsernameChange}
                        autoFocus
                        autoComplete='off'
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        error={submitted && !password} // check if empty
                        helperText={submitted && !password ? 'Password is required ' : ''}
                        onChange={handlePasswordChange}
                        autoComplete='off'
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
                            disabled = {!isFormValid}
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