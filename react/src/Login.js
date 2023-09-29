import React from 'react';

class Login extends React.Component
{
<<<<<<< Updated upstream

    // TODO: add link in home page
=======
>>>>>>> Stashed changes
    
    constructor(props)
    {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }


    handleSubmit = async (e) => {
        e.preventDefault();

<<<<<<< Updated upstream
        const {username, password } = this.state;
=======
        const { username, password } = this.state;
>>>>>>> Stashed changes

        try{

            //send post request to express
        }
        catch (error)
        {

        }
    }

    render() {
        const {username, password} = this.state;

        return (
            <div>
                <h2>Login</h2>
<<<<<<< Updated upstream
            </div>
        )
    }
}
=======
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
>>>>>>> Stashed changes
