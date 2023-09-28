import React from 'react';

class Login extends React.Component
{

    // TODO: add link in home page
    
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

        const {username, password } = this.state;

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
            </div>
        )
    }
}