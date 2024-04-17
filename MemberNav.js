import React from "react";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import "../CssAll/LoginCss.css";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useState } from "react";

function MemberNav(props) {
  const username = sessionStorage.getItem("username");
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
                placeholder="ค้นหาแบรนด์รถที่ต้องการ "
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

            <div className="titelogin">
              <DropdownButton
                id="dropdown-basic-button"
                title={username}
                className="dropdown-with-image"
              >
                <Dropdown.Item onClick={props.onlogout}>Logout</Dropdown.Item>
              </DropdownButton>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default MemberNav;
