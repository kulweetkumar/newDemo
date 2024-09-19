import React from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

function ViewUser() {
  const location = useLocation();
  const user = location.state;

  if (!user) {
    return <div>No user data available.</div>;
  }

  return (
    <Container fluid>
      <Link className="nav mb-3" to="/admin/user">
      <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#000000",
            color: "white",
            marginRight: "8px",
          }}
        >
          <i className="fas fa-arrow-left"></i>
        </div>
      </Link>
      <Row className="justify-content-center">
        <Col md="8">
          <Card className="shadow-sm">
            <Card.Header className="text-white">
              <Card.Title as="h4">User Details</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-3">
                <img
                  src={user.image}
                  alt={user.name}
                  style={{ width: '150px', height: '150px', borderRadius: '50%', border: '2px solid #007bff' }}
                />
              </div>
              <h5 className="mb-3">{user.name}</h5>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Status:</strong> {user.status === 1 ? 'Active' : 'Inactive'}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ViewUser;
