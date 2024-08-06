import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/homePage';
import RegistrationForm from './components/registrationForm';
import LoginPage from './components/loginPage';
import ProfilePage from './components/profilePage';
import Navbar from './components/navbar';
import { AuthProvider } from './components/authContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
