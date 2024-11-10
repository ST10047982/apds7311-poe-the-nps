import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './admindashboard.css'; // Import your CSS file

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // State for storing pending users
  const [newStaff, setNewStaff] = useState({ username: '', fullName: '', password: '' }); // New staff form state
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user for actions
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages

  useEffect(() => {
    // Fetch pending users
    axios.get('https://localhost:5000/api/auth/admin/pending-users') // Assuming an API route for fetching pending users
      .then(response => {
        setUsers(response.data); // Set the users in state
      })
      .catch(err => {
        console.error('Error fetching users:', err);
      });
  }, []);

  const handleApprove = (userId) => {
    axios.post(`https://localhost:5000/api/auth/admin/approve-user/${userId}`)
      .then(() => {
        setUsers(users.filter(user => user._id !== userId)); // Remove approved user from the list
        alert('User approved!');
      })
      .catch(err => {
        console.error('Error approving user:', err);
      });
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user); // Set selected user for actions
  };

  // Function to handle staff registration
  const handleAddStaff = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message
  
    try {
      // Send POST request to the backend to register a new staff member
      const response = await axios.post('https://localhost:5000/api/auth/register/staff', {
        username: newStaff.username,    // Ensure this is captured from state
        fullName: newStaff.fullName,    // Ensure this is captured from state
        password: newStaff.password,    // Ensure this is captured from state
      });
  
      // Handle success response
      alert(response.data.message);
      setNewStaff({ username: '', fullName: '', password: '' }); // Reset the form fields
    } catch (err) {
      // Handle error response
      if (err.response) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    }
  };
  
  const handleLogout = () => {
    // Add your logout logic here
    alert('Logged out!');
    navigate('/login'); // Navigate to the login page
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h1 className="dashboard-title">Admin Dashboard</h1>

        {/* Pending Users Table */}
        <h2 className="user-title">Pending Users</h2>
        <table className="user-table">
          <thead>
            <tr>
              <th>Select</th>
              <th>Username</th>
              <th>Full Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(user => (
                <tr
                  key={user._id}
                  onClick={() => handleSelectUser(user)}
                  className={selectedUser && selectedUser._id === user._id ? 'selected' : ''}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUser && selectedUser._id === user._id}
                      readOnly
                    />
                  </td>
                  <td>{user.username}</td>
                  <td>{user.fullName}</td>
                  <td>
                    <button className="button approve" onClick={() => handleApprove(user._id)}>
                      Approve
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No pending users found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Add Staff Form */}
        <div className="add-staff-form">
          <h2>Add New Staff Member</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={newStaff.username}
              onChange={(e) => setNewStaff({ ...newStaff, username: e.target.value })}
            />
            <input
              type="text"
              placeholder="Full Name"
              value={newStaff.fullName}
              onChange={(e) => setNewStaff({ ...newStaff, fullName: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={newStaff.password}
              onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
            />
          </div>
          <button className="button staff" onClick={handleAddStaff}>
            Add Staff
          </button>
        </div>

        {/* Action Buttons */}
        <div className="button-group">
          <button className="button back" onClick={() => navigate('/welcome')}>
            Back to Welcome
          </button>
          <button className="button logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
