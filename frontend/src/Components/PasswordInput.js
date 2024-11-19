// PasswordInput.js
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordInput = ({ label, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <div className="d-flex align-items-center">
        <Form.Control
          type={showPassword ? 'text' : 'password'}
          placeholder={`Enter ${label.toLowerCase()}`}
          value={value}
          onChange={onChange}
          required
        />
        <Button
          variant="outline-secondary"
          onClick={() => setShowPassword(!showPassword)}
          className="ml-2"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </Button>
      </div>
    </Form.Group>
  );
};

export default PasswordInput;
