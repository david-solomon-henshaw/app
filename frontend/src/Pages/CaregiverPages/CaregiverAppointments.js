import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingModal from '../../Components/LoadingModal';
import { Tab, Tabs } from 'react-bootstrap';
import { FaRegCalendarTimes, FaEdit, FaCheck, FaHourglassHalf } from 'react-icons/fa';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [endTime, setEndTime] = useState('');

  const navigate = useNavigate();
  const caregiverId = localStorage.getItem('caregiverId');

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:2000/api/caregivers/${caregiverId}/appointments`);
        setAppointments(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching appointments');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [caregiverId]);

  const formatTime = (time) => {
    if (time.includes('T')) {
      // It's an ISO string, so we need to extract just the time part.
      const date = new Date(time);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }
    // If it's already a time string (e.g., '10:27')
    const [hour, minute] = time.split(':');
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };
  
  const toggleEditMode = (appointmentId) => {
    setEditMode((prev) => (prev === appointmentId ? null : appointmentId));
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  // Function to get the current time in "HH:mm" format for the endTime
  const getCurrentTime = () => {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:2000/api/caregivers/${appointmentId}/appointment`, {
        caregiverId ,
        status: newStatus,
        endTime: newStatus === 'completed' ? getCurrentTime() : null, // Send current time as endTime if status is 'completed'
      });
      setAppointments((prevAppointments) =>
        prevAppointments.map((app) =>
          app._id === appointmentId ? { ...app, status: newStatus, endTime: newStatus === 'completed' ? getCurrentTime() : null } : app
        )
      );
      setEditMode(null);
      setEndTime(''); // Reset endTime
    } catch (err) {
      console.error(err);
      setError('Error updating appointment status');
    }
  };

  const startAppointment = (appointmentId) => {
    updateAppointmentStatus(appointmentId, 'in-progress'); // Same function as updating status to 'in-progress'
  };

  const tableStyles = {
    container: {
      marginTop: '1rem',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      borderRadius: '10px',
      overflow: 'hidden',
    },
    table: {
      fontSize: '0.875rem',
      borderCollapse: 'collapse',
      borderSpacing: 0,
      width: '100%',
    },
    th: {
      padding: '12px 16px',
      backgroundColor: '#f8f9fa',
      color: '#64748b',
      textAlign: 'center',
      borderBottom: '1px solid rgba(230, 232, 236, 0.8)',
      borderRight: '1px solid rgba(230, 232, 236, 0.8)',
    },
    td: {
      padding: '12px 16px',
      textAlign: 'center',
      borderBottom: '1px solid rgba(230, 232, 236, 0.8)',
      borderRight: '1px solid rgba(230, 232, 236, 0.8)',
    },
    lastColumn: {
      borderRight: 'none',
    },
  };

  const renderAppointmentsTable = (filteredAppointments, tabStatus) => {
    if (filteredAppointments.length === 0) {
      return (
        <div className="d-flex flex-column align-items-center text-muted">
          <FaRegCalendarTimes size={50} className="mb-3" />
          <p>No appointments found in this category.</p>
        </div>
      );
    }
  
    return (
      <div className="table-responsive" style={tableStyles.container}>
        <table className="table mb-0" style={tableStyles.table}>
          <thead>
            <tr>
              <th style={tableStyles.th}>Date Requested</th>
              <th style={tableStyles.th}>Time Requested</th>
              <th style={tableStyles.th}>Department</th>
              <th style={tableStyles.th}>Admin Set Date</th>
              <th style={{ ...tableStyles.th, ...tableStyles.lastColumn }}>
                {tabStatus === 'completed' ? 'Completed Time' : 'Admin Set Start Time'}
              </th>
              {tabStatus !== 'completed' && (
                <th style={tableStyles.th}>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment._id} className="align-middle">
                <td style={tableStyles.td}>
                  {new Date(appointment.patientRequestedDate).toLocaleDateString()}
                </td>
                <td style={tableStyles.td}>{formatTime(appointment.patientRequestedTime)}</td>
                <td style={tableStyles.td}>{appointment.department}</td>
                <td style={tableStyles.td}>
                  {appointment.appointmentDate
                    ? new Date(appointment.appointmentDate).toLocaleDateString()
                    : 'Not Set'}
                </td>
                <td style={{ ...tableStyles.td, ...tableStyles.lastColumn }}>
                  {tabStatus === 'completed'
                    ? appointment.endTime
                      ? formatTime(appointment.endTime)
                      : 'Not Set'
                    : appointment.startTime
                    ? formatTime(appointment.startTime)
                    : 'Not Set'}
                </td>
                {tabStatus !== 'completed' && (
                  <td style={tableStyles.td}>
                    {tabStatus === 'approved' && (
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => startAppointment(appointment._id)}
                      >
                        <FaHourglassHalf /> Start
                      </button>
                    )}
                    {tabStatus === 'in-progress' && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                      >
                        <FaCheck /> Completed
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  return (
    <div className="p-4">
      {error && <div className="alert alert-danger">{error}</div>}
      <Tabs defaultActiveKey="approved" id="appointments-tab" className="mb-3">
        <Tab eventKey="approved" title="Approved">
          {renderAppointmentsTable(
            appointments.filter((appointment) => appointment.status === 'approved'),
            'approved'
          )}
        </Tab>
        <Tab eventKey="in-progress" title="In Progress">
          {renderAppointmentsTable(
            appointments.filter((appointment) => appointment.status === 'in-progress'),
            'in-progress'
          )}
        </Tab>
        <Tab eventKey="completed" title="Completed">
          {renderAppointmentsTable(
            appointments.filter((appointment) => appointment.status === 'completed'),
            'completed'
          )}
        </Tab>
      </Tabs>
    </div>
  );
};

export default Appointments;
