import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import banner from "../../assets/banner.jpg";

const PatientProfile = () => {
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [uniqueCaregiversCount, setUniqueCaregiversCount] = useState(0);
  const [completedMedicationsCount, setCompletedMedicationsCount] = useState(0);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // Get the patient ID from local storage
        const patientId = localStorage.getItem('patientId');
        if (!patientId) {
          // Handle case where patientId is not available
          return;
        }

        const response = await axios.get(`http://localhost:2000/api/patient/${patientId}`);
        
        // Destructure the response to get profile and statistics
        const { profile, statistics } = response.data;

        // Extract data from the statistics and profile
        setAppointmentsCount(statistics.totalAppointments);
        setUniqueCaregiversCount(statistics.totalCaregivers);
        setCompletedMedicationsCount(statistics.totalMedicationsPrescribed);

        // You can also use `profile` if you need to display more patient info

      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientData();
  }, []);

  return (
    <div style={{ backgroundColor: 'rgba(12, 150, 230, 1)', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '48%', padding: '20px' }}>
          <h3 style={{ textTransform: 'uppercase', color: 'white' }}>Need a care giver?</h3>
          <p style={{ color: 'white', marginBottom: '20px' }}>
            Reach out to us directly or book an
            <br />
            <span style={{ wordBreak: 'break-word' }}> appointment</span>
          </p>
          <Link to="/patient/book-appointment">
            <button style={{
              backgroundColor: 'white',
              color: 'rgba(12, 150, 230, 1)',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
            }}>
              Book an Appointment
            </button>
          </Link>
        </div>
        <div style={{ width: '48%', padding: '20px' }}>
          <img src={banner} alt="Banner" style={{
            width: '100%',
            height: '200px',
            objectFit: 'contain',
          }} />
        </div>
      </div>

      {/* Statistics Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center',
          flex: '1',
          margin: '0 10px'
        }}>
          <h2 style={{ color: 'rgba(12, 150, 230, 1)', fontSize: '2em', margin: 0 }}>{appointmentsCount}</h2>
          <p style={{ marginTop: '10px', color: 'rgba(12, 150, 230, 1)', fontWeight: 'bold' }}>Appointments Booked</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center',
          flex: '1',
          margin: '0 10px'
        }}>
          <h2 style={{ color: 'rgba(12, 150, 230, 1)', fontSize: '2em', margin: 0 }}>{uniqueCaregiversCount}</h2>
          <p style={{ marginTop: '10px', color: 'rgba(12, 150, 230, 1)', fontWeight: 'bold' }}>Total Care Givers</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center',
          flex: '1',
          margin: '0 10px'
        }}>
          <h2 style={{ color: 'rgba(12, 150, 230, 1)', fontSize: '2em', margin: 0 }}>{completedMedicationsCount}</h2>
          <p style={{ marginTop: '10px', color: 'rgba(12, 150, 230, 1)', fontWeight: 'bold' }}>Total Medications Prescribed</p>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
