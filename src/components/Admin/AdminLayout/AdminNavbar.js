import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; 
import { authLogout } from '../../../redux/actions/authActions';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure ?',
      text: "Are you sure you want to log out?",
      showCancelButton: true,
      confirmButtonColor: '#000000',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out',
    });
    if (result.isConfirmed) {
      dispatch(authLogout());
      navigate('/');
      toast.dismiss();
      toast.warning('Admin logout successful!');

    }
  };
  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <div className="d-flex justify-content-center align-items-center ml-2 ml-lg-0">
          <Button
            variant="dark"
            className="d-lg-none btn-fill d-flex justify-content-center align-items-center rounded-circle p-2"
          >
            <i className="fas fa-ellipsis-v"></i>
          </Button>
          <Navbar.Brand
            href="#home"
            onClick={(e) => e.preventDefault()}
            className="mr-2"
          >
          </Navbar.Brand>
        </div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="mr-2">
          <span className="navbar-toggler-bar burger-lines"></span>
          <span className="navbar-toggler-bar burger-lines"></span>
          <span className="navbar-toggler-bar burger-lines"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="nav ms-auto" navbar>
            <Nav.Item>
              <Nav.Link
                data-toggle="dropdown"
                onClick={(e) => e.preventDefault()}
                className="m-0"
              >
                <span className="d-lg-none ml-1">Dashboard</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="m-0" onClick={handleLogout}>
                <span className="no-icon">Log out</span>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
