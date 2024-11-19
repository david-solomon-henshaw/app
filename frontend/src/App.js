import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login';
import SignUp from './Pages/Signup';
import AdminDashboard from './Pages/AdminPages/AdminDashboard';
import Home from './Pages/AdminPages/Home';
import ManageUsers from './Pages/AdminPages/ManageUsers';
import Appointments from './Pages/AdminPages/Appointments';
import PatientDashboard from './Pages/PatientPages/PatientDashboard';
import BookAppointment from './Pages/PatientPages/BookAppointment';
import PatientAppointments from './Pages/PatientPages/PatientAppointments';
import Profile from './Pages/PatientPages/Profile';
import CaregiverDashboard from './Pages/CaregiverPages/CaregiverDashboard'; 
import CaregiverAppointments from './Pages/CaregiverPages/CaregiverAppointments'; // New page
import CaregiverProfile from './Pages/CaregiverPages/CaregiverProfile'; // New page
import ActionLogs from './Pages/AdminPages/ActionLogs';

// Protected Route Component
const ProtectedRoute = ({ isAllowed, redirectPath = '/', children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  const isAdmin = loggedInUser?.role === 'admin';
  const isPatient = loggedInUser?.role === 'patient';
  const isCaregiver = loggedInUser?.role === 'caregiver';

  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login setLoggedInUser={setLoggedInUser} />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute isAllowed={isAdmin}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} /> {/* Default view */}
          <Route path="home" element={<Home />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="logs" element={<ActionLogs />} />

        </Route>

        {/* Patient Routes */}
        <Route
          path="/patient"
          element={
            <ProtectedRoute isAllowed={isPatient}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Profile />} /> {/* Default view */}
          <Route path="profile" element={<Profile />} />
          <Route path="book-appointment" element={<BookAppointment />} />
          <Route path="appointments" element={<PatientAppointments />} />
        </Route>

        {/* Caregiver Routes */}
        <Route
          path="/caregiver"
          element={
            <ProtectedRoute isAllowed={isCaregiver}>
              <CaregiverDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<CaregiverProfile />} /> {/* Default view */}
          <Route path="profile" element={<CaregiverProfile />} />
          <Route path="appointments" element={<CaregiverAppointments />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
