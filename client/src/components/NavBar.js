import '../styles/NavBar.css';
import { NavLink } from 'react-router-dom';
import logo from "../media/logo.png"
import React from "react";

const NavBar = ({ isLoggedIn, onLogout }) => {
    const [showNavbar, setShowNavbar] = React.useState(false);

    const handleShowNavbar = () => {
        setShowNavbar(!showNavbar);
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="logo">
                    <NavLink to="/">
                        <img src={logo} className="logo-img" alt="Logo" />
                    </NavLink>
                </div>
                <div className="menu-icon" onClick={handleShowNavbar}>
                    <Hamburger />
                </div>
                <div className={`nav-elements ${showNavbar && 'active'}`}>
                    <ul>
                        {isLoggedIn ? (
                            <>
                                <li>
                                    <NavLink to="/books">Books</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/users">Users</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/reservations">Reservations</NavLink>
                                </li>
                                <li>
                                    <button onClick={onLogout}>Logout</button>
                                </li>
                            </>
                        ) : (
                            <li>
                                <NavLink to="/login">Login</NavLink>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

//hamburger svg
const Hamburger = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="52"
        height="24"
        viewBox="0 0 52 24"
    >
        <g id="Group_9" data-name="Group 9" transform="translate(-294 -47)">
            <rect
                id="Rectangle_3"
                data-name="Rectangle 3"
                width="42"
                height="4"
                rx="2"
                transform="translate(304 47)"
                fill="#574c4c"
            />
            <rect
                id="Rectangle_5"
                data-name="Rectangle 5"
                width="42"
                height="4"
                rx="2"
                transform="translate(304 67)"
                fill="#574c4c"
            />
            <rect
                id="Rectangle_4"
                data-name="Rectangle 4"
                width="52"
                height="4"
                rx="2"
                transform="translate(294 57)"
                fill="#574c4c"
            />
        </g>
    </svg>
);


export default NavBar;