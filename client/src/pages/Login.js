// src/AdminLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/Login.css";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    //handle login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/login', { username, password });
            console.log(response.data);

            alert("Success!");
            setUsername("");
            setPassword("");
            window.location.reload();
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div className="login-contents">
            <div className="admin-login-container">
                <h2 className="login-h2">Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <label>
                        Username:
                        <input className="login-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </label>
                    <label>
                        Password:
                        <input className="login-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    <button className="login-button" type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
