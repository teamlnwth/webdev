import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../CssAll/DetailsPage.css";
function StaticExample({ id }) {
  const navigate = useNavigate();
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [show, setShow] = useState(false);
  const config = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
    },
  };

  useEffect(() => {
  
    axios
      .get(`/cars/${id}?populate=*`,config) // ใช้ id ที่ส่งเข้ามาในการเรียก API
      .then(({ data }) => {
        setData2(data.data.attributes.bookings.data.length);
        if (data2 !== 0) {
          setData1(data.data.attributes.bookings.data.map((d) => d.id));
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  console.log(data1);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      if (data2 !== 0) {
        // ให้ใช้ Promise.all เพื่อรอให้ทุก request เสร็จสิ้น
        data1.map((i) => {
          try {
            axios.delete(`/bookings/${i}`,config);
            console.log(`Entry with ID ${i} deleted successfully`);
          } catch (error) {
            console.error(
              `Error deleting entry with ID ${i}: ${error.message}`
            );
          }
        });
      }

      axios.delete(`/cars/${id}`,config);
      console.log(`Event with ID ${id} deleted successfully`);
      navigate("/AdminPage");
    } catch (error) {
      console.error(`Error deleting entries and event: ${error.message}`);
    }
  };

  return (
    <>
      <Button
        className="Delete"
        variant="danger"
        onClick={handleShow}
        style={{ display: "block", marginLeft: "10px", marginTop: "21px" }}
      >
        ลบรถคันนี้
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>กำจัดรถ</Modal.Title>
        </Modal.Header>
        <Modal.Body>ท่านต้องการกำจัดรถทิ้งหรือไม่</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            ยกเลิก
          </Button>
          <Button variant="danger" onClick={handleSubmit}>
            ยืนยัน
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default StaticExample;
