import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container, Row, Col, Card } from "react-bootstrap";

function App() {
  return (
    <>
      <div className="App">
        {/* Navbar */}
        <Navbar bg="dark" expand="lg" sticky="top">
          <Container>
            <Navbar.Brand href="#home">My App</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#features">Features</Nav.Link>
                <Nav.Link href="#about">About</Nav.Link>
                <Nav.Link href="#contact">Contact</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Main Content */}
        <Container className="mt-5">
          {/* Heading */}
          <h1 className="mb-4 text-center">Welcome to My Application</h1>

          {/* Cards */}
          <Row className="g-4">
            {/* Card 1 */}
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Card One</Card.Title>
                  <Card.Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </Card.Text>
                  <a href="#" className="btn btn-primary">
                    Learn More
                  </a>
                </Card.Body>
              </Card>
            </Col>

            {/* Card 2 */}
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Card Two</Card.Title>
                  <Card.Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </Card.Text>
                  <a href="#" className="btn btn-primary">
                    Learn More
                  </a>
                </Card.Body>
              </Card>
            </Col>

            {/* Card 3 */}
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Card Three</Card.Title>
                  <Card.Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </Card.Text>
                  <a href="#" className="btn btn-primary">
                    Learn More
                  </a>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default App;
