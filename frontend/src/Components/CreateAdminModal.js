// CreateAdminModal.js
import React, { useState } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const CreateAdminModal = ({ show, handleClose }) => {
  const [adminData, setAdminData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: '', // 'success' or 'danger'
  });

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    const storedValue = localStorage.getItem('adminId');


    if (adminData.password !== adminData.confirmPassword) {
      return setAlert({
        show: true,
        message: 'Passwords do not match',
        type: 'danger',
      });
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/register`, {
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        email: adminData.email,
        password: adminData.password,
        storedValue
      });

      setAdminData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setAlert({
        show: true,
        message: 'Admin created successfully!',
        type: 'success',
      });
      setTimeout(handleClose, 2000); // Close modal after 2 seconds
    } catch (error) {
      setAlert({
        show: true,
        message: 'Error creating admin. Please try again.',
        type: 'danger',
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create Admin</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alert.show && (
          <Alert variant={alert.type} onClose={() => setAlert({ ...alert, show: false })} dismissible>
            {alert.message}
          </Alert>
        )}
        <Form onSubmit={handleCreateAdmin}>
          <Form.Group controlId="formFirstName" className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              value={adminData.firstName}
              onChange={(e) => setAdminData({ ...adminData, firstName: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group controlId="formLastName" className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              value={adminData.lastName}
              onChange={(e) => setAdminData({ ...adminData, lastName: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={adminData.email}
              onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={adminData.password}
              onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group controlId="formConfirmPassword" className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={adminData.confirmPassword}
              onChange={(e) => setAdminData({ ...adminData, confirmPassword: e.target.value })}
              required
            />
          </Form.Group>
          <Button variant="success" type="submit" className="mt-3">
            Create Admin
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateAdminModal;