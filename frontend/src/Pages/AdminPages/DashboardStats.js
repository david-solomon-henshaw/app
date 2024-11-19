import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { FaUsers, FaUserNurse, FaCalendarAlt, FaClock, FaChartLine } from 'react-icons/fa';
import axios from 'axios';

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/dashboard/stats`);
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard statistics');
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const statCards = [
    {
      title: "Total Patients",
      value: stats?.totalPatients || 0,
      icon: FaUsers,
      color: "primary"
    },
    {
      title: "Total Caregivers",
      value: stats?.totalCaregivers || 0,
      icon: FaUserNurse,
      color: "success"
    },
    {
      title: "Total Appointments",
      value: stats?.totalAppointments || 0,
      icon: FaCalendarAlt,
      color: "info"
    },
    {
      title: "Pending Appointments",
      value: stats?.pendingAppointments || 0,
      icon: FaClock,
      color: "warning"
    },
    {
      title: "Active Appointments",
      value: stats?.activeAppointments || 0,
      icon: FaChartLine,
      color: "danger"
    }
  ];

  if (loading) {
    return (
      <Container fluid>
        <Row className="g-3">
          {[...Array(5)].map((_, index) => (
            <Col key={index} xs={12} md={6} lg="auto" className="flex-grow-1">
              <Card className="h-100" style={{ opacity: 0.7 }}>
                <Card.Body className="d-flex flex-column">
                  <div className="placeholder-glow">
                    <span className="placeholder col-6"></span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    );
  }

  if (error) {
    return (
      <Card className="text-center text-danger p-3">
        <Card.Body>{error}</Card.Body>
      </Card>
    );
  }

  return (
    <Container fluid>
      <Row className="g-3">
        {statCards.map((card, index) => (
          <Col key={index} xs={12} md={6} lg="auto" className="flex-grow-1">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <card.icon className={`text-${card.color}`} size={24} />
                  <h6 className="mb-0 text-muted">{card.title}</h6>
                </div>
                <h3 className="mt-2 mb-0 text-center">{card.value.toLocaleString()}</h3>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default DashboardStats;