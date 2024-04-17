import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../CssAll/LoginCss.css";
const CreateAccount = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [subscribe, setSubscribe] = useState(false);
  const [show, setShow] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [data, setData] = useState([]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleSubscribeChange = () => {
    setShow(subscribe ? false : true);
    setSubscribe(!subscribe);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/users");
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to ensure this effect runs only once

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      window.alert("รหัสผ่านไม่ถูกต้อง");
      return; // ไม่ทำการส่งข้อมูลถ้ารหัสผ่านไม่ตรงกัน
    } else if (data.some((d) => d.username === username)) {
      window.alert("ชื่อผู้ใช้ของคุณถูกใช้โดยผู้ใช้อื่น");
      return; // ไม่ทำการส่งข้อมูลถ้าชื่อผู้ใช้ซ้ำ
    }else if (data.some((d) => d.email === email)) {
      window.alert("อีเมลของคุณถูกใช้โดยผู้อื่น");
      return; // ไม่ทำการส่งข้อมูลถ้าชื่อผู้ใช้ซ้ำ
    }



    try {
      let result = await axios.post("/users", {
        username: username,
        email: email,
        password: password,
        provider: "local",
        confirmed: true,
        blocked: false,
        role: 1,
      });
    } catch (e) {
      console.log(e);
      console.log("wrong username & password");
    }
    navigate("/LoginForm");
  };

  return (
    <div className="login">
      <h1 className="name1">สมัครสมาชิก</h1>
      <div className="carkeypic1">
        <img src="carkey.png"></img>
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>ชื่อ</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicemail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>รหัสผ่าน</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicConfirmPassword">
          <Form.Label>ยืนยันรหัสผ่าน</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicCheckbox">
          <Form.Check
            style={{
              marginTop: "10px",
            }}
            type="checkbox"
            label="ยอมรับเงื่อนไขการให้บริการ"
            checked={subscribe}
            onChange={handleSubscribeChange}
          />
        </Form.Group>

        <Button
          className="Buttonlogin"
          style={{
            display: "block",
            margin: "auto",
            marginTop: "20px",
            background: "linear-gradient(to bottom, #000000, #737373)",
            color: "white",
          }}
          type="submit"
          disabled={!subscribe}
        >
          สมัครสมาชิก
        </Button>

        <a href="/LoginForm">
          <h1 className="account">เป็นสมาชิกอยู่แล้ว</h1>
        </a>
      </Form>
      <button className="icon-button" onClick={() => navigate("/")}>
        <img src="back.png"></img>
      </button>
      <Modal show={show} onHide={handleSubscribeChange} centered>
        <Modal.Header closeButton>
          <Modal.Title>เงื่อนไขการให้บริการ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>เงื่อนไขการใช้งาน:</h5>
          <p>
            ผู้เช่าต้องมีอายุไม่ต่ำกว่า 21
            ปีและต้องมีใบขับขี่ที่ถูกต้องและใช้ได้ในประเทศที่เช่ารถ
            นอกจากนี้เช่ารถให้ผู้เช่าเท่านั้นและไม่สามารถให้คนอื่นขับได้โดยไม่ได้รับอนุญาต
          </p>

         
          <h5>การชำระเงิน</h5>
          <p>
            ค่าเช่ารถต้องชำระล่วงหน้าและมีการเก็บเงินประกันในบางกรณี
            ผู้เช่าต้องใช้บัตรเครดิตหรือวิธีการชำระเงินอื่นที่ได้รับการอนุมัติ
          </p>
          <h5>การใช้งาน</h5>
          <p>
            ผู้เช่าต้องใช้รถในวัตถุประสงค์ที่ถูกต้องและไม่สามารถใช้ในการขนส่งวัตถุอันตรายหรือการกระทำที่ผิดกฎหมาย
          </p>
          <h5>การบำรุงรักษารถ</h5>
          <p>
            ผู้เช่าต้องรักษารถในสภาพสมบูรณ์และส่งคืนตามกำหนด
            นอกจากนี้ยังต้องดูแลและรักษาประกันภัยในระหว่างการใช้งาน
          </p>
          <h5>ค่าปรับและค่าธรรมเนียม</h5>
          <p>
            ผู้เช่าต้องรับผิดชอบค่าปรับในกรณีที่รถเสียหรือได้รับความเสียหาย
            นอกจากนี้ยังมีค่าธรรมเนียมเพิ่มเติมสำหรับการใช้บริการพิเศษ เช่น
            การใช้งาน GPS หรือเกียร์อัตโนมัติ
          </p>
          <h5>การคุ้มครองและประกัน</h5>
          <p>
            บริษัทจะมีการคุ้มครองประกันพื้นฐานสำหรับรถเช่า
            แต่ผู้เช่าสามารถเพิ่มความคุ้มครองเพิ่มเติมได้โดยจ่ายค่าเพิ่มเติม
          </p>
          <h5>การคืนรถ</h5>
          <p>
            ผู้เช่าต้องคืนรถตามเวลาที่กำหนด
            หากคืนล่าช้าอาจมีค่าปรับและผู้เช่าต้องรับผิดชอบค่าใช้จ่ายที่เกิดขึ้นจากการคืนล่าช้า
          </p>
          <h5>การขับขี่ตามกฎหมาย</h5>
          <p>
            ผู้เช่าต้องปฏิบัติตามกฎหมายจราจรในทุกประการขณะขับขี่และรับผิดชอบในการละเมิดกฎหมายจราจร
          </p>
          <h5>ข้อตกลงทั่วไป</h5>
          <p>
            เงื่อนไขเหล่านี้มีผลบังคับต่อทั้งผู้เช่าและบริษัทเช่ารถ
            และการใช้บริการเช่ารถจะถือว่าผูกพันตามเงื่อนไขที่ระบุไว้ทั้งหมด
          </p>
          <h5>เงื่อนไขในการรับรถ</h5>
          <p>
            -ใช้ใบขับขี่ของลูกค้าในการยืนยันเพื่อรับรถ
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleSubscribeChange}>
            ไม่ยอมรับเงื่อนไข
          </Button>
          <Button variant="primary" onClick={() => setShow(false)}>
            ยอมรับเงื่อนไข
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateAccount;
