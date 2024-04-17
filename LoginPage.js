import React, { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../CssAll/LoginCss.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitEnabled, setSubmitEnabled] = useState(true);
  const [show, setShow] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitEnabled(false);

    try {
      const result = await axios.post("/auth/local", {
        identifier: username,
        password: password,
      });

      //เก็บ jwt ในฟังก์ชั่นเพื่อเรียกใช้งานในหน้า component อื่น
      const saveTokenTosessionStorage = (token) => {
        sessionStorage.setItem("jwtToken", token); //เก็บ jwt token
      };
      saveTokenTosessionStorage(result.data.jwt);
      sessionStorage.setItem("username", result.data.user.username);
      sessionStorage.setItem("iduser", result.data.user.id);
      const config = {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
        },
      };

      //เช็ค role
      const userResult = await axios.get("/users/me?populate=role", config);

      // Step 4: Check user's role and navigate accordingly
      if (userResult.data.role) {
        if (userResult.data.role.name === "Member") {
          sessionStorage.setItem("role", userResult.data.role.name);
          navigate("/");
        }
        if (userResult.data.role.name === "Admin") {
          sessionStorage.setItem("role", userResult.data.role.name);
          navigate("/AdminPage");
        }
      }

      console.log("userresult", userResult);
    } catch (e) {
      console.log(e);
      console.log("wrong username & password");
      alert("Your username or password is wrong");
      setSubmitEnabled(true);
    }
  };

  return (
    <div>
      <div className="login">
        <h1 className="name1">เข้าสู่ระบบ</h1>
        <div className="carlogo1">
          <img src="carlogo.png"></img>
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicUsername">
            <Form.Label>Email or Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </Form.Group>
          <a onClick={() => setShow(true)}>
            <h1 className="account1" >ลืมรหัสผ่าน?</h1>
          </a>

          <Button /* className="blackButton" */
            style={{
              display: "block",
              margin: "auto",
              marginTop: "20px",
              background: "linear-gradient(to bottom, #000000, #737373)",
              color: "white", // ตั้งค่าสีข้อความเป็นสีขาว
            }}
            type="submit"
            disabled={!submitEnabled}
          >
            เข้าสู่ระบบ
          </Button>

          <a href="/CreateAccount">
            <h1 className="account">ยังไม่มีบัญชี?</h1>
          </a>
        </Form>
        <button className="icon-button" onClick={() => navigate("/")}>
          <img src="back.png"></img>
        </button>
      </div>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>กรุณาติดต่อผู้ให้บริการ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3>ช่องทางติดต่อ</h3>
          <p>Line : @rodchao</p>
          <p>Facebook : รถเช่าร้านผมไม่เล็กนะครับ</p>
          <p>เบอร์โทร : 087-653-1456</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LoginForm;
