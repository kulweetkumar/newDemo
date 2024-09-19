import React, { useEffect, useState } from "react";
import { Button, Card, Table, Container, Row, Col } from "react-bootstrap";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { getUser } from "../../../redux/actions/authActions"; // Ensure this action supports pagination
import { useDispatch } from "react-redux";

function UserList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10; // Number of users per page


  const handleView = (userData) => {
    navigate(`/admin/user/view/${userData.id}`, { state: userData });
  };
  const handleEdit = (id) => {
    navigate(`/admin/user/edit/${id}`);
  };

  const handleDelete = async (id) => {
    toast.success(`User with ID ${id} deleted`);
  };
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Error updating user status.');
    }
  };

  const fetchUsers = async (page) => {
    setLoading(true);
    try {
      console.log(page,pageSize,'==========================================');
      const response = await dispatch(getUser({ page, pageSize }));
      console.log(response);
      setUsers(response.data); 
      setTotalPages(response.totalPages);
      toast.dismiss();
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [dispatch, currentPage]);

  console.log(users,'usersusersusersusersusersusers');
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card className="strpied-tabled-with-hover">
            <Card.Header>
              <Card.Title as="h4">User List</Card.Title>
              <Link className="nav ms-auto" to="/admin/user/add">Add User</Link>
            </Card.Header>
            <Card.Body className="table-full-width table-responsive px-0">
              <Table className="table-hover table-striped">
                <thead>
                  <tr>
                    <th className="border-0">ID</th>
                    <th className="border-0">Name</th>
                    <th className="border-0">Email</th>
                    <th className="border-0">Phone</th>
                    <th className="border-0">Image</th>
                    <th className="border-0">Status</th>
                    <th className="border-0">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id}>
                      <td>{(currentPage - 1) * pageSize + index + 1}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <img src={user.image} alt={user.name} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                      </td>
                      <td>
                        <Button
                          variant={user.status === 1 ? 'success' : 'warning'}
                          size="sm"
                          onClick={() => handleToggleStatus(user.id, user.status)}
                        >
                          {user.status === 1 ? 'Deactivate' : 'Activate'}
                        </Button>
                      </td>
                      <td>
                        <Button variant="primary" size="sm" className="me-2" onClick={() => handleView(user)}>
                          <FaEye />
                        </Button>
                        <Button variant="primary" size="sm" className="me-2" onClick={() => handleEdit(user.id)}>
                          <FaEdit />
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
            <Card.Footer>
              <div className="d-flex justify-content-between">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>
                <span>Page {currentPage} of {totalPages}</span>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default UserList;
