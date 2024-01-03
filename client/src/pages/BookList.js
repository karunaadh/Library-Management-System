import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

function BookList() {
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({ title: '', author: '', quantity: 0 });
    const [searchQuery, setSearchQuery] = useState('');
    const [id, setId] = useState('');
    const [selectedBooks, setSelectedBooks] = useState([]);

    //fetch all books
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('/bookList');
                setBooks(response.data);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        fetchBooks();
    }, []);

    //save book
    const addBook = () => {
        axios
            .post('saveBook', newBook)
            .then((response) => {
                setBooks([...books, response.data]);
                alert("Book saved!");
                // clear input fields after adding a new book
                setNewBook({ title: '', author: '', quantity: 0 });
            })
            .catch((error) => console.error('Error adding book:', error));
    };
    
    //delete book by id
    const deleteBook = (id) => {
        axios
            .delete(`deleteBook/${id}`)
            .then(() => setBooks(books.filter((book) => book._id !== id)))
            .catch((error) => console.error('Error deleting book:', error));
    };

    //update book stock
    const updateBook = (id, updatedStock) => {
        axios
            .put(`/updateBook/${id}`, { stock: updatedStock })
            .then((response) => {
                console.log('Book updated:', response.data);
                setBooks(books.map((book) => (book._id === id ? response.data : book)));
            })
            .catch((error) => console.error('Error updating book:', error));
    };

    //handle reserve selection
    const reserveSelection = async () => {
        if (selectedBooks.length === 0 || !id) {
            alert('Please select books and provide a valid user ID.');
            return;
        }
    
        try {
            // send a request to the backend to make reservations
            axios.post('/makeReservation', { userId: id, selectedBooks });

            alert('Reservations made successfully.');
    
            // reset selectedBooks after successful reservation
            setSelectedBooks([]);
            setId("");
        } catch (error) {
            alert('Error making reservations. Please try again.');
            console.error('Error making reservations:', error);
        }
    };

    //handle checkbox modification - remove or add from selected list
    const handleCheckboxChange = (bookId) => {
        setSelectedBooks((prevSelected) =>
            prevSelected.includes(bookId)
                ? prevSelected.filter((id) => id !== bookId)
                : [...prevSelected, bookId]
        );
    };

    //book search
    const filteredBooks = books.filter(
        (book) =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book._id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="list-container">
            <section className="list-header"></section>
            <h1 className = "text-left">Books</h1>
            {/* add input fields for adding a new book */}
            <h2 className = "text-left">Add a New Book</h2>
            <input
                className="input-field"
                type="text"
                placeholder="Title"
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            />
            <input
                className="input-field"
                type="text"
                placeholder="Author"
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            />
            <input
                className="input-field"
                type="number"
                placeholder="Quantity"
                onChange={(e) => setNewBook({ ...newBook, quantity: parseInt(e.target.value, 10) })}
            />
            <button className="add-button" onClick={addBook}>
                Add Book
            </button>

            {/* add input fields for making a reservation */}
            <h2 className = "text-left">Make a Reservation</h2>
            <p></p>
            <input
                className="input-field"
                type="text"
                placeholder="User Id"
                onChange={(e) => setId(e.target.value)}
            />
            <button className="reserve-button" onClick={reserveSelection}>
                Reserve Selection
            </button>

            {/* book list */}
            <h2 className = "text-left">Book List</h2>
            <input
                className="input-field"
                type="text"
                placeholder="Search for books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <table className="library-table">
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBooks.map((book) => (
                        <tr key={book._id} className="book-item">
                            <td>
                                {book.quantity > 0 ? (
                                    <input
                                        type="checkbox"
                                        checked={selectedBooks.includes(book._id)}
                                        onChange={() => handleCheckboxChange(book._id)}
                                    />
                                ) : (
                                    <p className="out-of-stock">Out of stock</p>
                                )}

                            </td>
                            <td>{book._id}</td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.quantity}</td>
                            <td>
                                <button className="delete-button" onClick={() => deleteBook(book._id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default BookList;
