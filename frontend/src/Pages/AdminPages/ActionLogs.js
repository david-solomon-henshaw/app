import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingModal from '../../Components/LoadingModal';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

const ActionLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10; // Adjust the number of logs displayed per page if needed


  // Filters state
  const [userRole, setUserRole] = useState('');
  const [entity, setEntity] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();
        if (userRole) queryParams.append('userRole', userRole);
        if (entity) queryParams.append('entity', entity);
        if (status) queryParams.append('status', status);
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        const response = await axios.get(`http://localhost:2000/api/admin/action-logs?${queryParams.toString()}`);
        setLogs(response.data);
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        toast.error(errorMessage); // Display error using Toastify
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [userRole, entity, status, startDate, endDate]);

  // Improved error message logic
  const getErrorMessage = (err) => {
    if (err.response) {
      // Server responded with a status outside the range of 2xx
      switch (err.response.status) {
        case 400:
          return 'Bad Request: Invalid parameters.';
        case 401:
          return 'Unauthorized: Please log in again.';
        case 403:
          return 'Forbidden: You do not have permission to access this resource.';
        case 500:
          return 'Server Error: Something went wrong on the server.';
        default:
          return `Error: ${err.response.data?.message || 'Unexpected error occurred.'}`;
      }
    } else if (err.request) {
      // Request was made but no response was received
      return 'Network Error: Unable to reach the server. Please check your internet connection.';
    } else {
      // Something happened in setting up the request
      return `Request Error: ${err.message}`;
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
      textAlign: 'center',
    },
    td: {
      borderBottom: '1px solid rgba(230, 232, 236, 0.8)',
      borderRight: '1px solid rgba(230, 232, 236, 0.8)',
      padding: '12px 16px',
      textAlign: 'center',
    },
    lastColumn: {
      borderRight: 'none',
      textAlign: 'left',
    },
    statusSuccess: {
      color: 'green',
      fontWeight: 'bold',
    },
    statusFailed: {
      color: 'red',
      fontWeight: 'bold',
    },
    filterSection: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    filterItem: {
      margin: '0 10px',
      minWidth: '150px',
    },
    filterDropdown: {
      width: '100%',
    },
  };

  const filteredLogs = logs.filter(log => {
    // Status filter
    if (status && log.status !== status) {
      return false;
    }
  
    // Date filter logic
    const logDate = new Date(log.timestamp); // Convert timestamp to Date object
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
  
    // Check if the log falls within the selected date range
    if (start && logDate < start) {
      return false;
    }
    if (end && logDate > end) {
      return false;
    }
  
    return true;
  });

  const indexOfLastLog = currentPage * logsPerPage;
const indexOfFirstLog = indexOfLastLog - logsPerPage;
const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

  

  // Check if there are any filter mismatches
  const hasNoLogs = filteredLogs.length === 0 && !loading;

  const handleClearFilters = () => {
    setUserRole('');
    setEntity('');
    setStatus('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="p-4">
      <h2 className="text-center h4 mb-4">Action Logs</h2>

      {/* Filters Section - Modern Design with Dropdowns */}
      <div className="mb-4" style={tableStyles.filterSection}>
        <div style={tableStyles.filterItem}>
          <select
            className="form-select"
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            style={tableStyles.filterDropdown}
          >
            <option value="">Select User Role</option>
            <option value="admin">Admin</option>
            <option value="caregiver">Caregiver</option>
            <option value="patient">Patient</option>
          </select>
        </div>
        <div style={tableStyles.filterItem}>
          <select
            className="form-select"
            value={entity}
            onChange={(e) => setEntity(e.target.value)}
            style={tableStyles.filterDropdown}
          >
            <option value="">Select Entity</option>
            <option value="patient">Patient</option>
            <option value="caregiver">Caregiver</option>
            <option value="appointment">Appointment</option>
            <option value="error">Error</option>

          </select>
        </div>
        <div style={tableStyles.filterItem}>
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={tableStyles.filterDropdown}
          >
            <option value="">Select Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <div style={tableStyles.filterItem}>
          <div className="d-flex">
            <input
              type="date"
              className="form-control me-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="mb-4">
        <button onClick={handleClearFilters} className="btn btn-outline-secondary">
          Clear Filters
        </button>
      </div>

      {loading && <LoadingModal />}
      {hasNoLogs ? (
        <div className="alert alert-danger">No action logs found for the selected filters.</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="card rounded-3 mb-2" style={tableStyles.card}>
          <div className="table-responsive">
            <table className="table table-hover mb-0" style={tableStyles.table}>
              <thead>
                <tr>
                  <th style={tableStyles.th}>Action</th>
                  <th style={tableStyles.th}>Entity</th>
                  <th style={tableStyles.th}>User</th>
                  <th style={tableStyles.th}>Timestamp</th>
                  <th style={tableStyles.th}>Status</th>
                  <th style={{...tableStyles.th, ...tableStyles.lastColumn}}>Details</th>
                </tr>
              </thead>
              <tbody>
  {currentLogs.map((log, index) => (
    <tr key={index}>
                    <td style={tableStyles.td}>{log.action}</td>
                    <td style={tableStyles.td}>{log.entity}</td>
                    <td style={tableStyles.td}>{log.userRole}</td>
                    <td style={tableStyles.td}>{new Date(log.timestamp).toLocaleString()}</td>
                    <td style={tableStyles.td}>
                      <span style={log.status === 'success' ? tableStyles.statusSuccess : tableStyles.statusFailed}>
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </span>
                    </td>
                    <td style={{ ...tableStyles.td, ...tableStyles.lastColumn }}>
                   <pre>   {log.description} </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

<nav aria-label="Page navigation">
  <ul className="pagination justify-content-center">
    {Array.from({ length: Math.ceil(filteredLogs.length / logsPerPage) }, (_, index) => (
      <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
        <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
          {index + 1}
        </button>
      </li>
    ))}
  </ul>
</nav>

    </div>
  );
};

export default ActionLogs;
