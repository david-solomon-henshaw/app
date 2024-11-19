import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Bar, Doughnut } from 'react-chartjs-2';
import axios from 'axios';

const CaregiverAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/caregivers/analytics`);
        setAnalytics(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch caregiver analytics');
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div className="text-center p-5">Loading analytics...</div>;
  if (error) return <div className="text-center text-danger p-5">{error}</div>;

  const departmentData = {
    labels: analytics?.departmentDistribution.map(item => item._id) || [],
    datasets: [{
      data: analytics?.departmentDistribution.map(item => item.count) || [],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
      ],
      borderWidth: 1
    }]
  };

  const workloadData = {
    labels: analytics?.workloadDistribution.map(item => item.caregiverName) || [],
    datasets: [{
      label: 'Active Appointments',
      data: analytics?.workloadDistribution.map(item => item.appointmentCount) || [],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };

  return (
    <Container fluid className="mt-4">
      <Row className="g-4">
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <Card.Title>Available Caregivers</Card.Title>
              <div className="d-flex align-items-center justify-content-center h-100">
                <div>
                  <h1 className="display-4">{analytics?.availableCaregivers}</h1>
                  <p className="text-muted">Currently Available</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Department Distribution</Card.Title>
              <div style={{ height: '300px' }}>
                <Doughnut 
                  data={departmentData}
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
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>Caregiver Workload Distribution</Card.Title>
              <div style={{ height: '400px' }}>
                <Bar 
                  data={workloadData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top'
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Number of Active Appointments'
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

export default CaregiverAnalytics;