import axios from 'axios';
import Cookies from 'js-cookie';

type registerCredentials = {
    username: string;
    password: string;
    firstname: string;
}

type loginCredentials = {
    username: string;
    password: string;
}

type Message = {
    isSuccess: boolean;
    message: string;
}


const signIn = async (credentials: loginCredentials): Promise<Message> => {
    try {
        const result = await axios.post(`http://localhost:3000/login`, credentials);
        if (result.data && result.data.status === 200) {
            const token = result.data.token;
            const name = result.data.firstName;
            if (token && name) {
                Cookies.set('token', token, { expires: 1 });
                Cookies.set('name', name, { expires: 1 });
                return { isSuccess: true, message: "Login successful." };
            } else {
                return { isSuccess: false, message: "An error occurred during the login. Please try again." };
            }
        } else {
            return { isSuccess: false, message: "An error occurred during the login. Please try again." };
        }
    } catch (error:any) {
        if (error.response && error.response.status === 401) {
            return { isSuccess: false, message: "Invalid login credentials. Please try again." };
        } else if (error.response && error.response.status === 500) {
            return { isSuccess: false, message: "A network error occurred. Please try again." };
        } else {
            return { isSuccess: false, message: "An unknown error occurred. Please try again." };
        }
    }
};    

const signUp = async (credentials: registerCredentials): Promise<Message> => {
    try {
        await axios.post(`http://localhost:3000/register`, credentials);
        return { isSuccess: true, message: "Registration successful. Please log in with your current credentials." };
    } catch (error:any) {
        if (error.response && error.response.status === 403) {
            return { isSuccess: false, message: "Username already exists. Please choose another one." };
        } else if (error.response && error.response.status === 500) {
            return { isSuccess: false, message: "Network error. Please try again." };
        } else {
            return { isSuccess: false, message: "An unknown error occurred. Please try again." };
        }
    }
};


export { signIn, signUp };