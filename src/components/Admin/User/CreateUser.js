import React, { useState } from "react";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addUser } from "../../../redux/actions/authActions";

const CreateUser = () => {
  const [fileName, setFileName] = useState(null); // State for file name
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    image: null,
    password: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
    image: Yup.mixed().required("Image is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("password", values.password);
    formData.append("image", values.image);

    try {
      const response = await dispatch(addUser(formData));
      if (response.code === 200) {
        toast.dismiss();
        toast.success('User added successfully');
        navigate('/admin/user');
      } else {
        toast.error(response.message || 'Login failed.');
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setSubmitting(false);
    }
  };

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
            <Card.Header>
              <Card.Title as="h4">Add User</Card.Title>
            </Card.Header>
            <Card.Body>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ handleSubmit, handleChange, setFieldValue, values, errors, touched }) => (
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md="6">
                        <Form.Group controlId="formName">
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Name"
                            name="name"
                            onChange={handleChange}
                            isInvalid={touched.name && !!errors.name}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md="6">
                        <Form.Group controlId="formEmail">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            onChange={handleChange}
                            isInvalid={touched.email && !!errors.email}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <Form.Group controlId="formPhone">
                          <Form.Label>Phone</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Enter Phone"
                            name="phone"
                            onChange={handleChange}
                            isInvalid={touched.phone && !!errors.phone}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.phone}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md="6">
                        <Form.Group controlId="formImage">
                          <Form.Label>Image</Form.Label>
                          <Form.Control
                            type="file"
                            name="image"
                            onChange={(event) => {
                              const file = event.currentTarget.files[0];
                              setFieldValue("image", file);
                              setFileName(file ? file.name : null); // Update the file name state
                              setImagePreview(file ? URL.createObjectURL(file) : null); // Create image preview URL
                            }}
                            isInvalid={touched.image && !!errors.image}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.image}
                          </Form.Control.Feedback>
                         
                          {imagePreview && (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="mt-2"
                              style={{ maxWidth: "100%", height: "auto" }}
                            />
                          )}
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <Form.Group controlId="formPassword">
                          <Form.Label>Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Enter password"
                            name="password"
                            onChange={handleChange}
                            isInvalid={touched.password && !!errors.password}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.password}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Button variant="primary" type="submit" className="mt-3">
                      Submit
                    </Button>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateUser;
