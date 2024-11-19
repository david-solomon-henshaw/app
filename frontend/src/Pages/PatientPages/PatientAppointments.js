import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingModal from '../../Components/LoadingModal';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const patientId = localStorage.getItem('patientId');

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      console.log('update the local host to use process.env!!!!! important')
      try {
        const response = await axios.get(`http://localhost:2000/api/appointments/patient/${patientId}`);
        setAppointments(response.data);
        console.log(response)
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching appointments');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [patientId]);

  const getStatusClasses = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning bg-opacity-10 text-warning fw-medium';
      case 'approved':
        return 'bg-primary bg-opacity-10 text-primary fw-medium';
      case 'completed':
        return 'bg-success bg-opacity-10 text-success fw-medium';
      case 'canceled':
        return 'bg-danger bg-opacity-10 text-danger fw-medium';
      default:
        return '';
    }
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`px-2 py-1 rounded-2 ${getStatusClasses(status)}`} style={{ fontSize: '0.875rem' }}>
        {status}
      </span>
    );
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return 'Not Set';
    
    try {
      let date;
      if (timeStr.includes('T')) {
        // Handle ISO timestamp
        date = new Date(timeStr);
      } else if (timeStr.includes(':')) {
        // Handle time string (HH:mm)
        const [hours, minutes] = timeStr.split(':');
        date = new Date();
        date.setHours(parseInt(hours, 10));
        date.setMinutes(parseInt(minutes, 10));
      } else {
        return 'Invalid Time';
      }
      
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid Time';
    }
  };
  const tableStyles = {
    card: {
      border: 'none',
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      transition: 'transform 0.2s',
    },
    table: {
      fontSize: '0.875rem',
      borderCollapse: 'separate',
      borderSpacing: 0
    },
    th: {
      borderBottom: '1px solid rgba(230, 232, 236, 0.8)',
      borderRight: '1px solid rgba(230, 232, 236, 0.8)',
      backgroundColor: '#f8f9fa',
      fontWeight: '500',
      color: 'rgb(100, 116, 139)',
      padding: '12px 16px',
      textAlign: 'center' // Centering table headers
    },
    td: {
      borderBottom: '1px solid rgba(230, 232, 236, 0.8)',
      borderRight: '1px solid rgba(230, 232, 236, 0.8)',
      padding: '12px 16px',
      textAlign: 'center' // Centering table data
    },
    lastColumn: {
      borderRight: 'none'
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-center h4 mb-4">Your Appointments</h2>
      {loading && <LoadingModal />}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {appointments.length === 0 ? (
        <p className="text-muted">No appointments found.</p>
      ) : (
        <div className="card rounded-3" style={tableStyles.card}>
          <div className="table-responsive">
            <table className="table table-hover mb-0" style={tableStyles.table}>
              <thead>
                <tr>
                  <th style={tableStyles.th}>Date Requested</th>
                  <th style={tableStyles.th}>Time Requested</th>
                  <th style={tableStyles.th}>Department</th>
                  <th style={tableStyles.th}>Admin Set Date</th>
                  <th style={tableStyles.th}>Admin Set Start Time</th>
                  <th style={{...tableStyles.th, ...tableStyles.lastColumn}}>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id} className="align-middle">
                    {/* Patient requested date and time */}
                    <td style={tableStyles.td}>
                      {new Date(appointment.patientRequestedDate).toLocaleDateString()}
                    </td>
                    <td style={tableStyles.td}>
                      {formatTime(appointment.patientRequestedTime)}
                    </td>

                    {/* Department */}
                    <td style={tableStyles.td}>
                      {appointment.department}
                    </td>

                    {/* Admin set date and time, only if status is not pending */}
                    <td style={tableStyles.td}>
                      {appointment.status !== 'pending'
                        ? appointment.appointmentDate
                          ? new Date(appointment.appointmentDate).toLocaleDateString()
                          : 'Not Set'
                        : 'Pending Approval'}
                    </td>
                    <td style={tableStyles.td}>
                      {appointment.status !== 'pending'
                        ? appointment.startTime
                          ? formatTime(appointment.startTime)
                          : 'Not Set'
                        : 'Pending Approval'}
                    </td>

                    {/* Status */}
                    <td style={{...tableStyles.td, ...tableStyles.lastColumn}}>
                      {getStatusBadge(appointment.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
