import React, { useState, useEffect } from 'react';
import { FaHeart, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Components/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ setLoggedInUser }) => {
  useEffect(() => {
    localStorage.clear();
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Invalid email format');
      return false;
    }
    return true;
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const loginResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        email,
        password
      });

      if (loginResponse.data.message === 'OTP sent to email') {
        setShowOtpInput(true);
        toast.success('OTP has been sent to your email');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const verifyResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/verify-otp`, {
        email,
        otp
      });

      if (verifyResponse.data.token) {
        const base64Url = verifyResponse.data.token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));

        localStorage.setItem('token', verifyResponse.data.token);

        if (payload.role === 'admin') {
          localStorage.setItem('adminId', payload.id);
        } else if (payload.role === 'patient') {
          localStorage.setItem('patientId', payload.id);
        } else if (payload.role === 'caregiver') {
          localStorage.setItem('caregiverId', payload.id);
        }

        setLoggedInUser({
          role: payload.role,
          id: payload._id
        });

        navigate(`/${payload.role}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const fullWidthStyle = {
    width: '110%',
    marginLeft: '-5%'
  };

  return (
    <div className="container">
      <Header />
      <div style={{ marginTop: '55px' }}>
        <p className="text-center fw-bold" style={{ fontSize: '20px', color: 'rgba(70, 70, 70, 1)' }}>
          Already have an account?
        </p>
        <p className="text-center" style={{ fontSize: '18px', color: 'rgba(180, 180, 180, 1)' }}>
          Welcome back!
        </p>

        <form style={{ maxWidth: '440px', margin: '20px auto' }} onSubmit={showOtpInput ? handleOtpVerification : handleLogin}>
          {!showOtpInput ? (
            <>
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email address"
                style={{
                  ...fullWidthStyle,
                  height: '45px',
                  color: 'rgba(180, 180, 180, 1)'
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label htmlFor="password" className="form-label mt-3">Password</label>
              <div className="position-relative" style={fullWidthStyle}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="form-control"
                  placeholder="**********"
                  style={{
                    height: '45px',
                    color: 'rgba(180, 180, 180, 1)',
                    paddingRight: '40px',
                    width: '100%'
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    background: 'none',
                    color: 'rgba(180, 180, 180, 1)',
                    cursor: 'pointer',
                    padding: '0'
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="d-flex justify-content-between mt-3">
                <div>
                  <input type="checkbox" id="rememberMe" />
                  <label htmlFor="rememberMe" className="ms-2">Remember me</label>
                </div>
                <Link to="/forgot-password" style={{ color: 'rgba(12, 150, 230, 1)', textDecoration: 'none' }}>
                  Forgot Password?
                </Link>
              </div>
            </>
          ) : (
            <div className="mb-3">
              <label htmlFor="otp" className="form-label">Enter OTP</label>
              <input
                type="text"
                id="otp"
                className="form-control"
                placeholder="Enter OTP sent to your email"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                style={{
                  ...fullWidthStyle,
                  height: '45px'
                }}
              />
            </div>
          )}

          <button
            type="submit"
            className="mt-4 btn btn-primary w-100"
            style={{ height: '45px' }}
            disabled={loading}
          >
            {loading ? 'Please wait...' : (showOtpInput ? 'Verify OTP' : 'Login')}
          </button>


          <p className="text-center mt-3">
            Don't have an account? <Link to="/sign-up" style={{ color: 'rgba(12, 150, 230, 1)', textDecoration: 'none' }}>Sign Up</Link>
          </p>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </div>
  );
};

export default Login;
