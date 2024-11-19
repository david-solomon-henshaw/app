import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineCalendar,
  AiOutlineSchedule,
  AiOutlineLogout,
  AiOutlineHeart,
  AiOutlineBell
} from 'react-icons/ai';
import Header from '../../Components/Header';

const PatientDashboard = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const location = useLocation();

  const navigation = [
    { name: 'Profile', path: 'profile', icon: AiOutlineUser },
    { name: 'Book Appointment', path: 'book-appointment', icon: AiOutlineCalendar },
    { name: 'Appointments', path: 'appointments', icon: AiOutlineSchedule },
  ];

  const isActivePath = (path) => location.pathname.includes(path);

  const activeColor = "rgba(12, 150, 230, 1)";
  const inactiveColor = "rgba(121, 121, 121, 1)";

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav className={`col-lg-2 bg-light sidebar border-end d-lg-flex flex-column 
          ${sidebarVisible ? 'd-block' : 'd-none'} 
          d-lg-block vh-100 position-fixed`}
        >
          {/* Top Section with Logo */}
          <div className="d-flex flex-column h-100">
          <div className="border-bottom d-flex align-items-center justify-content-center">
            <Header />
            </div>


            {/* Navigation Links - Spaced Out Vertically */}
            <div className="flex-grow-1 d-flex flex-column align-items-start ps-3">
              <ul className="nav flex-column w-100">
                {navigation.map(({ name, path, icon: Icon }) => (
                  <li className="nav-item" key={path}>
                    <Link
                      to={path}
                      className="nav-link d-flex align-items-center"
                      onClick={() => window.innerWidth < 992 && setSidebarVisible(false)}
                      style={{
                        color: isActivePath(path) ? activeColor : inactiveColor,
                        padding: '1rem 1.5rem',
                        margin: '0.5rem 0', // Add margin to create space between links
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Icon 
                        size={20} 
                        style={{ 
                          minWidth: '20px', 
                          marginRight: '12px'
                        }} 
                      />
                      <span>{name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Logout Button */}
            <div className="border-top mt-auto">
              <Link 
                to="/"
                className="nav-link d-flex align-items-center"
                style={{
                  color: inactiveColor,
                  padding: '1rem 1.5rem',
                  transition: 'all 0.3s ease'
                }}
              >
                <AiOutlineLogout 
                  size={20} 
                  style={{ 
                    minWidth: '20px',
                    marginRight: '12px'
                  }} 
                />
                <span>Logout</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className={`col-lg-10 ms-lg-auto ${sidebarVisible ? 'content-shifted' : ''}`}>
          {/* Compact Header with Notification and User Icons */}
          <header className="d-flex justify-content-end align-items-center py-2 px-4 border-bottom">
            {/* Right-aligned Icons */}
            <div className="d-flex align-items-center">
              <div className="me-3 p-2 border rounded">
                <AiOutlineBell size={20} />
              </div>
              <span className="fw-bold">Patient</span>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;
