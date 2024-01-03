import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

function Reservations() {
    const [reservations, setReservations] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get('/reservationList');
                setReservations(response.data);
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        };

        fetchReservations();
    }, []);

    const handleReturn = (userId, bookId) => {
        axios
            .put(`/returnBook/${userId}/${bookId}`)
            .then((response) => {
                // Handle successful return
                console.log('Book returned:', response.data);
                // Update the reservations list
                setReservations(
                    reservations.map((reservation) =>
                        reservation.userId === userId
                            ? {
                                ...reservation,
                                reservations: reservation.reservations.filter(
                                    (book) => book.bookId !== bookId
                                ),
                            }
                            : reservation
                    )
                );
            })
            .catch((error) => console.error('Error returning book:', error));
    };

    //search
    const filteredReservations = reservations.filter(
        (reservation) =>
          reservation.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (reservation.reservations[0] && reservation.reservations[0].bookId.toLowerCase().includes(searchQuery.toLowerCase()))
      );

    return (
        <div className="list-container">
            <h1>Reservation List</h1>
            <input
                className="input-field"
                type="text"
                placeholder="Search for reservations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <table className="library-table">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Book ID</th>
                        <th>Date of Reservation</th>
                        <th>Due Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredReservations
                        .filter((reservation) => reservation.reservations && reservation.reservations.length > 0)
                        .map((reservation) => (
                            <tr key={`${reservation.userId}-${reservation._id}`} className="user-item">
                                <td>{reservation.userId}</td>
                                <td>{reservation.reservations[0].bookId}</td>
                                <td>{new Date(reservation.reservations[0].dateOfReservation).toLocaleDateString()}</td>
                                <td>{new Date(reservation.reservations[0].dueDate).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className="return-button"
                                        onClick={() => handleReturn(reservation.userId, reservation.reservations[0].bookId)}
                                    >
                                        Return
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default Reservations;
