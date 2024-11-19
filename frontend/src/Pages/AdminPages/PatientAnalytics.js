import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import axios from 'axios';

const PatientAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/patients/analytics`);
        setAnalytics(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch patient analytics');
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div className="text-center p-5">Loading analytics...</div>;
  if (error) return <div className="text-center text-danger p-5">{error}</div>;

  const genderData = {
    labels: analytics?.genderDistribution.map(item => item._id) || [],
    datasets: [{
      data: analytics?.genderDistribution.map(item => item.count) || [],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)'
      ],
      borderWidth: 1
    }]
  };

  const ageData = {
    labels: Object.keys(analytics?.ageDistribution || {}),
    datasets: [{
      label: 'Patients by Age Group',
      data: Object.values(analytics?.ageDistribution || {}),
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  const departmentData = {
    labels: analytics?.patientsByDepartment.map(item => item._id) || [],
    datasets: [{
      label: 'Patients by Department',
      data: analytics?.patientsByDepartment.map(item => item.uniquePatients) || [],
      backgroundColor: 'rgba(153, 102, 255, 0.5)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1
    }]
  };

  return (
    <Container fluid className="mt-4">
      <Row className="g-4">
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <Card.Title>New Patients</Card.Title>
              <div className="d-flex align-items-center justify-content-center h-100">
                <div>
                  <h1 className="display-4">{analytics?.newPatients}</h1>
                  <p className="text-muted">Last 30 Days</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Gender Distribution</Card.Title>
              <div style={{ height: '300px' }}>
                <Doughnut 
                  data={genderData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right'
                      }
                    }
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Age Distribution</Card.Title>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={ageData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Number of Patients'
                        }
                      }
                    }
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Department Distribution</Card.Title>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={departmentData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Number of Patients'
                        }
                      }
                    }
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PatientAnalytics;