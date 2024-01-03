# Library-Management-System
Library management system created with MERN stack - designed to manage the inventory and reservations of a library. It provides features for adding, updating, and deleting books, making reservations, and handling returns.
[Demo video](https://drive.google.com/file/d/1TZRlic8MHUXC1YJk_2Tx0pqxXCIL1cUN/view?usp=sharing).

## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
  - [Server](#server)
  - [Client](#client)
- [Usage](#usage)
- [Endpoints](#endpoints)

## Features

- Add new books with title, author, and quantity information.
- Add new users by name and email.
- Make reservations for books.
- View and manage reservations.
- View, manage and delete books from list.
- View, edit, delete and manage user information from list.
- Return books and automatically update inventory accordingly.
- Admin login.

## Getting Started
Set environmental variables for the MongoDB Uri and Session secret (used in index.js).

### Server
1. Install server dependencies:
   ```bash
   npm install
2. Navigate to the server directory:
   ```bash
   cd server
3. Start the server:
    ```bash
   npm start

## Usage

- Access the web application at [http://localhost:3000](http://localhost:3000).

## Endpoints

- `/bookList`: Get the list of all books.
- `/saveBook`: Add a new book to the inventory.
- `/deleteBook/:bookId`: Delete a book by ID.
- - `/userList`: Get the list of all users.
- `/saveUser`: Add a new user to the list.
- `/updateUser/:id`: Update user details (name, email) by id.
- `deleteUser/:id`: Delete user by id.
- `/reservationList`: Get the list of all reservations.
- `/makeReservation`: Make reservations for selected books and user id.
- `/returnBook/:userId/:bookId`: Return a book and update inventory.
- `/login`: Authenticate user login details.
- `/checkAuth`: Verify whether user is currently logged in.


