import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useState } from "react";

function PublicNav(props) {
  const onhome = props.onhome;//parameter true false
  const [searchQuery, setSearchQuery] = useState("");
  // senddatatoNav.js
  const sendtoNAV = (text) => {
    props.onSearch(text);
  };
  return (
    <div className="sticky-nav">
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand href="/">รถเช่าผมไม่เล็กนะครับ</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            ></Nav>

            <div className="search-area">
              {props.onhome === true &&
              <Form className="d-flex">
              <Form.Control
                value={searchQuery}
                type="search"
                placeholder="ค้นหาแบรนด์รถที่ต้องการ"
                className="me-2"
                aria-label="Search"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                variant="dark"
                className="search-btn"
                onClick={() => sendtoNAV(searchQuery)}
              >
                ค้นหา
              </Button>
            </Form>
              }
              
            </div>

            <div className="titleogin">
              <a href="/CreateAccount">
                <h1>สมัครสมาชิก</h1>
              </a>
              <a href="/LoginForm">
                <h1>เข้าสู่ระบบ</h1>
              </a>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default PublicNav;
