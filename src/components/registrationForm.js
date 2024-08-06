import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './registration.css';

// Define professions and their associated technologies (as before)

const professionsAndTechnologies = {
  'Software Developer': ['JavaScript', 'Python', 'Java', 'C#', 'Ruby', 'PHP', 'TypeScript', 'HTML', 'CSS', 'SQL'],
  'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'Azure', 'Terraform', 'Jenkins', 'Ansible', 'CI/CD', 'Linux', 'Shell Scripting'],
  'Data Scientist': ['Python', 'R', 'SQL', 'Machine Learning', 'Deep Learning', 'Pandas', 'NumPy', 'TensorFlow', 'Scikit-Learn', 'Matplotlib'],
  'QA': ['Selenium', 'JMeter', 'TestNG', 'Cucumber', 'Postman', 'JIRA', 'Git', 'API Testing', 'Load Testing', 'Manual Testing'],
  'Automation Engineer': ['Selenium', 'Appium', 'Cucumber', 'Jenkins', 'Python', 'Java', 'Git', 'Continuous Integration', 'API Testing', 'Load Testing'],
};

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [profession, setProfession] = useState('');
  const [technologies, setTechnologies] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [techError, setTechError] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleRoleChange = (event) => {
    setRole(event.target.value);
    setProfession('');
    setTechnologies([]);
  };

  const handleProfessionChange = (event) => {
    const selectedProfession = event.target.value;
    setProfession(selectedProfession);
    setTechnologies([]);
  };

  const handleTechnologyChange = (event) => {
    const { value, checked } = event.target;
    setTechnologies((prevTechs) =>
      checked ? [...prevTechs, value] : prevTechs.filter((tech) => tech !== value)
    );
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;"'<>,.?~\\/-]/.test(password);

    if (password.length < minLength) return 'Password must be at least 8 characters long.';
    if (!hasUpperCase) return 'Password must contain at least one uppercase letter.';
    if (!hasLowerCase) return 'Password must contain at least one lowercase letter.';
    if (!hasNumber) return 'Password must contain at least one number.';
    if (!hasSpecialChar) return 'Password must contain at least one special character.';

    return '';
  };

  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/check-email?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const result = await response.json();
        return result.exists;
      } else {
        throw new Error('Network response was not ok.');
      }
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const passwordValidationError = validatePassword(formData.password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    } else {
      setPasswordError('');
    }

    if (technologies.length < 3) {
      setTechError('Please select at least 3 technologies.');
      return;
    } else {
      setTechError('');
    }

    // Check if email exists
    const emailExists = await checkEmailExists(formData.email);
    if (emailExists) {
      setEmailError('Email is already in use.');
      return;
    } else {
      setEmailError('');
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role,
          profession,
          technologies,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Registration Successful:', result);
        navigate('/login'); // Navigate to login page
      } else {
        console.error('Registration Failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Registration</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          {passwordError && <p className="error">{passwordError}</p>}
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          {emailError && <p className="error">{emailError}</p>}
        </div>
        <div>
          <label>Role:</label>
          <select value={role} onChange={handleRoleChange} required>
            <option value="">Select Role</option>
            <option value="interviewer">Interviewer</option>
            <option value="jobseeker">Job Seeker</option>
          </select>
        </div>
        <div>
          <label>Profession:</label>
          <select value={profession} onChange={handleProfessionChange} required>
            <option value="">Select Profession</option>
            {Object.keys(professionsAndTechnologies).map((prof) => (
              <option key={prof} value={prof}>{prof}</option>
            ))}
          </select>
        </div>
        {profession && (
          <div>
            <label>Technologies:</label>
            {professionsAndTechnologies[profession].map((tech) => (
              <div key={tech}>
                <input
                  type="checkbox"
                  id={tech}
                  value={tech}
                  checked={technologies.includes(tech)}
                  onChange={handleTechnologyChange}
                />
                <label htmlFor={tech}>{tech}</label>
              </div>
            ))}
            {techError && <p className="error">{techError}</p>}
          </div>
        )}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
