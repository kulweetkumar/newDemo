import React from "react";
import { Button, Card, Table, Container, Row, Col } from "react-bootstrap";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

function UserList() {
  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card className="strpied-tabled-with-hover">
            <Card.Header>
              <Card.Title as="h4">User List</Card.Title>
            </Card.Header>
            <Card.Body className="table-full-width table-responsive px-0">
              <Table className="table-hover table-striped">
                <thead>
                  <tr>
                    <th className="border-0">ID</th>
                    <th className="border-0">Name</th>
                    <th className="border-0">Salary</th>
                    <th className="border-0">Country</th>
                    <th className="border-0">City</th>
                    <th className="border-0">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Dakota Rice</td>
                    <td>$36,738</td>
                    <td>Niger</td>
                    <td>xcfdgfdg</td>
                    <td>
                      <Button variant="primary" size="sm" className="me-2">
                        <FaEye />
                      </Button>
                      <Button variant="primary" size="sm" className="me-2">
                        <FaEdit />
                      </Button>
                      <Button variant="primary" size="sm">
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Minerva Hooper</td>
                    <td>$23,789</td>
                    <td>Curaçao</td>
                    <td>Sinaai-Waas</td>
                    <td>
                      <Button variant="primary" size="sm" className="me-2">
                        <FaEye />
                      </Button>
                      <Button variant="primary" size="sm" className="me-2">
                        <FaEdit />
                      </Button>
                      <Button variant="primary" size="sm">
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Sage Rodriguez</td>
                    <td>$56,142</td>
                    <td>Netherlands</td>
                    <td>Baileux</td>
                    <td>
                      <Button variant="primary" size="sm" className="me-2">
                        <FaEye />
                      </Button>
                      <Button variant="primary" size="sm" className="me-2">
                        <FaEdit />
                      </Button>
                      <Button variant="primary" size="sm">
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>Philip Chaney</td>
                    <td>$38,735</td>
                    <td>Korea, South</td>
                    <td>Overland Park</td>
                    <td>
                      <Button variant="primary" size="sm" className="me-2">
                        <FaEye />
                      </Button>
                      <Button variant="primary" size="sm" className="me-2">
                        <FaEdit />
                      </Button>
                      <Button variant="primary" size="sm">
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>Doris Greene</td>
                    <td>$63,542</td>
                    <td>Malawi</td>
                    <td>Feldkirchen in Kärnten</td>
                    <td>
                      <Button variant="primary" size="sm" className="me-2">
                        <FaEye />
                      </Button>
                      <Button variant="primary" size="sm" className="me-2">
                        <FaEdit />
                      </Button>
                      <Button variant="primary" size="sm">
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>Mason Porter</td>
                    <td>$78,615</td>
                    <td>Chile</td>
                    <td>Gloucester</td>
                    <td>
                      <Button variant="primary" size="sm" className="me-2">
                        <FaEye />
                      </Button>
                      <Button variant="primary" size="sm" className="me-2">
                        <FaEdit />
                      </Button>
                      <Button variant="primary" size="sm">
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default UserList;
