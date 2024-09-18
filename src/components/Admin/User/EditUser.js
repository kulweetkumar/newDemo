import React from "react";
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
function EditUser() {
  const handleChange = (e) => {
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card>
            <Card.Header>
              <Card.Title as="h4">Edit User</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter username" 
                    name="username" 
                    value="" 
                    onChange={handleChange} 
                    required 
                  />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Enter email" 
                    name="email" 
                    value="" 
                    onChange={handleChange} 
                    required 
                  />
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Enter password" 
                    name="password" 
                    value="" 
                    onChange={handleChange} 
                    required 
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                  Sign Up
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default EditUser;
