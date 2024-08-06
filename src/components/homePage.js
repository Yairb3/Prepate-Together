import React from 'react';
import { Link } from 'react-router-dom';
import './homePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Prepare Together</h1>
      <p className="intro-text">
        Prepare Together is an app designed to connect job seekers with volunteer mentors in the industry. After creating a profile, each job seeker is matched with a volunteer mentor based on profile compatibility.
      </p>
      
    </div>
  );
};

export default HomePage;
