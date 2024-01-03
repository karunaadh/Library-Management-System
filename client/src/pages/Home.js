import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import library from "../media/library.svg";
import books from "../media/books.svg";
import users from "../media/users.svg";
import reservations from "../media/reservations.svg";

const Home = () => {
  return (
    <div className="homepage">
      <header>
        <h1 className = "text-center">Library Manager</h1>
        <p>Your go-to corner for handling library needs!</p>
        <img src={library} alt="Library Image" className="home-img" />
      </header>

      <section className="features">
        <div className="feature">
          <img src={books} alt="Explore Books" className="feature-img" />
          <h2 className = "text-center">Explore Books</h2>
          <p>Discover a world of knowledge with our extensive collection of books.</p>
        </div>
        <div className="feature">
          <img src={users} alt="Manage Users" className="feature-img" />
          <h2 className = "text-center">Manage Users</h2>
          <p>Keep your library organized with easy user management.</p>
        </div>
        <div className="feature">
          <img src={reservations} alt="Book Reservations" className="feature-img" />
          <h2 className = "text-center">Handle Reservations</h2>
          <p>Track all of your reservations in one place!</p>
        </div>
      </section>

      <section className="cta">
        <p>Ready to dive in? Start exploring the library now!</p>
        <Link to="/books" className="btn">Explore Library</Link>
      </section>

      <footer>
        <p>&copy; 2024 Library Manager. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
