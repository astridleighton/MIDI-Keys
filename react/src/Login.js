import React from 'react';
import { Redirect, Link } from 'react-router-dom';

class Login extends React.Component
{

    // TODO: send credentials to database, create POST method
    // create secure login page, create error page
    // pass props to here
    
    constructor(props) {
        super(props);

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

        console.log('Username:', this.state.username);
        console.log('Password:', this.state.password);

        this.props.updateFullName("Astrid"); // used for testing

        // TODO: check login credentials in back-end -- used for testing
        if(this.state.username == "t" && this.state.password)
        {
            this.props.updateIsLoggedIn(true);
        }
        else
        {
            this.props.updateIsLoggedIn(false);
        }

        // TODO: make sure props update right away
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
              <button type="submit">Login</button>
            </form>
          </div>
        )
    }
}

export default Login;