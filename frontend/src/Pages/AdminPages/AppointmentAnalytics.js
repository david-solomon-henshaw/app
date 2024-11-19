import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Doughnut, Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AppointmentAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/appointments/analytics`);
        setAnalytics(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch appointment analytics');
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="text-center p-5">Loading analytics...</div>;
  }

  if (error) {
    return <div className="text-center text-danger p-5">{error}</div>;
  }

  const statusChartData = {
    labels: analytics?.appointmentsByStatus.map(item => item._id) || [],
    datasets: [
      {
        data: analytics?.appointmentsByStatus.map(item => item.count) || [],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const departmentChartData = {
    labels: analytics?.appointmentsByDepartment.map(item => item._id) || [],
    datasets: [
      {
        label: 'Appointments by Department',
        data: analytics?.appointmentsByDepartment.map(item => item.count) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Appointments by Department',
      },
    },
  };

  return (
    <Container fluid className="mt-4">
      <Row className="g-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="mb-4">Appointment Status Distribution</Card.Title>
              <div style={{ height: '300px' }}>
                <Doughnut 
                  data={statusChartData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="mb-4">Department Distribution</Card.Title>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={departmentChartData}
                  options={barOptions}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>Today's Appointments</Card.Title>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Caregiver</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics?.todaysAppointments.map((apt, index) => (
                      <tr key={index}>
                        <td>{`${apt.patient.firstName} ${apt.patient.lastName}`}</td>
                        <td>{`${apt.caregiver.firstName} ${apt.caregiver.lastName}`}</td>
                        <td>
                          <span className={`badge bg-${apt.status === 'pending' ? 'warning' : 'success'}`}>
                            {apt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AppointmentAnalytics;