import React, { useEffect, useState } from 'react';
import './profilePage.css'; // Import CSS file

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const fetchUserData = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch('http://127.0.0.1:5000/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        throw new Error('Failed to fetch user data.');
      }
    } catch (error) {
      setError('Failed to fetch user data. Please try again.');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      {error ? (
        <div className="error">{error}</div>
      ) : user ? (
        <div className="profile-details">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Profession:</strong> {user.profession}</p>
          <p><strong>Technologies:</strong> {user.technologies.join(', ')}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfilePage;
