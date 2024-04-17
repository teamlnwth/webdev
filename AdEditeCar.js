
import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useNavigate, useParams } from "react-router-dom";

const AdEditeCar = (props) => {
  const id = props.id
  const fetchdetail = props.fetchData
  const [data, setData] = useState({});
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [carName, setCarName] = useState("");
  const [carDescription, setCarDescription] = useState("");
  const [carPrice, setCarPrice] = useState("");
  const [quantityLeft, setQuantityLeft] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [Idimg, setIdimg] = useState("");
  const config = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
    },
  };

  // useEffect to fetch car data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/cars/${id}?populate=*`,config
        );
        const fetchedData = response.data.data;
        setData(fetchedData);
        setCarName(fetchedData.attributes.namecar);
        setCarDescription(fetchedData.attributes.description);
        setCarPrice(fetchedData.attributes.price);
        setQuantityLeft(fetchedData.attributes.remaining);
        setIdimg(fetchedData.attributes.imgcar.data.id);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);
 

  // Function to handle image change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
  };
  
  // Function to handle car name change
  const handlecarName = (event) => {
    setCarName(event.target.value);
  };

  // Function to handle car description change
  const handlecarDescription = (event) => {
    setCarDescription(event.target.value);
  };

  // Function to handle car price change
  const handlecarPrice = (event) => {
    setCarPrice(event.target.value);
  };

  // Function to handle quantity left change
  const handlequantityLeft = (event) => {
    setQuantityLeft(event.target.value);
  };

  // Function to save changes after editing
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      let formData2 = {
        namecar: carName,
        description: carDescription,
        price: parseInt(carPrice),
        remaining: parseInt(quantityLeft),
      };
      if (imageFile !== null) {
        const formData = new FormData();
        formData.append("files", imageFile);
        const uploadResponse = await axios.post(
          "/upload",
          formData,config
        );
        formData2.imgcar = parseInt(uploadResponse.data[0].id);
      } else {
        formData2.imgcar = parseInt(Idimg);
      }
      await axios.put(
        `/cars/${id}?populate=*`,
        { data: formData2 },config
        
      );
      handleClose();
      // Optionally, you can add success message or additional actions here
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally{
      handleClose();
      fetchdetail();
    }
    //window.location.reload(); // Reload the page
    
  };

  return (
    <>
      <Button
        variant="dark"
        onClick={handleShow}
        style={{ display: "block", margin: "auto", marginTop: "21px" }}
      >
        แก้ไข
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>แก้ไขรายละเอียด</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="carName">
              <Form.Label>รุ่น - ยี่ห้อ</Form.Label>
              <Form.Control
                type="text"
                placeholder="Car Name"
                value={carName}
                onChange={handlecarName}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="carDescription">
              <Form.Label>รายละเอียด</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Description"
                value={carDescription}
                onChange={handlecarDescription}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="carPrice">
              <Form.Label>ราคา</Form.Label>
              <Form.Control
                type="number"
                placeholder="Price"
                value={carPrice}
                onChange={handlecarPrice}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="quantityLeft">
              <Form.Label>จำนวน</Form.Label>
              <Form.Control
                type="number"
                placeholder="Quantity Left"
                value={quantityLeft}
                onChange={handlequantityLeft}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="imageFile">
              <Form.Label>รูปประกอบ</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            ปิด
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            บันทึก
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdEditeCar;
