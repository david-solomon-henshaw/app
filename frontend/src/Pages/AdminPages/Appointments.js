import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tab, Tabs, Modal, Button, Alert, Dropdown } from 'react-bootstrap';
import { FaUserEdit, FaCheck, FaTimes, FaUser } from 'react-icons/fa';
import { OverlayTrigger, Popover } from 'react-bootstrap';


const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);
  const [appointmentData, setAppointmentData] = useState({});


  const actionsPopover = (appointmentId) => (
    <Popover id={`popover-${appointmentId}`}>
      <Popover.Body>
        <Button variant="link" onClick={() => handleAssignCaregiver(appointmentId)}>
          <FaCheck className="me-2" /> Approve
        </Button>
        <Button variant="link" onClick={() => handleReject(appointmentId)}>
          <FaTimes className="me-2" /> Cancel
        </Button>
      </Popover.Body>
    </Popover>
  );


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


  // Alert state
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: '',
    variant: 'success'
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log('fetch the appointments using the admin controller not appointments!!!!');
      
      try {
        const adminId = localStorage.getItem('adminId');
        const [appointmentsResponse, caregiversResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/appointments/all`
            , {
              params: { adminId }, // Send as a query parameter
            }
            
          ),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/caregivers`)
        ]);
        setAppointments(appointmentsResponse.data.appointments);
        setCaregivers(caregiversResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  // Group appointments by status
  const groupByStatus = (appointments) => {
    return appointments.reduce((acc, appointment) => {
      const { status } = appointment;
      if (!acc[status]) acc[status] = [];
      acc[status].push(appointment);
      return acc;
    }, {});
  };

  const statusGroups = groupByStatus(appointments);

  // Caregiver assignment handlers
  const handleAssignCaregiver = (appointmentId) => {
    setSelectedAppointment(appointmentId);
    setShowModal(true);
  };

  const handleCaregiverSelect = (caregiverId) => {
    const caregiver = caregivers.find(cg => cg._id === caregiverId);
    setSelectedCaregiver(caregiver);
  };

  const handleInputChange = (e, caregiverId) => {
    const { name, value } = e.target;
    setAppointmentData(prevData => ({
      ...prevData,
      [caregiverId]: {
        ...prevData[caregiverId],
        [name]: value
      }
    }));
  };

  const handleAssignToAppointment = async () => {
    if (!selectedCaregiver || !selectedAppointment) return;

    const appointmentDetails = appointmentData[selectedCaregiver._id];
    if (!appointmentDetails?.appointmentDate || !appointmentDetails?.appointmentTime) {
      setAlertInfo({
        show: true,
        message: 'Please select both date and time for the appointment',
        variant: 'danger'
      });
      return;
    }

    const storedValue = localStorage.getItem('adminId');
    console.log(storedValue)

    try {
      const response = await axios.put(`http://localhost:2000/api/admin/appointments/${selectedAppointment}`, {
        caregiverId: selectedCaregiver._id,
        appointmentDate: appointmentDetails.appointmentDate,
        startTime: appointmentDetails.appointmentTime,
        status: 'approved',
        storedValue
      });

      // Update local state
      setAppointments(prevAppointments =>
        prevAppointments.map(app =>
          app._id === selectedAppointment
            ? { ...app, caregiver: selectedCaregiver, status: 'approved' }
            : app
        )
      );

      setAlertInfo({
        show: true,
        message: `Successfully assigned ${selectedCaregiver.firstName} to the appointment`,
        variant: 'success'
      });

      handleCloseModal();

      setTimeout(() => {
        setAlertInfo(prev => ({ ...prev, show: false }));
      }, 5000);

    } catch (error) {
      setAlertInfo({
        show: true,
        message: `Failed to assign caregiver: ${error.response?.data?.message || 'Error updating appointment'}`,
        variant: 'danger'
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCaregiver(null);
    setAppointmentData({});
  };


  const handleReject = async (appointmentId) => {
    setActionLoading(true);

    const storedValue = localStorage.getItem('adminId');

    try {
      await axios.put(`http://localhost:2000/api/admin/appointments/cancle/${appointmentId}`, {
          status: 'canceled', storedValue}
       );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId ? { ...appointment, status: 'canceled' } : appointment
        )
      );
      setAlertInfo({
        show: true,
        message: 'Appointment Rejected',
        variant: 'success'
      });
    } catch (err) {

      console.log(error, 'error')
      setAlertInfo({
        show: true,
        message: 'Error rejecting appointment',
        variant: 'danger'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Styling helpers
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning bg-opacity-10 text-warning';
      case 'approved':
        return 'bg-primary bg-opacity-10 text-primary';
      case 'in-progress':
        return 'bg-info bg-opacity-10 text-info';
      case 'completed':
        return 'bg-success bg-opacity-10 text-success';
      case 'canceled':
        return 'bg-danger bg-opacity-10 text-danger';
      default:
        return '';
    }
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
      tableLayout: 'fixed',
    },
    th: {
      padding: '12px 16px',
      backgroundColor: '#f8f9fa',
      color: '#64748b',
      textAlign: 'center',
      borderBottom: '1px solid rgba(230, 232, 236, 0.8)',
      borderRight: '1px solid rgba(230, 232, 236, 0.8)',
      whiteSpace: 'nowrap', // Prevent text wrapping
      fontWeight: '600',    // Make headers more prominent
      minWidth: '140px',    // Ensure minimum width for content
    },
    td: {
      padding: '12px 16px',
      textAlign: 'center',
      borderBottom: '1px solid rgba(230, 232, 236, 0.8)',
      borderRight: '1px solid rgba(230, 232, 236, 0.8)',
      fontWeight: '500',    // Make text slightly bolder
      color: '#374151',     // Darker text color for better visibility
    },
    lastColumn: {
      borderRight: 'none',
    },
  };
  return (
    <div className="p-4">
      <h2 className="text-center h4 mb-4">All Appointments</h2>

      {alertInfo.show && (
        <Alert
          variant={alertInfo.variant}
          onClose={() => setAlertInfo(prev => ({ ...prev, show: false }))}
          dismissible
          className="position-fixed top-0 start-50 translate-middle-x mt-3"
          style={{ zIndex: 1050 }}
        >
          {alertInfo.message}
        </Alert>
      )}

      {loading && <div>Loading...</div>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <Tabs defaultActiveKey="pending" id="appointments-tabs" className="mb-3">
        {['pending', 'approved', 'in-progress', 'completed', 'canceled'].map((status) => (
          <Tab eventKey={status} title={status.charAt(0).toUpperCase() + status.slice(1)} key={status}>
            {statusGroups[status]?.length > 0 ? (
              <div className="card rounded-3" style={tableStyles.container}>
                <div className="table-responsive">
                  <table className="table table-hover mb-0" style={tableStyles.table}>
                    <thead>
                      <tr>
                        <th style={tableStyles.th}>Patient</th>
                        <th style={tableStyles.th}>Requested Date</th>
                        <th style={tableStyles.th}>Requested Time</th>
                        <th style={tableStyles.th}>Appointment Date</th>
                        <th style={tableStyles.th}>Department</th>
                        <th style={tableStyles.th}>Assigned Caregiver</th>
                        <th style={tableStyles.th}>Status</th>
                        {status === 'pending' && (
                          <th style={{ ...tableStyles.th, ...tableStyles.lastColumn }}>Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.filter(app => app.status === status).map((appointment) => (
                        <tr key={appointment._id}>
                          <td style={tableStyles.td}>{appointment.patient?.firstName} {appointment.patient?.lastName}</td>
                          <td style={tableStyles.td}>{new Date(appointment.patientRequestedDate).toLocaleDateString()}</td>
                          <td style={tableStyles.td}>{formatTime(appointment.patientRequestedTime)}</td>
                          <td style={tableStyles.td}>{appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString() : 'Not Set'}</td>
                          <td style={tableStyles.td}>{appointment.department}</td>
                          <td style={tableStyles.td}>{appointment.caregiver ? `${appointment.caregiver.firstName} ${appointment.caregiver.lastName}` : 'Not Assigned'}</td>
                          <td style={tableStyles.td}>
                            <span className={`badge ${getStatusBadge(appointment.status)}`}>
                              {appointment.status}
                            </span>
                          </td>
                          {status === 'pending' && (
                            <td style={{ ...tableStyles.td, ...tableStyles.lastColumn }}>
                              <OverlayTrigger trigger="click" placement="left" overlay={actionsPopover(appointment._id)} rootClose>
                                <Button variant="link" style={{ zIndex: 1040 }}>
                                  <FaUserEdit />
                                </Button>
                              </OverlayTrigger>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div>No appointments found.</div>
            )}
          </Tab>
        ))}
      </Tabs>
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Select a Caregiver</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Add an alert inside modal for validation errors */}
          {alertInfo.show && alertInfo.variant === 'danger' && (
            <Alert variant="danger" className="mb-3">
              {alertInfo.message}
            </Alert>
          )}

          {caregivers.filter(caregiver =>
            caregiver.available &&
            caregiver.department === appointments.find(app => app._id === selectedAppointment)?.department
          ).length > 0 ? (
            caregivers.filter(caregiver =>
              caregiver.available &&
              caregiver.department === appointments.find(app => app._id === selectedAppointment)?.department
            ).map((caregiver) => (
              <div key={caregiver._id} className="border rounded p-3 mb-3 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: '2px solid #007bff',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white'
                  }}>
                    <FaUser size={30} color="gray" />
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <strong>{caregiver.firstName} {caregiver.lastName}</strong>
                    <div>{caregiver.department}</div>
                    <div className="text-success">{caregiver.available ? 'Available' : 'Not Available'}</div>
                  </div>
                </div>

                <div className="d-flex flex-column ms-4">
                  <div className="d-flex mb-2">
                    <div className="me-2">
                      <label htmlFor="appointmentDate">Appointment Date:</label>
                      <input
                        type="date"
                        name="appointmentDate"
                        className="form-control"
                        value={appointmentData[caregiver._id]?.appointmentDate || ''}
                        onChange={(e) => handleInputChange(e, caregiver._id)}
                      />
                    </div>
                    <div>
                      <label htmlFor="appointmentTime">Appointment Time:</label>
                      <input
                        type="time"
                        name="appointmentTime"
                        className="form-control"
                        value={appointmentData[caregiver._id]?.appointmentTime || ''}
                        onChange={(e) => handleInputChange(e, caregiver._id)}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  className="ms-2"
                  onClick={() => handleCaregiverSelect(caregiver._id)}
                >
                  Select Caregiver
                </Button>
              </div>
            ))
          ) : (
            <div className="alert alert-info">No available caregivers in this department.</div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          {selectedCaregiver && (
            <Button
              variant="success"
              onClick={handleAssignToAppointment}
              disabled={
                !appointmentData[selectedCaregiver._id]?.appointmentDate ||
                !appointmentData[selectedCaregiver._id]?.appointmentTime
              }
            >
              Assign Caregiver
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Appointments;
