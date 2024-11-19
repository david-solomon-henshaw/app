// UserCard.js
import React from 'react';
import { Card, Button } from 'react-bootstrap';

const UserCard = ({ title, text, icon, onClick, variant }) => (
  <Card className="mb-4 text-center">
    <Card.Body>
      {icon}
      <Card.Title>{title}</Card.Title>
      <Card.Text>{text}</Card.Text>
      <Button variant={variant} onClick={onClick}>
        {title.split(" ")[0]}
      </Button>
    </Card.Body>
  </Card>
);

export default UserCard;
