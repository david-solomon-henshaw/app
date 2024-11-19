import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Badge, Button, Dropdown } from 'react-bootstrap';
import { FaPhone, FaEnvelope, FaCalendarAlt, FaUserClock, FaUserAlt } from 'react-icons/fa';
import axios from 'axios';

const CaregiverProfile = () => {
  const [caregiver, setCaregiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  const caregiverId = localStorage.getItem('caregiverId');

  useEffect(() => {
    if (!caregiverId) {
      setError('Caregiver ID not found in local storage');
      setLoading(false);
      return;
    }

    const fetchCaregiverProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:2000/api/caregivers/${caregiverId}`);
        setCaregiver(response.data);
      } catch (err) {
        setError('Error fetching caregiver data');
      } finally {
        setLoading(false);
      }
    };

    fetchCaregiverProfile();
  }, [caregiverId]);

  if (loading) {
    return (
      <Container className="my-5">
        <Card className="shadow-lg rounded-4 border-0 bg-light position-relative">
          <div
            className="position-absolute top-0 start-0 w-100 h-50 bg-primary"
            style={{ opacity: 0.15, borderRadius: '0 0 50% 50%' }}
          />
          <Card.Body className="p-5">
            <Row className="align-items-center">
              {/* Profile Picture Skeleton */}
              <Col md={3} className="text-center">
                <div className="skeleton skeleton-image" />
                <div className="skeleton-badge" />
                <div className="skeleton-text" style={{ width: '80%' }} />
                <div className="skeleton-text" style={{ width: '50%' }} />
              </Col>

              {/* Contact and Other Details Skeleton */}
              <Col md={9}>
                <div className="skeleton-text" style={{ width: '60%' }} />
                <div className="skeleton-text" style={{ width: '60%' }} />
                <div className="skeleton-text" style={{ width: '60%' }} />
                <div className="skeleton-text" style={{ width: '60%' }} />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!caregiver) {
    return <div>No caregiver data available</div>;
  }

  return (
    <Container className="my-5">
      <Card className="shadow-lg rounded-4 border-0 bg-light position-relative">
        <div
          className="position-absolute top-0 start-0 w-100 h-50 bg-primary"
          style={{ opacity: 0.15, borderRadius: '0 0 50% 50%' }}
        />
        <Card.Body className="p-5">
          <Row className="align-items-center">
            {/* Profile Overview */}
            <Col md={3} className="text-center">
              {/* Profile Picture or Icon */}
              {caregiver.profilePicture ? (
                <img
                  src={caregiver.profilePicture}
                  alt={`${caregiver.firstName} ${caregiver.lastName}`}
                  className="rounded-circle border border-4 border-light"
                  width="120"
                  height="120"
                />
              ) : (
                <FaUserAlt className="rounded-circle border border-4 border-light bg-light" size={120} />
              )}

              <Badge
                pill
                bg={caregiver.available ? 'success' : 'secondary'}
                className="p-2 text-uppercase mt-3"
              >
                {caregiver.available ? 'Available' : 'Unavailable'}
              </Badge>
              <div className="mt-4">
                <h4 className="fw-bold">
                  <span>Name: </span>
                  {caregiver.firstName} {caregiver.lastName}
                </h4>
                <p className="text-muted mb-0">
                  <strong>Department:</strong> {caregiver.department}
                </p>
              </div>
            </Col>

            {/* Contact and Other Details */}
            <Col md={9}>
              <Row className="mb-3">
                <Col md={6} className="d-flex align-items-center mb-2">
                  <span><strong>Email:</strong> {caregiver.email}</span>
                  <FaEnvelope className="ms-2 text-primary" size={18} />
                </Col>
                <Col md={6} className="d-flex align-items-center mb-2">
                  <span><strong>Phone:</strong> {caregiver.phoneNumber}</span>
                  <FaPhone className="ms-2 text-primary" size={18} />
                </Col>
              </Row>
              <Row>
                <Col md={6} className="d-flex align-items-center mb-2">
                  <span><strong>Joined:</strong> {new Date(caregiver.createdAt).toLocaleDateString()}</span>
                  <FaUserClock className="ms-2 text-primary" size={18} />
                </Col>
                <Col md={6} className="d-flex align-items-center mb-2">
                  <span><strong>Last Updated:</strong> {new Date(caregiver.updatedAt).toLocaleDateString()}</span>
                  <FaCalendarAlt className="ms-2 text-primary" size={18} />
                </Col>
              </Row>
            </Col>
          </Row>
          {/* Button to toggle options */}
          <Button
            variant="outline-primary"
            className="mt-4"
            onClick={() => setShowOptions(!showOptions)}
          >
            Edit Profile
          </Button>
          
          {/* Options dropdown that appears when button is clicked */}
          {showOptions && (
            <div className="mt-3">
              <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  Profile Options
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#">Change Profile Picture (Placeholder)</Dropdown.Item>
                  <Dropdown.Item href="#">Edit Profile</Dropdown.Item>
                  <Dropdown.Item href="#">Deactivate Profile</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CaregiverProfile;
