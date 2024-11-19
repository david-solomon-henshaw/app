import React, { useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button } from 'react-bootstrap'; // Import Bootstrap components

const SignUp = () => {
  const [alert, setAlert] = useState(null); // State for managing alert messages
  const navigate = useNavigate(); // For programmatic navigation

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      firstName: event.target.firstName.value,
      lastName: event.target.lastName.value,
      email: event.target.email.value,
      gender: event.target.gender.value,
      password: event.target.password.value,
      dateOfBirth: event.target.dob.value,
      phoneNumber: event.target.phone.value,
    };

    try {
      // Replace with your actual API URL
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/patient/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setAlert({ variant: 'success', message: 'Account created successfully!' });
        // Auto clear the form fields
        event.target.reset();
        
        // Auto navigate to the login page after a successful sign-up
        setTimeout(() => {
          navigate('/login');
        }, 2000); // Adding a delay to let the user see the success message
      } else {
        setAlert({ variant: 'danger', message: data.message || 'Something went wrong!' });
      }
    } catch (error) {
      console.log(error);
      setAlert({ variant: 'danger', message: 'Network error. Please try again later.' });
    }
  };

  return (
    <div className="container" style={{ minHeight: '100vh', overflowY: 'auto', paddingBottom: '40px' }}>
      {/* Header */}
      <header className="pt-4 position-relative">
        <div className="d-flex align-items-center" style={{ color: 'rgba(12, 150, 230, 1)', marginLeft: '20px' }}>
          <FaHeart className="me-2 fs-3" />
          <h1 className="fs-6 fw-medium m-0" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.2' }}>
            JKL Healthcare Services
          </h1>
        </div>
      </header>

      {/* Rest of the component remains the same */}
      <div className="text-center mt-3">
        <p style={{ fontSize: '24px', color: 'rgba(70, 70, 70, 1)' }}>
          Let's get started!
        </p>
        <p style={{ fontSize: '16px', color: 'rgba(180, 180, 180, 1)' }}>
          Create an account by providing these details.
        </p>
      </div>

      {/* Display Alert */}
      {alert && (
        <Alert variant={alert.variant} className="text-center">
          {alert.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: '750px', margin: '0 auto' }} className="row g-3">
        {/* Form Fields */}
        {/* First Name */}
        <div className="col-md-6 px-2">
          <label htmlFor="firstName" className="form-label">First Name</label>
          <input 
            type="text" 
            id="firstName" 
            className="form-control" 
            placeholder="Enter your first name" 
            required 
            style={{ padding: '12px', fontSize: '16px' }}
          />
        </div>

        {/* Email */}
        <div className="col-md-6 px-2">
          <label htmlFor="email" className="form-label">Email</label>
          <input 
            type="email" 
            id="email" 
            className="form-control" 
            placeholder="Enter your email address" 
            required 
            style={{ padding: '12px', fontSize: '16px' }}
          />
        </div>

        {/* Last Name */}
        <div className="col-md-6 px-2">
          <label htmlFor="lastName" className="form-label">Last Name</label>
          <input 
            type="text" 
            id="lastName" 
            className="form-control" 
            placeholder="Enter your last name" 
            required 
            style={{ padding: '12px', fontSize: '16px' }}
          />
        </div>

        {/* Gender */}
        <div className="col-md-6 px-2">
          <label htmlFor="gender" className="form-label">Gender</label>
          <select 
            id="gender" 
            className="form-select" 
            required 
            style={{ padding: '12px', fontSize: '16px' }}
          >
            <option value="" disabled selected>Select a gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Password */}
        <div className="col-md-6 px-2">
          <label htmlFor="password" className="form-label">Password</label>
          <input 
            type="password" 
            id="password" 
            className="form-control" 
            placeholder="**********" 
            required 
            style={{ padding: '12px', fontSize: '16px' }}
          />
          <p style={{ fontSize: '10px', color: 'gray', marginTop: '5px', width: '100%', lineHeight: '1.2' }}>
            Your password must be at least 8 characters long, with one number, one symbol, and no personal information like name or birthday.
          </p>
        </div>

        {/* Date of Birth */}
        <div className="col-md-6 px-2">
          <label htmlFor="dob" className="form-label">Date of Birth</label>
          <input 
            type="date" 
            id="dob" 
            className="form-control" 
            required 
            style={{ padding: '12px', fontSize: '16px' }}
          />
        </div>

        {/* Phone Number */}
        <div className="col-md-6 px-2" style={{ marginTop: '-10px' }}>
          <label htmlFor="phone" className="form-label">Phone Number</label>
          <input 
            type="tel" 
            id="phone" 
            className="form-control" 
            placeholder="Enter your phone number" 
            required 
            style={{ padding: '12px', fontSize: '16px' }}
          />
        </div>

        {/* Sign Up Button */}
        <div className="col-12 d-flex justify-content-center">
          <div style={{ padding: '0 20px' }}>
            <button 
              type="submit" 
              style={{ 
                backgroundColor: 'rgba(12, 150, 230, 1)', 
                color: 'white', 
                height: '40px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '10px',
                marginBottom: '20px',
                width: '100%',
                fontSize: '16px',
                padding: '0 12px'
              }}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Sign In Text */}
        <div className="col-12 text-center" style={{ marginTop: '-10px' }}>
          <p style={{ fontSize: '16px' }}>
            Already have an account?{' '}
            <Link 
              to="/login" 
              style={{ 
                color: 'rgba(12, 150, 230, 1)', 
                textDecoration: 'none',
                display: 'inline-block',
                marginLeft: '8px'
              }}
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
