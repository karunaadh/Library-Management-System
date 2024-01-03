// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BookList from './pages/BookList';
import UserList from './pages/UserList';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Reservations from './pages/Reservations';
import Login from './pages/Login';
import axios from 'axios';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // check if the user is authenticated when the component mounts
    const checkAuth = async () => {
      try {
        const response = await fetch("/checkAuth");
        const data = await response.json();

        if (response.ok) {
          setIsLoggedIn(data.isLoggedIn);
        } else {
          console.error("Error checking authentication status");
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
      }
    };

    checkAuth();
  }, []);

  //logout
  const handleLogout = async () => {
    try {
      const response = await axios.get("/logout");
  
      if (response.status === 200) {
        const data = response.data;
        console.log(data.message);
        setIsLoggedIn(false);
        alert("Logout successful!");
      } else {
        // handle logout error, display message to the user, etc.
        alert("Logout error :(");
        console.error("Logout error:", response.statusText);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const ProtectedRoute = ({ element, ...props }) => {
    // if user is logged in, render the component, otherwise redirect to login
    return isLoggedIn ? element : <Navigate to="/" />;
  };


  return (
    <>
      <BrowserRouter>
        <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/books"
            element={<ProtectedRoute element={<BookList />} />}
          />
          <Route
            path="/users"
            element={<ProtectedRoute element={<UserList />} />}
          />
          <Route
            path="/reservations"
            element={<ProtectedRoute element={<Reservations />} />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
