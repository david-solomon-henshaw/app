import React from 'react';
import { Container } from 'react-bootstrap';
import DashboardStats from './DashboardStats';
import AppointmentAnalytics from './AppointmentAnalytics';
import CaregiverAnalytics from './CaregiverAnalytics';
import PatientAnalytics from './PatientAnalytics';

const Home = () => {
  return (
    <Container fluid className="p-4">
      {/* Top Section - Overview Statistics */}
      <section className="mb-4">
        <h4 className="mb-3">Dashboard Overview</h4>
        <DashboardStats />
      </section>

      {/* Second Section - Appointments */}
      <section className="mb-4">
        <h4 className="mb-3">Appointment Analytics</h4>
        <AppointmentAnalytics />
      </section>

      {/* Third Section - Caregivers */}
      <section className="mb-4">
        <h4 className="mb-3">Caregiver Analytics</h4>
        <CaregiverAnalytics />
      </section>

      {/* Fourth Section - Patients */}
      <section className="mb-4">
        <h4 className="mb-3">Patient Analytics</h4>
        <PatientAnalytics />
      </section>
    </Container>
  );
};

export default Home;