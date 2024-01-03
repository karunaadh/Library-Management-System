import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../App.css";

function UserList() {
  //user list
  const [users, setUsers] = useState([]);
  //new user
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  //search
  const [searchQuery, setSearchQuery] = useState('');
  //new user name
  const [newName, setNewName] = useState(null);
  //new user email
  const [newEmail, setNewEmail] = useState(null);
  //edit mode
  const [editingUser, setEditingUser] = useState(null);


  useEffect(() => {
    //fetch all users
    const fetchUsers = async () => {
      //make get request to userList end point
      try {
        const response = await axios.get('/userList');
        setUsers(response.data);
        //catch error
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  //add new user to system
  const addUser = () => {
    //send new user to server
    axios.post('saveUser', newUser)
      .then(response => setUsers([...users, response.data]))
      .catch(error => console.error('Error adding user:', error));
  };

  //delete user by id
  const deleteUser = (id) => {
    // send delete request
    axios.delete(`deleteUser/${id}`)
      //update frontend userlist
      .then(() => setUsers(users.filter(user => user._id !== id)))
      .catch(error => console.error('Error deleting user:', error));
  };

  //update user by id
  const updateUser = (id, newName, newEmail) => {
    // make update request to the server
    axios.put(`/updateUser/${id}`, { name: newName, email: newEmail })
      .then(response => {
        // handle successful update
        console.log('User updated:', response.data);

        // update the frontend user list
        setUsers(users.map(user => (user._id === id ? response.data : user)));
      })
      .catch(error => console.error('Error updating user:', error));
  };

  // filter users based on the search query (title, author, id)
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //handle edits
  const handleSaveClick = () => {
    updateUser(editingUser, newName, newEmail);
    handleCancel();
  }

  //handle cancel edit
  const handleCancel = () => {
    setEditingUser(null);
    setNewEmail(null);
    setNewEmail(null);
  }

  return (
    <div className="list-container">
      <section className='list-header'></section>
      <h1 className = "text-left">Users</h1>
      <h2 className = "text-left">Add a New User</h2>
      <input
        className="input-field"
        type="text"
        placeholder="Name"
        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
      />
      <input
        className="input-field"
        type="text"
        placeholder="Email"
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
      />
      <button className="add-button" onClick={addUser}>
        Add User
      </button>

      <h2 className = "text-left">User List</h2>
      <input
        className="input-field"
        type="text"
        placeholder="Search for users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <table className="library-table">

        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id} className="user-item">
              <td>{user._id}</td>
              {editingUser === user._id ? (
                <>
                  <td><input
                    className="input-field"
                    type="text"
                    placeholder={user.name}
                    onChange={(e) => setNewName(e.target.value)}
                  /></td>
                  <td><input
                    className="input-field"
                    type="text"
                    placeholder={user.email}
                    onChange={(e) => setNewEmail(e.target.value)}
                  /></td>
                </>
              ) : (
                <>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                </>
              )}

              <td>
                <button className="delete-button" onClick={() => deleteUser(user._id)}>
                  Delete
                </button>
                {editingUser === user._id ? (
                  <>
                    <button
                      className="edit-button"
                      onClick={() => handleSaveClick()}
                    >
                      Save
                    </button>
                    <button className="cancel-button" onClick={() => handleCancel()}>X</button>
                  </>
                ) : (
                  <button
                    className="edit-button"
                    onClick={() => setEditingUser(user._id)}
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
