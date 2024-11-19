// ManageUsers.js
import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import UserCard from '../../Components/UserCard';
import { FaUserPlus, FaUserEdit, FaUserTimes } from 'react-icons/fa';
import CreateCaregiverModal from '../../Components/CreateCaregiverModal';
import CreateAdminModal from '../../Components/CreateAdminModal';

const ManageUsers = () => {
  const [showCreateCaregiverModal, setShowCreateCaregiverModal] = useState(false);
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);

  return (
    <div className="p-4">
      <h2 className="text-left mb-4 font-weight-bold">Manage Users</h2>
      <Row>
        <Col md={4}>
          <UserCard
            title="Create Caregiver"
            text="Add a new caregiver to the system."
            icon={<FaUserPlus size={40} className="text-primary mb-3" />}
            onClick={() => setShowCreateCaregiverModal(true)}
            variant="primary"
          />
        </Col>
        <Col md={4}>
          <UserCard
            title="Create Admin"
            text="Add a new admin to the system."
            icon={<FaUserPlus size={40} className="text-success mb-3" />}
            onClick={() => setShowCreateAdminModal(true)}
            variant="success"
          />
        </Col>
      </Row>

      <CreateCaregiverModal
        show={showCreateCaregiverModal}
        handleClose={() => setShowCreateCaregiverModal(false)}
      />
      <CreateAdminModal
        show={showCreateAdminModal}
        handleClose={() => setShowCreateAdminModal(false)}
      />
    </div>
  );
};


export default ManageUsers;